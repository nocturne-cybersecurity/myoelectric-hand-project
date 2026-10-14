import { useEffect, useMemo, useRef, useState, Suspense, Component, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, OrbitControls } from '@react-three/drei';
import { RotateCcw, Pause, Play } from 'lucide-react';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import { Button } from '@/components/ui/button';

type Palette = Record<'shell' | 'joint' | 'metal' | 'tendon' | 'stage' | 'grid', THREE.Color>;
type Grip = 'open' | 'pinch' | 'closed';

function readPalette(): Palette {
  const styles = getComputedStyle(document.documentElement);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext('2d');
  const color = (name: string) => {
    if (!ctx) return new THREE.Color();
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = styles.getPropertyValue(`--model-${name}`).trim();
    ctx.fillRect(0, 0, 1, 1);
    const pixel = ctx.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB((pixel[0] ?? 0) / 255, (pixel[1] ?? 0) / 255, (pixel[2] ?? 0) / 255, THREE.SRGBColorSpace);
  };
  return { shell: color('shell'), joint: color('joint'), metal: color('metal'), tendon: color('tendon'), stage: color('stage'), grid: color('grid') };
}

function plateGeometry(width: number, height: number, depth: number) {
  const shape = new THREE.Shape();
  const w = width / 2;
  shape.moveTo(-w * .65, 0);
  shape.quadraticCurveTo(-w, 0, -w, .15);
  shape.lineTo(-w * .86, height * .8);
  shape.quadraticCurveTo(-w * .8, height, -w * .45, height);
  shape.lineTo(w * .45, height);
  shape.quadraticCurveTo(w * .8, height, w * .86, height * .8);
  shape.lineTo(w, .15);
  shape.quadraticCurveTo(w, 0, w * .65, 0);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: .055, bevelThickness: .04, curveSegments: 10 });
  geometry.translate(0, 0, -depth / 2);
  return geometry;
}

function Hinge({ palette, width = .45 }: { palette: Palette; width?: number }) {
  return <group rotation-z={Math.PI / 2}><mesh><cylinderGeometry args={[.14, .14, width, 16]}/><meshStandardMaterial color={palette.joint} roughness={.45}/></mesh>{[-1, 1].map(side => <mesh key={side} position-y={side * (width / 2 + .012)}><cylinderGeometry args={[.085, .085, .025, 12]}/><meshStandardMaterial color={palette.metal} metalness={.85} roughness={.25}/></mesh>)}</group>;
}

function Finger({ palette, length, curl, thumb = false }: { palette: Palette; length: number; curl: number; thumb?: boolean }) {
  const reduced = useReducedMotion();
  const base = useRef<THREE.Group>(null);
  const middle = useRef<THREE.Group>(null);
  const tip = useRef<THREE.Group>(null);
  const geometry = useMemo(() => plateGeometry(thumb ? .44 : .36, length, .28), [length, thumb]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_, rawDelta) => {
    const blend = reduced ? 1 : 1 - Math.exp(-8 * Math.min(rawDelta, .05));
    [base, middle, tip].forEach((ref, i) => {
      if (ref.current) ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, curl * (i === 0 ? .85 : 1.1), blend);
    });
  });
  const segment = <><mesh geometry={geometry} castShadow><meshStandardMaterial color={palette.shell} roughness={.58} metalness={.1}/></mesh><mesh position={[0, length * .48, .166]} scale={[.67, 1, .2]}><capsuleGeometry args={[.13, length * .48, 4, 8]}/><meshStandardMaterial color={palette.joint} roughness={.85}/></mesh><mesh position={[0, length * .45, -.17]}><cylinderGeometry args={[.018, .018, length * .85, 6]}/><meshStandardMaterial color={palette.tendon} roughness={.5}/></mesh></>;
  return <group ref={base}><Hinge palette={palette}/>{segment}<group ref={middle} position-y={length + .1}><Hinge palette={palette}/>{segment}{!thumb && <group ref={tip} position-y={length + .1}><Hinge palette={palette}/><group scale-y={.8}>{segment}</group></group>}</group></group>;
}

function Hand({ palette, grip }: { palette: Palette; grip: Grip }) {
  const palm = useMemo(() => plateGeometry(2.05, 1.85, .55), []);
  const cuff = useMemo(() => new THREE.LatheGeometry([new THREE.Vector2(.65, -1.6), new THREE.Vector2(.7, -1.55), new THREE.Vector2(.55, -.28), new THREE.Vector2(.47, -.1), new THREE.Vector2(.36, -.1), new THREE.Vector2(.45, -.3), new THREE.Vector2(.59, -1.55), new THREE.Vector2(.65, -1.6)], 40), []);
  useEffect(() => () => { palm.dispose(); cuff.dispose(); }, [palm, cuff]);
  return <group position-y={-.9} rotation={[.02, -.25, -.1]}>
    <mesh geometry={palm} castShadow><meshStandardMaterial color={palette.shell} roughness={.55} metalness={.08}/></mesh>
    <mesh geometry={cuff} castShadow><meshStandardMaterial color={palette.shell} roughness={.55} metalness={.15} side={THREE.DoubleSide}/></mesh>
    <mesh position-y={-.08}><cylinderGeometry args={[.43, .45, .19, 32]}/><meshStandardMaterial color={palette.joint} roughness={.5}/></mesh>
    <mesh position={[0, .82, .32]} scale={[1.25, 1.12, .14]}><sphereGeometry args={[.5, 24, 16]}/><meshStandardMaterial color={palette.joint} roughness={.8}/></mesh>
    {[-.68, -.23, .23, .68].map((x, i) => <group key={i} position={[x, 1.87 - (i === 3 ? .15 : 0), 0]} rotation-z={[-.08, -.02, .02, .12][i] ?? 0}><Finger palette={palette} length={[.54, .65, .6, .46][i] ?? .5} curl={grip === 'closed' ? 1.35 : grip === 'pinch' ? (i === 0 ? 1.1 : .25) : 0}/></group>)}
    <group position={[-1, .6, 0]} rotation={[0, -.15, .95]}><Finger palette={palette} length={.52} thumb curl={grip === 'open' ? .05 : grip === 'pinch' ? 1 : 1.2}/></group>
    {[-.7, .7].flatMap(x => [.3, 1.5].map(y => <mesh key={`${x}-${y}`} position={[x, y, .326]} rotation-x={Math.PI / 2}><cylinderGeometry args={[.06, .06, .03, 6]}/><meshStandardMaterial color={palette.metal} roughness={.25} metalness={.9}/></mesh>))}
    {[-.27, 0, .27].map(x => <mesh key={x} position={[x, -.86, .61]} rotation-z={x * .25}><capsuleGeometry args={[.025, 1, 4, 6]}/><meshStandardMaterial color={palette.tendon} roughness={.65}/></mesh>)}
  </group>;
}

function Studio({ palette }: { palette: Palette }) {
  const texture = useMemo(() => {
    const data = new Uint8Array(64 * 64 * 4);
    for (let i = 0; i < 64 * 64; i++) { const v = 215 + ((i * 17 + Math.floor(i / 64) * 13) % 30); data.set([v, v, v, 255], i * 4); }
    const tex = new THREE.DataTexture(data, 64, 64);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(8, 8); tex.needsUpdate = true;
    return tex;
  }, []);
  useEffect(() => () => texture.dispose(), [texture]);
  return <><color attach="background" args={[palette.stage]}/><ambientLight intensity={.65}/><directionalLight position={[3, 7, 7]} intensity={2.2} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} shadow-camera-left={-5} shadow-camera-right={5} shadow-camera-top={5} shadow-camera-bottom={-5}/><Environment resolution={128}><Lightformer intensity={2.5} position={[0, 6, 3]} scale={[7, 5, 1]}/><Lightformer intensity={1.5} color={palette.tendon} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[5, 6, 1]}/></Environment><mesh rotation-x={-Math.PI / 2} position-y={-2.58} receiveShadow><planeGeometry args={[200, 200]}/><meshStandardMaterial color={palette.stage} roughness={.9} roughnessMap={texture}/></mesh><gridHelper args={[18, 36, palette.grid, palette.grid]} position-y={-2.572}/></>;
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  override state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  override render() { return this.state.failed ? <div className="prototype-loading">La vista 3D no está disponible en este dispositivo.</div> : this.props.children; }
}

export default function ProsthesisScene() {
  const [palette, setPalette] = useState<Palette>();
  const [grip, setGrip] = useState<Grip>('open');
  const [rotating, setRotating] = useState(false);
  const reduced = useReducedMotion();
  const controls = useRef<OrbitControlsType>(null);
  useEffect(() => { setPalette(readPalette()); }, []);
  return <div className="prototype-view">
    <SceneBoundary>{palette ? <div className="prototype-canvas" aria-label="Prótesis tridimensional interactiva"><Canvas shadows dpr={[1, 1.5]} camera={{ position: [5, 2.7, 9.8], fov: 36 }} gl={{ antialias: true }}><Studio palette={palette}/><Suspense fallback={null}><Hand palette={palette} grip={grip}/></Suspense><OrbitControls ref={controls} makeDefault target={[0, .25, 0]} enablePan={false} enableDamping dampingFactor={.08} minDistance={7} maxDistance={15} minPolarAngle={.4} maxPolarAngle={2.5} autoRotate={rotating && !reduced} autoRotateSpeed={1} onStart={() => setRotating(false)}/></Canvas></div> : <div className="prototype-loading">Preparando prótesis…</div>}</SceneBoundary>
    <div className="prototype-label"><strong>Mano articulada</strong><span>PLA · 15 falanges · Control EMG</span></div><span className="prototype-mark">3D</span>
    <div className="prototype-tools"><div className="prototype-modes">{([['open', 'Abierta'], ['pinch', 'Pinza'], ['closed', 'Cerrada']] as const).map(([value, label]) => <Button key={value} variant="ghost" aria-pressed={grip === value} onClick={() => setGrip(value)}>{label}</Button>)}</div><span className="prototype-status"><i/> {grip === 'open' ? 'En reposo' : grip === 'pinch' ? 'Agarre de pinza' : 'Agarre cerrado'}</span><div className="prototype-actions"><Button variant="ghost" size="icon" title="Restablecer vista" aria-label="Restablecer vista" onClick={() => { controls.current?.reset(); setRotating(false); setGrip('open'); }}><RotateCcw/></Button><Button variant="ghost" size="icon" title={rotating ? 'Pausar giro' : 'Giro automático'} aria-label={rotating ? 'Pausar giro' : 'Giro automático'} aria-pressed={rotating} disabled={Boolean(reduced)} onClick={() => setRotating(value => !value)}>{rotating ? <Pause/> : <Play/>}</Button></div></div>
  </div>;
}