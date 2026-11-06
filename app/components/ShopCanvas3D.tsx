"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { SoundEngine } from "../utils/audio";

export type ProductTheme = "chrome" | "obsidian" | "amber" | "violet";
export type ShaderMode = "fluid" | "exploded" | "wireframe" | "crystal";

interface ShopCanvas3DProps {
  theme: ProductTheme;
  mode: ShaderMode;
  onHotspotClick?: (index: number) => void;
  activeHotspot?: number | null;
}

const themePresets: Record<
  ProductTheme,
  {
    name: string;
    primaryColor: THREE.Color;
    secondaryColor: THREE.Color;
    rimColor: THREE.Color;
    backgroundTint: THREE.Color;
    roughness: number;
    metalness: number;
    transmission: number;
    accentHex: string;
  }
> = {
  chrome: {
    name: "Liquid Chrome (液态镀铬)",
    primaryColor: new THREE.Color(0xf2f4f8),
    secondaryColor: new THREE.Color(0x899bb5),
    rimColor: new THREE.Color(0x64f5ba),
    backgroundTint: new THREE.Color(0x0a0c12),
    roughness: 0.05,
    metalness: 0.98,
    transmission: 0.2,
    accentHex: "#64f5ba",
  },
  obsidian: {
    name: "Obsidian Titanium (曜石暗钛)",
    primaryColor: new THREE.Color(0x12141a),
    secondaryColor: new THREE.Color(0x282d38),
    rimColor: new THREE.Color(0x598cff),
    backgroundTint: new THREE.Color(0x050608),
    roughness: 0.25,
    metalness: 0.9,
    transmission: 0.1,
    accentHex: "#598cff",
  },
  amber: {
    name: "Solar Amber (星云赤金)",
    primaryColor: new THREE.Color(0x38190e),
    secondaryColor: new THREE.Color(0xff6b46),
    rimColor: new THREE.Color(0xffaa48),
    backgroundTint: new THREE.Color(0x0f0705),
    roughness: 0.18,
    metalness: 0.85,
    transmission: 0.35,
    accentHex: "#ff6b46",
  },
  violet: {
    name: "Cyber Violet (极光紫晶)",
    primaryColor: new THREE.Color(0x1e1233),
    secondaryColor: new THREE.Color(0x9a82ff),
    rimColor: new THREE.Color(0xd282ff),
    backgroundTint: new THREE.Color(0x090510),
    roughness: 0.12,
    metalness: 0.92,
    transmission: 0.45,
    accentHex: "#9a82ff",
  },
};

// GLSL Noise & Fluid Shaders
const vertexShader = `
  uniform float uTime;
  uniform float uDistortion;
  uniform float uExplode;
  uniform vec2 uMouse;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDisplacement;

  // Classic Simplex Noise 3D
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 );
    vec4 p = permute( permute( permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;

    // Organic fluid displacement on vertex normal
    float noise = snoise(position * 1.8 + vec3(uTime * 0.45, uMouse * 0.5));
    float disp = noise * uDistortion;
    vDisplacement = disp;

    // Exploded offset
    vec3 explodedPos = position + normal * (disp + uExplode * 0.85);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(explodedPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uPrimaryColor;
  uniform vec3 uSecondaryColor;
  uniform vec3 uRimColor;
  uniform float uWireframe;
  uniform float uTransmission;

  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;
  varying float vDisplacement;

  void main() {
    vec3 viewDir = normalize(-vPosition);
    vec3 normal = normalize(vNormal);

    // Fresnel Rim Light calculation (Lusion signature luminous edge)
    float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.8);

    // Base color gradient influenced by fluid displacement
    vec3 color = mix(uPrimaryColor, uSecondaryColor, vDisplacement * 2.5 + 0.5);
    color += uRimColor * fresnel * 1.8;

    // Specular highlight
    vec3 lightDir = normalize(vec3(1.0, 1.5, 1.0));
    vec3 halfVector = normalize(lightDir + viewDir);
    float spec = pow(max(dot(normal, halfVector), 0.0), 32.0);
    color += vec3(1.0) * spec * 0.6;

    if (uWireframe > 0.5) {
      // Holographic grid
      float grid = step(0.92, fract(vUv.x * 30.0)) + step(0.92, fract(vUv.y * 30.0));
      color = mix(color * 0.2, uRimColor * 1.5, grid);
      gl_FragColor = vec4(color, 0.85);
    } else {
      gl_FragColor = vec4(color, 1.0 - uTransmission * 0.3);
    }
  }
`;

export function ShopCanvas3D({ theme, mode }: ShopCanvas3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef(theme);
  const modeRef = useRef(mode);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 4.8);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // 2. Custom Shader Fluid Kinetic Mesh
    const uniforms = {
      uTime: { value: 0 },
      uDistortion: { value: 0.18 },
      uExplode: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uPrimaryColor: { value: themePresets[themeRef.current].primaryColor },
      uSecondaryColor: { value: themePresets[themeRef.current].secondaryColor },
      uRimColor: { value: themePresets[themeRef.current].rimColor },
      uWireframe: { value: 0.0 },
      uTransmission: { value: themePresets[themeRef.current].transmission },
    };

    const fluidMat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
    });

    const productGroup = new THREE.Group();
    scene.add(productGroup);

    // Main Kinetic Core (High-density sphere for organic vertices)
    const coreGeo = new THREE.SphereGeometry(1.05, 128, 128);
    const coreMesh = new THREE.Mesh(coreGeo, fluidMat);
    productGroup.add(coreMesh);

    // Outer Floating Titanium Kinetic Torus Rings (Gyroscopic momentum)
    const ringGeoA = new THREE.TorusGeometry(1.58, 0.024, 32, 120);
    const ringMatA = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.95,
      roughness: 0.1,
      emissive: 0x598cff,
      emissiveIntensity: 0.2,
    });
    const gyroRingA = new THREE.Mesh(ringGeoA, ringMatA);
    gyroRingA.rotation.x = Math.PI * 0.4;
    productGroup.add(gyroRingA);

    const ringGeoB = new THREE.TorusGeometry(1.42, 0.018, 32, 100);
    const gyroRingB = new THREE.Mesh(ringGeoB, ringMatA);
    gyroRingB.rotation.y = Math.PI * 0.35;
    productGroup.add(gyroRingB);

    // Glowing Particle Cloud (Acoustic Wave Particles)
    const particleCount = 1200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = Math.cbrt(Math.random()) * 1.4 + 1.25;

      positions[i] = r * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = r * Math.cos(phi);
      scales[i / 3] = Math.random() * 0.8 + 0.4;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x64f5ba,
      size: 0.026,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    productGroup.add(particles);

    // 3. Buttery Smooth Lusion-style Spring Mouse Physics
    let isDragging = false;
    let pointer = { x: 0, y: 0 };
    const dragVelocity = { x: 0, y: 0 };
    const mouseNorm = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      pointer = { x: e.clientX, y: e.clientY };
      SoundEngine.playTick(1600);
    };

    const onPointerMove = (e: PointerEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseNorm.x = (e.clientX / innerWidth) * 2 - 1;
      mouseNorm.y = -(e.clientY / innerHeight) * 2 + 1;

      if (!isDragging) return;
      const deltaX = e.clientX - pointer.x;
      const deltaY = e.clientY - pointer.y;
      pointer = { x: e.clientX, y: e.clientY };

      dragVelocity.x = deltaX * 0.006;
      dragVelocity.y = deltaY * 0.006;

      // Organic distortion spike when dragging quickly
      uniforms.uDistortion.value = Math.min(0.45, uniforms.uDistortion.value + Math.hypot(deltaX, deltaY) * 0.002);
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);

    // 4. Resize Handler
    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);
    onResize();

    // 5. Render Loop with Elastic Spring Physics
    let frame = 0;
    const clock = new THREE.Clock();

    const render = () => {
      frame = requestAnimationFrame(render);
      if (document.hidden) return; // Battery sleep

      clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Uniforms updates
      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.lerp(new THREE.Vector2(mouseNorm.x, mouseNorm.y), 0.08);

      // Interpolate theme colors
      const currentTheme = themePresets[themeRef.current];
      uniforms.uPrimaryColor.value.lerp(currentTheme.primaryColor, 0.08);
      uniforms.uSecondaryColor.value.lerp(currentTheme.secondaryColor, 0.08);
      uniforms.uRimColor.value.lerp(currentTheme.rimColor, 0.08);
      particleMat.color.lerp(currentTheme.rimColor, 0.08);
      ringMatA.emissive.lerp(currentTheme.rimColor, 0.08);

      // Mode switches
      const currentMode = modeRef.current;
      if (currentMode === "exploded") {
        uniforms.uExplode.value = THREE.MathUtils.lerp(uniforms.uExplode.value, 0.55, 0.06);
        uniforms.uWireframe.value = THREE.MathUtils.lerp(uniforms.uWireframe.value, 0.0, 0.06);
        gyroRingA.scale.lerp(new THREE.Vector3(1.35, 1.35, 1.35), 0.06);
        gyroRingB.scale.lerp(new THREE.Vector3(1.2, 1.2, 1.2), 0.06);
      } else if (currentMode === "wireframe") {
        uniforms.uWireframe.value = THREE.MathUtils.lerp(uniforms.uWireframe.value, 1.0, 0.06);
        uniforms.uExplode.value = THREE.MathUtils.lerp(uniforms.uExplode.value, 0.0, 0.06);
        gyroRingA.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);
        gyroRingB.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);
      } else if (currentMode === "crystal") {
        uniforms.uDistortion.value = THREE.MathUtils.lerp(uniforms.uDistortion.value, 0.05, 0.06);
        uniforms.uWireframe.value = THREE.MathUtils.lerp(uniforms.uWireframe.value, 0.0, 0.06);
        uniforms.uExplode.value = THREE.MathUtils.lerp(uniforms.uExplode.value, 0.0, 0.06);
      } else {
        // Fluid mode (Default)
        uniforms.uDistortion.value = THREE.MathUtils.lerp(uniforms.uDistortion.value, 0.18, 0.04);
        uniforms.uExplode.value = THREE.MathUtils.lerp(uniforms.uExplode.value, 0.0, 0.06);
        uniforms.uWireframe.value = THREE.MathUtils.lerp(uniforms.uWireframe.value, 0.0, 0.06);
        gyroRingA.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);
        gyroRingB.scale.lerp(new THREE.Vector3(1, 1, 1), 0.06);
      }

      // Spring physics for rotation & inertia
      if (!isDragging) {
        dragVelocity.x = THREE.MathUtils.lerp(dragVelocity.x, 0.0018, 0.03);
        dragVelocity.y = THREE.MathUtils.lerp(dragVelocity.y, 0.0008, 0.03);
      }
      productGroup.rotation.y += dragVelocity.x;
      productGroup.rotation.x += dragVelocity.y;

      // Smooth camera parallax damping
      camera.position.x = THREE.MathUtils.lerp(camera.position.x, mouseNorm.x * 0.7, 0.045);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, mouseNorm.y * 0.5, 0.045);
      camera.lookAt(0, 0, 0);

      // Gyro rings & particles rotation
      gyroRingA.rotation.z += 0.008;
      gyroRingB.rotation.x += 0.012;
      particles.rotation.y -= 0.003;

      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);

      coreGeo.dispose();
      fluidMat.dispose();
      ringGeoA.dispose();
      ringGeoB.dispose();
      ringMatA.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className="lusion-3d-stage"
      ref={mountRef}
      aria-label="Interactive 3D Fluid Simulation Stage. Drag to interact with physics."
    />
  );
}
