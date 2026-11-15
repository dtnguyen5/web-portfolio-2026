"use client";

import { Environment, Lightformer, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type LaptopSceneProps = {
  screens: string[];
  running: boolean;
  // Called once the model and the designs have loaded.
  onReady: () => void;
};

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
// Ease in and out, so a fade starts and ends gently.
const smooth = (value: number) => value * value * (3 - 2 * value);

// MacBook Pro 14" M5 by Apple User on Sketchfab (Sketchfab Standard licence,
// see public/models/license.txt). This is scene.gltf made smaller (lighter
// geometry, JPEG textures) and without the wallpaper on the display, where
// the sample designs go instead.
const MODEL = "/models/macbook/macbook.gltf";
const SCREEN_MATERIAL = "HlQwFCAPWzetDQy";
// The model is in metres (31.2 cm wide); it is scaled up to 3 scene units.
const SCALE = 3 / 0.312;

type ScreenMesh = THREE.Mesh<THREE.BufferGeometry, THREE.MeshBasicMaterial>;

// Each design stays on the screen for a few seconds, then the next one fades
// in over it.
const SCREEN_DURATION = 4;
const FADE_DURATION = 1.2;

// Images rarely match the screen's proportions. An image whose edges along
// the extra space are one flat colour (a logo on white, a site on black) is
// shown whole and that colour fills the rest, so no bar shows. Photos that run
// to the edge are squeezed a little (at most MAX_SQUEEZE) and the rest is
// cropped evenly, so they fill the screen without looking stretched.
const MAX_SQUEEZE = 0.07;

const flatEdgeColor = (image: CanvasImageSource, wide: boolean) => {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const context = canvas.getContext("2d", { willReadFrequently: true })!;
  context.drawImage(image, 0, 0, 64, 64);
  // The two edges the extra space touches: top and bottom rows for a wide image.
  const edges = wide
    ? [context.getImageData(0, 0, 64, 1), context.getImageData(0, 63, 64, 1)]
    : [context.getImageData(0, 0, 1, 64), context.getImageData(63, 0, 1, 64)];
  const pixels = edges.flatMap(({ data }) =>
    Array.from({ length: data.length / 4 }, (_, i) => [data[i * 4], data[i * 4 + 1], data[i * 4 + 2]]),
  );
  // The most common colour along the edges; a button touching the edge is fine
  // as long as at least 90% of the edge has that colour.
  const key = (pixel: number[]) => pixel.map((value) => Math.round(value / 16)).join();
  const counts = new Map<string, number[][]>();
  pixels.forEach((pixel) => counts.set(key(pixel), [...(counts.get(key(pixel)) ?? []), pixel]));
  const common = [...counts.values()].sort((a, b) => b.length - a.length)[0];
  const color = [0, 1, 2].map((c) => common.reduce((sum, pixel) => sum + pixel[c], 0) / common.length);
  const matching = pixels.filter((pixel) => pixel.every((value, c) => Math.abs(value - color[c]) < 14));
  return matching.length >= pixels.length * 0.9 ? `rgb(${color.map(Math.round).join(",")})` : null;
};

const fitToScreen = (image: HTMLImageElement, screenAspect: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = Math.round(2048 / screenAspect);
  const context = canvas.getContext("2d")!;
  context.imageSmoothingQuality = "high";
  const imageAspect = image.width / image.height;
  const wide = imageAspect > screenAspect;
  const fill = flatEdgeColor(image, wide);

  if (fill) {
    // Whole image, centred, on its own background colour.
    const scale = Math.min(canvas.width / image.width, canvas.height / image.height);
    context.fillStyle = fill;
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
      image,
      (canvas.width - image.width * scale) / 2,
      (canvas.height - image.height * scale) / 2,
      image.width * scale,
      image.height * scale,
    );
  } else {
    // Squeeze up to MAX_SQUEEZE towards the screen's proportions, crop the rest.
    const squeeze = wide
      ? Math.max(screenAspect / imageAspect, 1 - MAX_SQUEEZE)
      : Math.max(imageAspect / screenAspect, 1 - MAX_SQUEEZE);
    const shownAspect = wide ? imageAspect * squeeze : imageAspect / squeeze;
    const sourceWidth = wide ? image.width * Math.min(1, screenAspect / shownAspect) : image.width;
    const sourceHeight = wide ? image.height : image.height * Math.min(1, shownAspect / screenAspect);
    context.drawImage(
      image,
      (image.width - sourceWidth) / 2,
      (image.height - sourceHeight) / 2,
      sourceWidth,
      sourceHeight,
      0,
      0,
      canvas.width,
      canvas.height,
    );
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  // glTF texture coordinates start at the top.
  texture.flipY = false;
  return texture;
};

const Laptop = ({ screens, onReady }: Omit<LaptopSceneProps, "running">) => {
  const textures = useLoader(THREE.TextureLoader, screens);
  const { scene } = useGLTF(MODEL);
  const gl = useThree((state) => state.gl);
  const screen = useRef({ index: 0, previous: 0, time: FADE_DURATION });
  const screenLayers = useRef<ScreenMesh[]>([]);
  // The display gets one layer per design, on the same geometry as the model's screen.
  const { model, layers } = useMemo(() => {
    const model = scene.clone();
    let display: THREE.Mesh | undefined;
    // Clearcoat (physical) materials cost a lot to draw and make no visible
    // difference at this size, so they become plain standard materials.
    const simpler = new Map<THREE.Material, THREE.Material>();
    model.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) {
        return;
      }
      if (object.material instanceof THREE.MeshPhysicalMaterial) {
        const source = object.material;
        if (!simpler.has(source)) {
          simpler.set(source, new THREE.MeshStandardMaterial().copy(source));
        }
        object.material = simpler.get(source);
      }
      if (object.material.name === SCREEN_MATERIAL) {
        display = object;
      }
    });
    if (!display?.parent) {
      return { model, layers: [] };
    }

    // The screen is tilted with the lid: its height runs along both y and z.
    display.geometry.computeBoundingBox();
    const size = display.geometry.boundingBox!.getSize(new THREE.Vector3()).multiply(display.scale);
    const screenAspect = size.x / Math.hypot(size.y, size.z);

    display.visible = false;
    const layers = textures.map((texture, index) => {
      const layer: ScreenMesh = new THREE.Mesh(
        display!.geometry,
        new THREE.MeshBasicMaterial({
          depthWrite: false,
          map: fitToScreen(texture.image as HTMLImageElement, screenAspect),
          opacity: index === 0 ? 1 : 0,
          toneMapped: false,
          transparent: true,
        }),
      );
      layer.position.copy(display!.position);
      layer.quaternion.copy(display!.quaternion);
      layer.scale.copy(display!.scale);
      display!.parent!.add(layer);
      return layer;
    });

    return { model, layers };
  }, [scene, textures]);

  useLayoutEffect(() => {
    layers.forEach((layer) => {
      layer.material.map!.anisotropy = gl.capabilities.getMaxAnisotropy();
    });
    screenLayers.current = layers;
  }, [gl, layers]);

  useEffect(() => {
    onReady();
  }, [onReady]);

  useFrame((_, delta) => {
    screen.current.time += delta;
    if (screen.current.time > SCREEN_DURATION && screens.length > 1) {
      const { index } = screen.current;
      screen.current = { index: (index + 1) % screens.length, previous: index, time: 0 };
    }

    // The next design fades in on top of the previous one, which stays fully
    // visible underneath until the fade is done.
    const { index: current, previous } = screen.current;
    const layers = screenLayers.current;
    const incoming = layers[current];
    const fade = clamp01(screen.current.time / FADE_DURATION);
    if (incoming) {
      incoming.material.opacity = smooth(fade);
      incoming.renderOrder = 2;
    }
    const fadedIn = fade >= 1;

    layers.forEach((layer, index) => {
      if (index !== current) {
        layer.material.opacity = index === previous && !fadedIn ? 1 : 0;
        layer.renderOrder = index === previous ? 1 : 0;
      }
    });
  });

  return <primitive object={model} scale={SCALE} />;
};

// The camera never stops: it drifts around the laptop on slow, overlapping
// waves (side to side, up and down, closer and further), so the motion is
// continuous and never repeats exactly.
const TAU = Math.PI * 2;
const wave = (time: number, period: number, phase = 0) => Math.sin((time / period) * TAU + phase);

const CameraRig = () => {
  const { camera, size } = useThree();
  const time = useRef(0);
  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const target = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (!still) {
      time.current += delta;
    }
    const t = time.current;

    const azimuth = -0.35 + 0.5 * wave(t, 24);
    const elevation = 0.42 + 0.14 * wave(t, 17, 1.3);
    // Narrow (portrait) screens pull the camera back to keep the laptop in view.
    const zoom = Math.max(1, 1.25 / (size.width / size.height));
    const distance = (6.4 + 1.1 * wave(t, 19, 2.1)) * zoom;
    target.set(0.1 * wave(t, 21, 0.7), 0.75 + 0.12 * wave(t, 15, 2.6), -0.55);

    camera.position.set(
      target.x + distance * Math.sin(azimuth) * Math.cos(elevation),
      target.y + distance * Math.sin(elevation),
      target.z + distance * Math.cos(azimuth) * Math.cos(elevation),
    );
    camera.lookAt(target);
  });

  return null;
};

// Sharpness (device pixel ratio) the scene starts with, and the lowest it
// drops to on a device that can't keep up.
const MAX_DPR = 1.5;
const MIN_DPR = 1;

const LaptopScene = ({ screens, running, onReady }: LaptopSceneProps) => {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, MAX_DPR));

  return (
    <Canvas
      camera={{ fov: 35, position: [0, 2, 7.5] }}
      dpr={dpr}
      frameloop={running ? "always" : "never"}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
    >
      {/* Lowers the sharpness when the frame rate drops, and raises it back once it recovers. */}
      <PerformanceMonitor
        onDecline={() => setDpr(MIN_DPR)}
        onIncline={() => setDpr(Math.min(window.devicePixelRatio, MAX_DPR))}
      />
      <ambientLight intensity={0.6} />
      <directionalLight intensity={2.2} position={[3, 6, 4]} />
      <directionalLight intensity={0.8} position={[-4, 3, -2]} />
      {/* Soft studio reflections on the aluminium, built from light panels so no HDR file is needed. */}
      <Environment resolution={256}>
        <Lightformer form="rect" intensity={4} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={3} position={[0, 4, 5]} scale={[10, 2, 1]} />
        <Lightformer form="rect" intensity={2.2} position={[-6, 2, 1]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[6, 1.5, 1]} />
      </Environment>
      <CameraRig />
      <Suspense fallback={null}>
        <Laptop onReady={onReady} screens={screens} />
      </Suspense>
    </Canvas>
  );
};

export default LaptopScene;
