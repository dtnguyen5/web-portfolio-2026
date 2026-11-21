'use client'

// Postavička do sekce „O mně“ – Next.js / React
// 1) npm i three @react-three/fiber @react-three/drei
// 2) avatar.glb dej do: public/models/avatar.glb
// 3) použij: <Avatar3D />  (rodič musí mít výšku, např. h-[600px])

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

const MODEL = '/models/avatar.glb'

// Mimo komponentu: three.js objekty se mutují každý snímek a React Compiler
// by jinak hlásil „This value cannot be modified“ (hodnoty z hooků bere jako neměnné).
function scrollTextures(textures: THREE.Texture[], amount: number) {
  for (const t of textures) t.offset.y = (t.offset.y + amount) % 1
}

function Avatar({ dragging }: { dragging: React.RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)
  const { scene, animations } = useGLTF(MODEL)
  const { actions } = useAnimations(animations, group)
  const screenTextures = useRef<THREE.Texture[]>([])

  useEffect(() => {
    // animace psaní z Blenderu (smyčka)
    actions['Typing']?.reset().play()

    // najdi texturu displeje, ať po ní může rolovat kód
    // (castShadow záměrně ne: stínová mapa pro 219 dílů modelu se počítala
    // každý snímek a web kvůli ní sekal – stín pod židlí řeší ContactShadows)
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const m = mesh.material as THREE.MeshStandardMaterial
      if (m?.name === 'Screen') {
        for (const t of [m.map, m.emissiveMap]) {
          if (t) {
            t.wrapT = THREE.RepeatWrapping
            screenTextures.current.push(t)
          }
        }
      }
    })
  }, [actions, scene])

  useFrame(({ pointer }, dt) => {
    // jemné natáčení za myší (animace z kódu)
    // během otáčení tažením myši natáčení vypneme, ať se ty dva pohyby neperou
    if (group.current && !dragging.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, pointer.x * 0.25, 0.05)
    }
    // rolující kód na displeji notebooku
    scrollTextures(screenTextures.current, dt * 0.035)
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

const TARGET = new THREE.Vector3(0, 0.76, 0)
// směr a vzdálenost kamery od postavičky (z boku, jako v Blenderu)
const CAMERA_OFFSET = new THREE.Vector3(-2.1, 1.22 - 0.76, 3.2)
// při tomhle poměru stran (šířka / výška) je postavička vidět celá i se židlí
const FIT_ASPECT = 0.8

// Namíří kameru na postavičku a podle poměru stran ji oddálí, aby se vešla
// na úzké mobily i široké monitory. Bez toho by se na mobilu (kde OrbitControls
// není) kamera dívala na podlahu a hlava by se ořízla.
function CameraRig() {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / s.size.height)

  useEffect(() => {
    const zoomOut = Math.max(1, FIT_ASPECT / aspect)
    camera.position.copy(TARGET).add(CAMERA_OFFSET.clone().multiplyScalar(zoomOut))
    camera.lookAt(TARGET)
  }, [camera, aspect])

  return null
}

export default function Avatar3D() {
  // Na dotykových zařízeních OrbitControls blokuje scroll stránky (touch-action: none),
  // proto otáčení tažením povolíme jen pro myš.
  // (komponenta se načítá s ssr: false, takže window tu vždy existuje)
  const [canOrbit] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  const dragging = useRef(false)

  // Výkon: scéna se vykresluje jen když je postavička (skoro) na obrazovce.
  // Mimo ni se render úplně zastaví, takže nebrzdí animace ve zbytku webu.
  // Model (3 MB) se navíc načte až když se k sekci blížíš, ne hned při načtení stránky.
  const wrapper = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const el = wrapper.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting) setMounted(true)
      },
      { rootMargin: '300px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={wrapper} style={{ width: '100%', height: '100%' }}>
      {mounted && (
      <Canvas
        frameloop={inView ? 'always' : 'never'}
        camera={{ position: [-2.1, 1.22, 3.2], fov: 30 }}
        // na retina displejích max 1.5× – rozdíl skoro není vidět, ale je to o ~45 % méně pixelů
        dpr={[1, 1.5]}
        gl={{ powerPreference: 'high-performance' }}
      >
        <CameraRig />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.6} />
          <directionalLight position={[-1.8, 2.6, 1.8]} intensity={2} />
          <directionalLight position={[0.8, 2.2, -2.2]} intensity={1.2} />
          <Avatar dragging={dragging} />
          {/* frames={1}: stín se spočítá jen jednou, ne každý snímek (postavička sedí na místě) */}
          <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={3} blur={2.5} far={1.5} frames={1} />
        </Suspense>
        {/* levé tlačítko myši = otáčení dokola (vodorovně bez omezení) */}
        <OrbitControls
          enabled={canOrbit}
          target={TARGET}
          enablePan={false}
          enableZoom={false}
          enableDamping
          rotateSpeed={0.8}
          maxPolarAngle={Math.PI * 0.52}
          onStart={() => (dragging.current = true)}
          onEnd={() => (dragging.current = false)}
        />
      </Canvas>
      )}
    </div>
  )
}
