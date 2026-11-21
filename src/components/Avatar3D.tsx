'use client'

// Postavička do sekce „O mně“ – Next.js / React
// 1) npm i three @react-three/fiber @react-three/drei
// 2) avatar.glb dej do: public/models/avatar.glb
// 3) použij: <Avatar3D />  (rodič musí mít výšku, např. h-[600px])

import { Canvas, useFrame } from '@react-three/fiber'
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

    // stíny + najdi texturu displeje, ať po ní může rolovat kód
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      mesh.castShadow = true
      mesh.receiveShadow = true
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

export default function Avatar3D() {
  // Na dotykových zařízeních OrbitControls blokuje scroll stránky (touch-action: none),
  // proto otáčení tažením povolíme jen pro myš.
  // (komponenta se načítá s ssr: false, takže window tu vždy existuje)
  const [canOrbit] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  const dragging = useRef(false)

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <Canvas shadows camera={{ position: [-2.1, 1.22, 3.2], fov: 30 }} dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.6} />
          <directionalLight position={[-1.8, 2.6, 1.8]} intensity={2} castShadow shadow-mapSize={[2048, 2048]} />
          <directionalLight position={[0.8, 2.2, -2.2]} intensity={1.2} />
          <Avatar dragging={dragging} />
          <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={3} blur={2.5} far={1.5} />
        </Suspense>
        {/* levé tlačítko myši = otáčení dokola (vodorovně bez omezení) */}
        <OrbitControls
          enabled={canOrbit}
          target={[0, 0.76, 0]}
          enablePan={false}
          enableZoom={false}
          enableDamping
          rotateSpeed={0.8}
          maxPolarAngle={Math.PI * 0.52}
          onStart={() => (dragging.current = true)}
          onEnd={() => (dragging.current = false)}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload(MODEL)
