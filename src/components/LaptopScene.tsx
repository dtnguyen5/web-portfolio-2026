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
const SCREEN_DURATION = 5;
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

// The screen texture keeps the design's own resolution (within these limits),
// so a sharp, large export stays sharp and a small one isn't resampled twice.
const MIN_TEXTURE_WIDTH = 1024;
const MAX_TEXTURE_WIDTH = 4096;

const fitToScreen = (image: HTMLImageElement, screenAspect: number, maxTextureSize: number) => {
  const canvas = document.createElement("canvas");
  const limit = Math.min(MAX_TEXTURE_WIDTH, maxTextureSize, Math.floor(maxTextureSize * screenAspect));
  canvas.width = Math.min(Math.max(image.width, MIN_TEXTURE_WIDTH), limit);
  canvas.height = Math.round(canvas.width / screenAspect);
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

// One clock for the screen and the camera, so each new design arrives with a
// new camera shot. It only runs once the model is loaded.
type ShowClock = { current: number };

const Laptop = ({ clockRef, screens, onReady }: Omit<LaptopSceneProps, "running"> & { clockRef: ShowClock }) => {
  const textures = useLoader(THREE.TextureLoader, screens);
  const { scene } = useGLTF(MODEL);
  const gl = useThree((state) => state.gl);
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
          map: fitToScreen(texture.image as HTMLImageElement, screenAspect, gl.capabilities.maxTextureSize),
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
  }, [gl, scene, textures]);

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
    clockRef.current += delta;
    const layers = screenLayers.current;
    if (!layers.length) {
      return;
    }

    const block = Math.floor(clockRef.current / SCREEN_DURATION);
    const current = block % layers.length;
    const previous = (block + layers.length - 1) % layers.length;
    // The next design fades in on top of the previous one, which stays fully
    // visible underneath until the fade is done.
    const fade =
      block === 0 || layers.length === 1 ? 1 : clamp01((clockRef.current - block * SCREEN_DURATION) / FADE_DURATION);
    const fadedIn = fade >= 1;

    layers.forEach((layer, index) => {
      if (index === current) {
        layer.material.opacity = smooth(fade);
        layer.renderOrder = 2;
      } else {
        layer.material.opacity = index === previous && !fadedIn ? 1 : 0;
        layer.renderOrder = index === previous ? 1 : 0;
      }
    });
  });

  return <primitive object={model} scale={SCALE} />;
};

// The camera works like a film crew rather than a turntable: every design
// gets its own shot (a wide establishing view, a close-up on the screen, a low
// side angle, a three-quarter view...). Within a shot the camera dollies slowly;
// when the design changes it glides to the next shot. Every position is in
// front of the laptop, so a glide never passes through it.
type Vec3 = [number, number, number];
type Shot = { from: Vec3; to: Vec3; target: Vec3; targetTo: Vec3; fov: number };

const SHOTS: Shot[] = [
  // Establishing three-quarter view from the left.
  { from: [-3.4, 2.3, 5.6], to: [-2.8, 2.0, 5.0], target: [0, 0.7, -0.5], targetTo: [0, 0.75, -0.5], fov: 35 },
  // Close-up: the design fills the frame.
  { from: [0.35, 1.05, 3.9], to: [-0.15, 0.95, 3.3], target: [0, 0.85, -0.6], targetTo: [0, 0.85, -0.6], fov: 32 },
  // Low angle from the right, rising slowly.
  { from: [4.4, 0.55, 3.6], to: [3.6, 0.8, 4.2], target: [-0.2, 0.7, -0.4], targetTo: [0, 0.7, -0.4], fov: 35 },
  // Three-quarter view from the right, a little above the screen.
  { from: [2.7, 2.1, 4.7], to: [2.1, 1.8, 4.1], target: [0, 0.8, -0.5], targetTo: [0, 0.8, -0.5], fov: 33 },
  // Grazing close view along the screen from the left.
  { from: [-3.0, 0.9, 2.4], to: [-2.5, 1.1, 2.9], target: [0.3, 0.85, -0.6], targetTo: [0.3, 0.85, -0.6], fov: 30 },
  // Wide, straight-on, slowly pushing in.
  { from: [0, 2.4, 7.4], to: [0, 2.0, 6.6], target: [0, 0.6, -0.4], targetTo: [0, 0.6, -0.4], fov: 35 },
];

// How long the camera takes to glide from one shot to the next.
const SHOT_TRANSITION = 2.2;
const easeInOut = (value: number) => (value < 0.5 ? 4 * value ** 3 : 1 - (-2 * value + 2) ** 3 / 2);

const CameraRig = ({ clockRef }: { clockRef: ShowClock }) => {
  const size = useThree((state) => state.size);
  const still = useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const vectors = useRef({
    position: new THREE.Vector3(),
    target: new THREE.Vector3(),
    previousPosition: new THREE.Vector3(),
    previousTarget: new THREE.Vector3(),
    end: new THREE.Vector3(),
    parallax: new THREE.Vector2(),
  });

  // Where shot `index` has the camera `time` seconds after it started. A shot
  // keeps moving through the glide out of it, so nothing ever stops dead.
  const pose = (v: typeof vectors.current, index: number, time: number, position: THREE.Vector3, target: THREE.Vector3) => {
    const shot = SHOTS[((index % SHOTS.length) + SHOTS.length) % SHOTS.length];
    const progress = clamp01(time / (SCREEN_DURATION + SHOT_TRANSITION));
    position.set(...shot.from).lerp(v.end.set(...shot.to), progress);
    target.set(...shot.target).lerp(v.end.set(...shot.targetTo), progress);
    return shot.fov;
  };

  useFrame((state, delta) => {
    const v = vectors.current;
    const { camera } = state;
    // With reduced motion the camera holds the first shot.
    const time = still ? 0 : clockRef.current;
    const block = Math.floor(time / SCREEN_DURATION);
    const local = time - block * SCREEN_DURATION;
    let fov = pose(v, block, local, v.position, v.target);

    if (block > 0 && local < SHOT_TRANSITION) {
      const previousFov = pose(v, block - 1, local + SCREEN_DURATION, v.previousPosition, v.previousTarget);
      const blend = easeInOut(local / SHOT_TRANSITION);
      v.position.lerpVectors(v.previousPosition, v.position, blend);
      v.target.lerpVectors(v.previousTarget, v.target, blend);
      fov = previousFov + (fov - previousFov) * blend;
    }

    // Narrow (portrait) screens pull the camera back to keep the laptop in view.
    const zoom = Math.max(1, 1.25 / (size.width / size.height));
    v.position.sub(v.target).multiplyScalar(zoom).add(v.target);

    // The camera leans a little towards the pointer.
    if (!still) {
      v.parallax.lerp(state.pointer, 1 - Math.exp(-delta * 2));
      v.position.x += v.parallax.x * 0.3;
      v.position.y += v.parallax.y * 0.15;
    }

    camera.position.copy(v.position);
    camera.lookAt(v.target);
    if (camera instanceof THREE.PerspectiveCamera && camera.fov !== fov) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  });

  return null;
};

// Sharpness (device pixel ratio) the scene starts with, and the lowest it
// drops to on a device that can't keep up.
const MAX_DPR = 2;
const MIN_DPR = 1;

const LaptopScene = ({ screens, running, onReady }: LaptopSceneProps) => {
  const [dpr, setDpr] = useState(() => Math.min(window.devicePixelRatio, MAX_DPR));
  const clockRef = useRef(0);

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
      <CameraRig clockRef={clockRef} />
      <Suspense fallback={null}>
        <Laptop clockRef={clockRef} onReady={onReady} screens={screens} />
      </Suspense>
    </Canvas>
  );
};

export default LaptopScene;
