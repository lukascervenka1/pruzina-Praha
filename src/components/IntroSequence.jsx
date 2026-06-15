import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'
import styles from './IntroSequence.module.css'

/* ─── deterministic torn-paper seam (same points used for both halves) ───── */
function useTornSeam(steps = 36) {
  return useMemo(() => {
    let s = 20259
    const rnd = () => { s = (s * 1664525 + 1013904223) % 4294967296; return s / 4294967296 }
    const pts = []
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * 100
      const wave  = Math.sin(i * 1.1) * 1.8
      const jit   = (rnd() - 0.5) * 6.4
      const spike = rnd() > 0.78 ? (rnd() - 0.5) * 8.5 : 0
      pts.push([x, Math.max(42, Math.min(58, 50 + wave + jit + spike))])
    }
    const rev = [...pts].reverse()
    return {
      top:    'polygon(0% 0%, 100% 0%, ' + rev.map(([x,y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ') + ')',
      bottom: 'polygon(' + pts.map(([x,y]) => `${x.toFixed(2)}% ${y.toFixed(2)}%`).join(', ') + ', 100% 100%, 0% 100%)',
    }
  }, [steps])
}

/* ─── spring helix geometry — compress 0..1 squashes height ─────────────── */
const COILS      = 8
const REST_H     = 4.4    // length when relaxed
const RADIUS     = 1.05   // coil radius
const TUBE_R     = 0.155  // wire thickness
const SEG_MULT   = 40     // segments per coil

function makeSpring(compress) {
  const h   = REST_H * (1 - 0.64 * compress)
  const segs = COILS * SEG_MULT
  const pts  = []
  for (let i = 0; i <= segs; i++) {
    const u = i / segs
    // slightly tighter coils at the ends (progressive-rate spring look)
    const taper = 1 - 0.25 * Math.pow(Math.abs(2 * u - 1), 2)
    const angle = u * COILS * Math.PI * 2
    pts.push(new THREE.Vector3(
      Math.cos(angle) * RADIUS * taper,
      -h / 2 + u * h,
      Math.sin(angle) * RADIUS * taper,
    ))
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), segs, TUBE_R, 18, false)
}

/* ─── flat ground plate ─────────────────────────────────────────────────── */
function makeEndPlate(radius) {
  return new THREE.CylinderGeometry(radius + 0.05, radius + 0.05, 0.06, 48)
}

export default function IntroSequence({ onComplete }) {
  const rootRef   = useRef(null)
  const canvasRef = useRef(null)
  const topRef    = useRef(null)
  const bottomRef = useRef(null)
  const flashRef  = useRef(null)
  const seam      = useTornSeam(36)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onComplete?.(); return
    }

    const canvas = canvasRef.current
    let W = window.innerWidth, H = window.innerHeight

    /* ── RENDERER ──────────────────────────────────────────────────────────── */
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping        = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace   = THREE.SRGBColorSpace
    renderer.shadowMap.enabled  = true
    renderer.shadowMap.type     = THREE.PCFSoftShadowMap

    /* ── SCENE ─────────────────────────────────────────────────────────────── */
    const scene = new THREE.Scene()
    // subtle charcoal fog matches the torn-paper background
    scene.fog = new THREE.Fog(0x0c0a08, 12, 32)

    /* ── ENVIRONMENT (PMREM) — purely for metallic reflections ─────────────── */
    const pmrem  = new THREE.PMREMGenerator(renderer)
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = envTex

    /* ── CAMERA: low angle looking slightly upward, slight left offset ──────── */
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.1, 100)
    camera.position.set(-0.4, -0.9, 7.8)
    camera.lookAt(0, 0.5, 0)

    /* ── MATERIAL: dark brushed industrial steel ───────────────────────────── */
    const mat = new THREE.MeshStandardMaterial({
      color:            0x5e6e7a,   // cool blue-grey steel, not silver/white
      metalness:        0.96,
      roughness:        0.28,
      envMapIntensity:  0.75,
      transparent:      true,
      opacity:          1,
    })

    /* ── SPRING GEOMETRY + GROUP ───────────────────────────────────────────── */
    const group   = new THREE.Group()
    const params  = { compress: 0 }
    let   geo     = makeSpring(0)
    const mesh    = new THREE.Mesh(geo, mat)
    // cast + receive shadows for realism
    mesh.castShadow = mesh.receiveShadow = true

    // end plates (flat ring at each cap end)
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x4a5a66, metalness: 0.98, roughness: 0.22,
    })
    const plateTop = new THREE.Mesh(makeEndPlate(RADIUS), plateMat)
    const plateBot = new THREE.Mesh(makeEndPlate(RADIUS), plateMat)
    plateTop.castShadow = plateBot.castShadow = true

    function positionPlates() {
      const h = REST_H * (1 - 0.64 * params.compress)
      plateTop.position.y =  h / 2 + 0.03
      plateBot.position.y = -h / 2 - 0.03
    }
    positionPlates()
    group.add(mesh, plateTop, plateBot)

    // HORIZONTAL: rotate around Z so spring lies flat, slight Y tilt for depth
    group.rotation.z = -Math.PI / 2
    group.rotation.y = 0.22
    scene.add(group)

    function rebuild() {
      const next = makeSpring(params.compress)
      mesh.geometry.dispose()
      mesh.geometry = next
      geo = next
      positionPlates()
    }

    /* ── LIGHTS ────────────────────────────────────────────────────────────── */

    // very dim ambient — just enough to see the dark side of coils
    scene.add(new THREE.AmbientLight(0xfff4e6, 0.10))

    // KEY: dramatic SpotLight from upper-left → shadows through coil gaps
    const key = new THREE.SpotLight(0xfff0e0, 180, 22, Math.PI / 6.5, 0.35, 1.0)
    key.position.set(-4.5, 6.5, 5)
    key.target.position.set(0, 0, 0)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.near = 2
    key.shadow.camera.far  = 20
    scene.add(key, key.target)

    // FILL: cool from lower-right, bounce light from floor direction
    const fill = new THREE.DirectionalLight(0xa8c0d8, 0.65)
    fill.position.set(5, -2.5, 3)
    scene.add(fill)

    // RIM: cold edge light from behind to separate coils from background
    const rim = new THREE.DirectionalLight(0xd4e8f4, 0.9)
    rim.position.set(0.5, 2, -9)
    scene.add(rim)

    // BRAND ACCENT: warm rust glow from below-front (ties into palette)
    const brand = new THREE.PointLight(0xc94f2f, 22, 11)
    brand.position.set(1.2, -3.5, 3)
    scene.add(brand)

    // subtle second warm fill so the bottom isn't pure black
    const warmFill = new THREE.PointLight(0xe06030, 8, 14)
    warmFill.position.set(-2, -2, 4)
    scene.add(warmFill)

    /* ── DARK REFLECTIVE FLOOR (grounds the spring) ─────────────────────────── */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshStandardMaterial({
        color: 0x060402, metalness: 0.25, roughness: 0.75,
      })
    )
    floor.rotation.x = -Math.PI / 2
    floor.position.y = -2.6
    floor.receiveShadow = true
    scene.add(floor)

    /* ── RENDER LOOP — performance.now() to avoid THREE.Clock deprecation ───── */
    let raf = 0, spin = true, last = performance.now()
    function animate() {
      raf = requestAnimationFrame(animate)
      const now = performance.now()
      const dt  = Math.min((now - last) / 1000, 0.05)
      last = now
      if (spin) {
        group.rotation.y += dt * 0.35
        // subtle key light drift for live specular movement
        key.position.x = -4.5 + Math.sin(now * 0.0004) * 0.6
        key.position.y =  6.5 + Math.cos(now * 0.0003) * 0.4
      }
      renderer.render(scene, camera)
    }
    animate()

    /* ── RESIZE ─────────────────────────────────────────────────────────────── */
    const onResize = () => {
      W = window.innerWidth; H = window.innerHeight
      camera.aspect = W / H; camera.updateProjectionMatrix()
      renderer.setSize(W, H)
    }
    window.addEventListener('resize', onResize)

    /* ── SCROLL LOCK ─────────────────────────────────────────────────────────── */
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    /* ════ GSAP MASTER TIMELINE ══════════════════════════════════════════════ */
    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete() {
        document.body.style.overflow = prevOverflow
        onComplete?.()
      },
    })

    // PHASE 0 — cinematic camera push-in while spring is already fully visible
    // No janky scale animation — just a slow dolly
    tl.from(camera.position, { z: 10.5, duration: 1.1, ease: 'power2.out',
      onUpdate: () => camera.lookAt(0, 0.5, 0) })

    // brief hold — viewer takes in the spring
    tl.to({}, { duration: 0.3 })

    // PHASE 1 — SLOW COMPRESSION (tension builds, power3.in = accelerating squeeze)
    tl.to(params, {
      compress: 1,
      duration: 1.2,
      ease: 'power3.in',
      onUpdate: rebuild,
    })
    // spring nudges toward camera as it loads
    tl.to(group.position, { z: 0.3, duration: 1.2, ease: 'power3.in' }, '<')
    // stop spin as coils tighten — feels more tense
    tl.add(() => { spin = false }, '-=0.5')

    // PHASE 2 — SNAP RELEASE: instantaneous
    tl.add('boom')
    tl.to(params, { compress: 0, duration: 0.10, ease: 'power4.out', onUpdate: rebuild }, 'boom')
    // spring rockets toward camera
    tl.to(group.position, { z: 5.2, duration: 0.38, ease: 'power4.in' },   'boom')
    tl.to(group.scale,    { x: 2.6, y: 2.6, z: 2.6, duration: 0.38, ease: 'power4.in' }, 'boom')
    // rotate to face camera straight-on as it punches through
    tl.to(group.rotation, { y: 0, z: -Math.PI * 0.08, duration: 0.38, ease: 'power2.in' }, 'boom')
    tl.to(mat, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 'boom+=0.12')
    tl.to(plateMat, { opacity: 0, duration: 0.28, ease: 'power2.in' }, 'boom+=0.12')

    // PHASE 2b — impact flash
    tl.fromTo(flashRef.current,
      { opacity: 0 },
      { opacity: 0.9, duration: 0.08, ease: 'none' },
      'boom+=0.03')
    tl.to(flashRef.current, { opacity: 0, duration: 0.55, ease: 'power2.in' }, 'boom+=0.11')

    // PHASE 3 — TORN PAPER: force tears the dark sheet apart
    tl.to(topRef.current, {
      yPercent: -122, xPercent: -2, rotation: -2.5,
      duration: 0.8, ease: 'power3.inOut',
    }, 'boom+=0.08')
    tl.to(bottomRef.current, {
      yPercent: 122, xPercent: 2, rotation: 2.5,
      duration: 0.8, ease: 'power3.inOut',
    }, 'boom+=0.08')

    // PHASE 4 — overlay fades to nothing, Hero is fully revealed
    tl.to(rootRef.current, { opacity: 0, duration: 0.2 }, '-=0.1')

    /* ── CLEANUP ─────────────────────────────────────────────────────────────── */
    return () => {
      tl.kill()
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = prevOverflow
      geo.dispose(); mat.dispose(); plateMat.dispose()
      envTex.dispose(); pmrem.dispose(); renderer.dispose()
    }
  }, [onComplete])

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.sheet} ref={topRef}    style={{ clipPath: seam.top }}    />
      <div className={styles.sheet} ref={bottomRef} style={{ clipPath: seam.bottom }} />
      <canvas className={styles.canvas} ref={canvasRef} />
      <div className={styles.flash} ref={flashRef} />
    </div>
  )
}
