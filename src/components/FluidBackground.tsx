import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Simplex noise for fluid motion
const noiseShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

// Three.js Liquid Scroll Transition Mesh (About -> Works)
export function JunniLiquidTransitionMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScrollProgress: { value: 0 },
      uColorDark: { value: new THREE.Color('#050505') },
      uColorAccent: { value: new THREE.Color('#D4FF90') },
    }),
    []
  );

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: '#work',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        // Liquid wave peaks when entering #work, then fades out as #work exits
        if (self.progress <= 0.5) {
          uniforms.uScrollProgress.value = self.progress * 2;
        } else {
          uniforms.uScrollProgress.value = Math.max(0, (1 - self.progress) * 2);
        }
      },
    });

    return () => trigger.kill();
  }, [uniforms]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -20]}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2, 64, 64]} />
      <shaderMaterial
        vertexShader={`
          uniform float uTime;
          uniform float uScrollProgress;
          varying vec2 vUv;
          varying float vWave;
          
          ${noiseShader}
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float n = snoise(vec3(uv.x * 2.5, uv.y * 2.5, uTime * 0.5));
            float wave = sin(uv.x * 10.0 + uTime * 1.8) * 20.0;
            
            pos.z += (n * 30.0 + wave) * uScrollProgress;
            vWave = n + wave * 0.05;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform float uScrollProgress;
          uniform vec3 uColorDark;
          uniform vec3 uColorAccent;
          varying vec2 vUv;
          varying float vWave;
          
          void main() {
            float threshold = uScrollProgress * 1.5 - (1.0 - vUv.y) + vWave * 0.15;
            float edge = smoothstep(-0.1, 0.3, threshold);
            float glow = smoothstep(0.2, 0.0, abs(vUv.y - (1.0 - uScrollProgress * 1.3) - vWave * 0.1));
            
            vec3 finalColor = mix(uColorDark, uColorAccent, edge * 0.35);
            finalColor += uColorAccent * glow * 0.7;
            
            float alpha = (edge * 0.4 + glow * 0.6) * uScrollProgress;
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

// Particle vertex shader
const particleVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseInfluence;
  
  attribute float aSize;
  attribute float aSpeed;
  attribute float aOffset;
  attribute vec3 aRandom;
  
  varying float vAlpha;
  varying float vSize;
  
  ${noiseShader}
  
  void main() {
    vec3 pos = position;
    
    // Fluid motion using noise
    float noise1 = snoise(vec3(pos.x * 0.003, pos.y * 0.003, uTime * aSpeed * 0.1 + aOffset));
    float noise2 = snoise(vec3(pos.x * 0.005 + 100.0, pos.y * 0.005, uTime * aSpeed * 0.08));
    
    pos.x += noise1 * 30.0 * aRandom.x;
    pos.y += noise2 * 30.0 * aRandom.y;
    
    // Mouse influence - particles flow away from cursor
    vec2 toMouse = pos.xy - uMouse;
    float mouseDist = length(toMouse);
    float mouseForce = smoothstep(200.0, 0.0, mouseDist) * uMouseInfluence;
    vec2 mouseDir = normalize(toMouse + vec2(0.001));
    pos.xy += mouseDir * mouseForce * 50.0 * aRandom.z;
    
    // Gentle floating
    pos.y += sin(uTime * aSpeed + aOffset) * 10.0;
    pos.x += cos(uTime * aSpeed * 0.7 + aOffset) * 8.0;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    // Size attenuation
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    
    vAlpha = smoothstep(500.0, 100.0, -mvPosition.z) * (0.3 + 0.7 * aRandom.x);
    vSize = aSize;
  }
`;

// Particle fragment shader
const particleFragmentShader = `
  uniform vec3 uColor;
  uniform vec3 uAccentColor;
  uniform float uTime;
  
  varying float vAlpha;
  varying float vSize;
  
  void main() {
    // Circular particle
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    float alpha = smoothstep(0.5, 0.2, dist) * vAlpha;
    
    // Color mixing based on size
    vec3 color = mix(uColor, uAccentColor, vSize / 3.0);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface ParticleSystemProps {
  count?: number;
}

function ParticleSystem({ count = 6000 }: ParticleSystemProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { viewport } = useThree();

  // Create geometry with attributes
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();

    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const speeds = new Float32Array(count);
    const offsets = new Float32Array(count);
    const randoms = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * viewport.width * 2.5;
      positions[i3 + 1] = (Math.random() - 0.5) * viewport.height * 2.5;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;

      sizes[i] = 1.0 + Math.random() * 2.5;
      speeds[i] = 0.3 + Math.random() * 0.7;
      offsets[i] = Math.random() * 100;

      randoms[i3] = Math.random();
      randoms[i3 + 1] = Math.random();
      randoms[i3 + 2] = Math.random();
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aOffset', new THREE.BufferAttribute(offsets, 1));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 3));

    return geo;
  }, [count, viewport]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uMouseInfluence: { value: 0 },
      uColor: { value: new THREE.Color('#444444') },
      uAccentColor: { value: new THREE.Color('#D4FF90') },
    }),
    []
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - window.innerWidth / 2);
      mouseRef.current.targetY = -(e.clientY - window.innerHeight / 2);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const material = pointsRef.current.material as THREE.ShaderMaterial;
    material.uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse interpolation
    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

    material.uniforms.uMouse.value.set(mouseRef.current.x, mouseRef.current.y);
    material.uniforms.uMouseInfluence.value = 1.0;
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Connection lines between nearby particles
function ConnectionLines() {
  const linesRef = useRef<THREE.LineSegments>(null);

  // Create animated lines
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const lineCount = 150;
    const positions = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      const x1 = (Math.random() - 0.5) * 1000;
      const y1 = (Math.random() - 0.5) * 1000;
      const z1 = (Math.random() - 0.5) * 100;
      const x2 = x1 + (Math.random() - 0.5) * 100;
      const y2 = y1 + (Math.random() - 0.5) * 100;
      const z2 = z1 + (Math.random() - 0.5) * 50;

      positions[i6] = x1;
      positions[i6 + 1] = y1;
      positions[i6 + 2] = z1;
      positions[i6 + 3] = x2;
      positions[i6 + 4] = y2;
      positions[i6 + 5] = z2;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  const frameCount = useRef(0);
  useFrame((state) => {
    if (!linesRef.current) return;
    frameCount.current += 1;
    if (frameCount.current % 2 !== 0) return; // Run buffer math every 2nd frame for 2x CPU efficiency

    const time = state.clock.elapsedTime;
    const posArray = linesRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < posArray.length; i += 6) {
      const idx = i / 6;
      const speed = 0.2 + (idx % 5) * 0.1;
      posArray[i + 1] += Math.sin(time * speed + idx) * 0.2;
      posArray[i + 4] += Math.cos(time * speed + idx) * 0.2;
    }

    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#1a2a1a" transparent opacity={0.3} />
    </lineSegments>
  );
}

export default function FluidBackground() {
  return (
    <div className="canvas-container pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 300], fov: 60, near: 1, far: 1000 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <ParticleSystem count={4000} />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
