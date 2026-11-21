'use client'

/* =============================================================================
 * AVATAR 3D – postavička v sekci „O mně“
 * -----------------------------------------------------------------------------
 * 3D model z Blenderu (public/models/avatar.glb), který sedí na židli a píše
 * na notebooku. Používá se v Portfolio.tsx místo fotky.
 *
 * Obsah souboru (shora dolů):
 *   1. NASTAVENÍ        – čísla, která budeš nejspíš chtít měnit (kamera, rychlosti…)
 *   2. POMOCNÉ FUNKCE   – drobnosti mimo React komponenty
 *   3. <Avatar>         – samotný model: animace psaní, natáčení za myší, rolující kód
 *   4. <CameraRig>      – kam se kamera dívá a jak daleko je (responzivita)
 *   5. <Avatar3D>       – hlavní komponenta: plátno, světla, stín, otáčení myší, výkon
 *
 * Knihovny:
 *   three               – samotné 3D (objekty, kamera, materiály)
 *   @react-three/fiber  – three.js jako React komponenty (<Canvas>, useFrame…)
 *   @react-three/drei   – hotové pomocníky (načtení modelu, stíny, ovládání myší…)
 *
 * Souřadnice ve 3D: X = doleva/doprava, Y = nahoru/dolů, Z = dopředu/dozadu.
 * Jednotky jsou metry – postavička i se židlí je vysoká cca 1,5.
 * ========================================================================== */

import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, useAnimations, OrbitControls, ContactShadows, Environment } from '@react-three/drei'
import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

/* =============================================================================
 * 1. NASTAVENÍ
 * ========================================================================== */

// Cesta k modelu ve složce public/ (POZOR: na hostingu záleží na velikosti písmen)
const MODEL = '/models/avatar.glb'

// --- Kamera ---
// Bod, na který se kamera dívá – zhruba výška notebooku / rukou.
const TARGET = new THREE.Vector3(0, 0.76, 0)
// Kde stojí kamera vůči TARGETu (z boku, stejný úhel jako v Blenderu):
//   X = -2.1  → zleva (kladné číslo = zprava, 0 = přímo zepředu)
//   Y = 0.46  → trochu shora (kamera ve výšce 1.22)
//   Z = 3.2   → vzdálenost před postavičkou
const CAMERA_OFFSET = new THREE.Vector3(-2.1, 1.22 - 0.76, 3.2)
// Úhel záběru kamery ve stupních (menší = víc „teleobjektiv“, větší = širší záběr)
const CAMERA_FOV = 30
// Poměr stran plátna (šířka / výška), při kterém je postavička vidět celá.
// Když je plátno užší (mobil na výšku), kamera o tolik couvne.
const FIT_ASPECT = 0.8

// --- Pohyb ---
// Jak moc se postavička natáčí za kurzorem (v radiánech, 0.25 ≈ 14°)
const MOUSE_FOLLOW_AMOUNT = 0.25
// Jak rychle se k tomu natočení dotáhne (0–1, menší = líněji)
const MOUSE_FOLLOW_SMOOTHING = 0.05
// Rychlost rolování kódu na displeji notebooku
const SCREEN_SCROLL_SPEED = 0.035
// Rychlost otáčení tažením myši
const ORBIT_SPEED = 0.8

// --- Výkon ---
// Jak daleko před sekcí (v px) se model začne načítat a vykreslovat
const PRELOAD_MARGIN = '300px 0px'

/* =============================================================================
 * 2. POMOCNÉ FUNKCE
 * ========================================================================== */

// Posune textury displeje nahoru → vypadá to, že po obrazovce roluje kód.
// Je mimo komponentu schválně: React Compiler jinak hlásí
// „This value cannot be modified“ (hodnoty z hooků bere jako neměnné).
function scrollTextures(textures: THREE.Texture[], amount: number) {
  for (const t of textures) t.offset.y = (t.offset.y + amount) % 1
}

/* =============================================================================
 * 3. <Avatar> – samotný model
 * ========================================================================== */

function Avatar({ dragging }: { dragging: React.RefObject<boolean> }) {
  const group = useRef<THREE.Group>(null)

  // Načtení .glb souboru – scene = všechny objekty, animations = akce z Blenderu
  const { scene, animations } = useGLTF(MODEL)
  const { actions } = useAnimations(animations, group)

  // Textury displeje notebooku (najdou se níž podle názvu materiálu)
  const screenTextures = useRef<THREE.Texture[]>([])

  // --- Po načtení modelu (proběhne jednou) ---
  useEffect(() => {
    // Spustí animaci psaní z Blenderu. Název musí sedět s názvem akce
    // v Blenderu (Action Editor) – smyčka je výchozí.
    actions['Typing']?.reset().play()

    // Projde všechny díly modelu a najde materiál „Screen“ (displej),
    // aby po něm mohl rolovat kód.
    // (castShadow záměrně ne: stínová mapa pro 219 dílů se počítala každý
    // snímek a web kvůli ní sekal – stín pod židlí řeší ContactShadows)
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (!mesh.isMesh) return
      const m = mesh.material as THREE.MeshStandardMaterial
      if (m?.name === 'Screen') {
        for (const t of [m.map, m.emissiveMap]) {
          if (t) {
            t.wrapT = THREE.RepeatWrapping // ať se textura při rolování opakuje
            screenTextures.current.push(t)
          }
        }
      }
    })
  }, [actions, scene])

  // --- Každý snímek (cca 60× za sekundu, jen když je postavička vidět) ---
  useFrame(({ pointer }, dt) => {
    // Jemné natáčení za kurzorem. pointer.x je -1 (vlevo) až 1 (vpravo).
    // Během otáčení tažením myši se vypne, ať se ty dva pohyby neperou.
    if (group.current && !dragging.current) {
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        pointer.x * MOUSE_FOLLOW_AMOUNT,
        MOUSE_FOLLOW_SMOOTHING,
      )
    }

    // Rolující kód na displeji. dt = čas od minulého snímku → stejná rychlost
    // na 60 Hz i 144 Hz monitoru.
    scrollTextures(screenTextures.current, dt * SCREEN_SCROLL_SPEED)
  })

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  )
}

/* =============================================================================
 * 4. <CameraRig> – pozice kamery (responzivita)
 * ========================================================================== */

// Namíří kameru na postavičku a podle poměru stran plátna ji oddálí, aby se
// vešla na úzké mobily i široké monitory. Přepočítá se při změně velikosti
// okna nebo otočení telefonu.
// Bez toho by se na mobilu (kde OrbitControls nejede) kamera dívala na podlahu
// a hlava by se ořízla.
function CameraRig() {
  const camera = useThree((s) => s.camera)
  const aspect = useThree((s) => s.size.width / s.size.height)

  useEffect(() => {
    const zoomOut = Math.max(1, FIT_ASPECT / aspect) // 1 = beze změny, víc = dál
    camera.position.copy(TARGET).add(CAMERA_OFFSET.clone().multiplyScalar(zoomOut))
    camera.lookAt(TARGET)
  }, [camera, aspect])

  return null // nic nevykresluje, jen nastavuje kameru
}

/* =============================================================================
 * 5. <Avatar3D> – hlavní komponenta (tohle se importuje v Portfolio.tsx)
 * ========================================================================== */

export default function Avatar3D() {
  // --- Otáčení myší jen na počítači ---
  // Na dotykových zařízeních by OrbitControls blokoval scroll stránky
  // (nastavuje touch-action: none), proto ho povolíme jen pro myš.
  // (komponenta se načítá s ssr: false, takže window tu vždy existuje)
  const [canOrbit] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )

  // true, když uživatel zrovna táhne myší (čte to <Avatar>)
  const dragging = useRef(false)

  // --- Výkon: vykreslovat jen když je postavička vidět ---
  // inView  = sekce je teď na obrazovce (nebo blízko) → vykresluje se
  // mounted = sekce už byla aspoň jednou blízko → model je načtený
  // Díky tomu se model (3 MB) nestahuje hned při otevření webu a mimo
  // obrazovku se render úplně zastaví, takže nebrzdí ostatní animace.
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
      { rootMargin: PRELOAD_MARGIN },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    // Obal vyplní rodiče – velikost boxu se nastavuje v Portfolio.tsx (.about-sidebar-image)
    <div ref={wrapper} style={{ width: '100%', height: '100%' }}>
      {mounted && (
        // --- 3D plátno (průhledné, takže je vidět pozadí stránky) ---
        <Canvas
          frameloop={inView ? 'always' : 'never'} // 'never' = mimo obrazovku se nekreslí
          camera={{ position: TARGET.clone().add(CAMERA_OFFSET), fov: CAMERA_FOV }}
          // na retina displejích max 1.5× – rozdíl skoro není vidět, ale je to o ~45 % méně pixelů
          dpr={[1, 1.5]}
          gl={{ powerPreference: 'high-performance' }}
        >
          <CameraRig />

          {/* Suspense: dokud se model načítá, nevykreslí se nic (fallback={null}) */}
          <Suspense fallback={null}>
            {/* --- Světla --- */}
            {/* Okolní osvětlení a odlesky (jako foto studio) */}
            <Environment preset="studio" environmentIntensity={0.6} />
            {/* Hlavní světlo – zepředu zleva, na straně kamery, aby byl vidět obličej */}
            <directionalLight position={[-1.8, 2.6, 1.8]} intensity={2} />
            {/* Kontra světlo – zezadu zprava, odliší postavičku od tmavého pozadí */}
            <directionalLight position={[0.8, 2.2, -2.2]} intensity={1.2} />

            {/* --- Postavička --- */}
            <Avatar dragging={dragging} />

            {/* --- Měkký stín pod židlí ---
                frames={1}: spočítá se jen jednou, ne každý snímek (postavička sedí na místě) */}
            <ContactShadows position={[0, 0, 0]} opacity={0.35} scale={3} blur={2.5} far={1.5} frames={1} />
          </Suspense>

          {/* --- Otáčení levým tlačítkem myši ---
              Do stran dokola (360°), nahoru/dolů omezeně, aby kamera nešla pod podlahu. */}
          <OrbitControls
            enabled={canOrbit}
            target={TARGET}
            enablePan={false} // posouvání vypnuté
            enableZoom={false} // kolečko myši scrolluje stránku, nezoomuje
            enableDamping // po puštění plynule dobrzdí
            rotateSpeed={ORBIT_SPEED}
            maxPolarAngle={Math.PI * 0.52} // max. úhel shora dolů (≈ 94°, kousek pod vodorovnou)
            onStart={() => (dragging.current = true)}
            onEnd={() => (dragging.current = false)}
          />
        </Canvas>
      )}
    </div>
  )
}
