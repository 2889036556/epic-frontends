"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { planets } from "../space-data";

type SolarSystem3DProps = {
  activeId: string;
  focusId: string | null;
  focusToken: number;
  onSelect: (id: string) => void;
};

const layout = [
  { id: "mercury", radius: 0.32, orbit: 3.1, speed: 0.022, angle: 0.35 },
  { id: "venus", radius: 0.48, orbit: 4.35, speed: 0.016, angle: 2.8 },
  { id: "earth", radius: 0.54, orbit: 5.8, speed: 0.013, angle: 4.15 },
  { id: "mars", radius: 0.4, orbit: 7.15, speed: 0.011, angle: 1.5 },
  { id: "jupiter", radius: 1.1, orbit: 9.75, speed: 0.007, angle: 5.5 },
  { id: "saturn", radius: 0.93, orbit: 12.55, speed: 0.005, angle: 2.15 },
  { id: "uranus", radius: 0.68, orbit: 15.1, speed: 0.0038, angle: 3.5 },
  { id: "neptune", radius: 0.65, orbit: 17.5, speed: 0.003, angle: 0.9 },
];

export function SolarSystem3D({ activeId, focusId, focusToken, onSelect }: SolarSystem3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(activeId);
  const selectRef = useRef(onSelect);
  const focusRef = useRef({ id: focusId, token: focusToken });

  useEffect(() => {
    activeRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);

  useEffect(() => {
    focusRef.current = { id: focusId, token: focusToken };
  }, [focusId, focusToken]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x03050b, 0.014);

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 180);
    camera.position.set(0, 13.8, 26.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.045;
    controls.enablePan = false;
    controls.minDistance = 3;
    controls.maxDistance = 46;
    controls.minPolarAngle = 0.35;
    controls.maxPolarAngle = Math.PI * 0.48;
    controls.target.set(0, 0, 0);

    const system = new THREE.Group();
    system.rotation.x = -0.32;
    system.rotation.z = 0.1;
    scene.add(system);

    // The sun is the dominant source, while a restrained cool fill keeps the
    // moving worlds legible instead of turning into black cut-outs on their
    // night side. This preserves relief without sacrificing the interface.
    scene.add(new THREE.AmbientLight(0x8298d0, 0.5));
    scene.add(new THREE.HemisphereLight(0x6f8fda, 0x070914, 0.52));
    const fillLight = new THREE.DirectionalLight(0x8ba7ff, 0.5);
    fillLight.position.set(-16, 11, 22);
    scene.add(fillLight);
    const sunlight = new THREE.PointLight(0xffbc61, 4.6, 70, 1.5);
    system.add(sunlight);

    const sun = new THREE.Mesh(
      new THREE.SphereGeometry(1.55, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xff9f34 }),
    );
    system.add(sun);
    const corona = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture("#ff9d38"),
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
    corona.scale.set(7.6, 7.6, 1);
    system.add(corona);

    const textureLoader = new THREE.TextureLoader();
    const anisotropy = renderer.capabilities.getMaxAnisotropy();
    const pickable: THREE.Object3D[] = [];
    const bodies = new Map<string, { mesh: THREE.Mesh; pivot: THREE.Group; base: number; speed: number }>();

    layout.forEach((item) => {
      const planet = planets.find((entry) => entry.id === item.id);
      if (!planet) return;

      const orbitPoints = Array.from({ length: 161 }, (_, index) => {
        const theta = (index / 160) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(theta) * item.orbit, 0, Math.sin(theta) * item.orbit * 0.72);
      });
      const orbit = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(orbitPoints),
        new THREE.LineBasicMaterial({ color: 0x5270bb, transparent: true, opacity: item.id === activeRef.current ? 0.5 : 0.2 }),
      );
      system.add(orbit);

      const texture = textureLoader.load(planet.texture);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = anisotropy;

      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: item.id === "earth" ? 0.62 : 0.86,
        metalness: 0,
        emissive: 0x07101f,
        emissiveIntensity: 0.16,
      });
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(item.radius, 56, 56), material);
      mesh.userData.planetId = item.id;
      mesh.rotation.y = Math.PI * 0.42;
      if (item.id === "saturn") mesh.rotation.z = 0.47;

      const pivot = new THREE.Group();
      pivot.rotation.y = item.angle;
      mesh.position.set(item.orbit, 0, 0);
      pivot.add(mesh);
      system.add(pivot);
      pickable.push(mesh);
      bodies.set(item.id, { mesh, pivot, base: item.radius, speed: item.speed });

      if (item.id === "saturn") {
        const ringTexture = textureLoader.load("/textures/saturn_ring_alpha.png");
        ringTexture.colorSpace = THREE.SRGBColorSpace;
        ringTexture.anisotropy = anisotropy;
        const ringGeometry = new THREE.RingGeometry(item.radius * 1.34, item.radius * 2.42, 96);
        const positions = ringGeometry.attributes.position;
        const uvs = ringGeometry.attributes.uv;
        const inner = item.radius * 1.34;
        const outer = item.radius * 2.42;
        for (let index = 0; index < positions.count; index += 1) {
          const radial = Math.sqrt(positions.getX(index) ** 2 + positions.getY(index) ** 2);
          uvs.setXY(index, (radial - inner) / (outer - inner), 0.5);
        }
        const ring = new THREE.Mesh(
          ringGeometry,
          new THREE.MeshBasicMaterial({ map: ringTexture, transparent: true, opacity: 0.82, side: THREE.DoubleSide, depthWrite: false }),
        );
        ring.rotation.x = Math.PI * 0.5;
        ring.rotation.z = 0.26;
        mesh.add(ring);
      }
    });

    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(4400 * 3);
    for (let index = 0; index < starPositions.length; index += 3) {
      const radius = 25 + Math.random() * 115;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[index] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[index + 1] = radius * Math.cos(phi);
      starPositions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({ color: 0xb8c9ff, size: 0.075, sizeAttenuation: true, transparent: true, opacity: 0.82 }),
    );
    scene.add(stars);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let down = { x: 0, y: 0 };
    const onPointerDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
    };
    const onPointerUp = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 7) return;
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(pickable, false)[0];
      const id = hit?.object.userData.planetId as string | undefined;
      if (id) selectRef.current(id);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointerup", onPointerUp);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    const travel = {
      active: false,
      target: new THREE.Vector3(),
      camera: new THREE.Vector3(),
    };
    const focusPosition = new THREE.Vector3();
    let consumedFocusToken = focusRef.current.token;
    const cancelTravel = () => { travel.active = false; };
    controls.addEventListener("start", cancelTravel);

    // Lusion-inspired smooth mouse parallax damping
    const mouseParallax = { targetX: 0, targetY: 0, currentX: 0, currentY: 0 };
    const onMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseParallax.targetX = (event.clientX / innerWidth - 0.5) * 0.35;
      mouseParallax.targetY = (event.clientY / innerHeight - 0.5) * 0.25;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Intelligent power-saving & frame throttling
    let isHidden = false;
    const onVisibilityChange = () => {
      isHidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    let frame = 0;
    const render = () => {
      frame = requestAnimationFrame(render);
      if (isHidden) return; // Skip GPU render if tab is hidden

      // Smooth lerp mouse parallax on the orbital system
      mouseParallax.currentX = THREE.MathUtils.lerp(mouseParallax.currentX, mouseParallax.targetX, 0.04);
      mouseParallax.currentY = THREE.MathUtils.lerp(mouseParallax.currentY, mouseParallax.targetY, 0.04);
      system.rotation.z = 0.1 + mouseParallax.currentX * 0.15;
      system.rotation.x = -0.32 + mouseParallax.currentY * 0.15;

      bodies.forEach((body, id) => {
        body.pivot.rotation.y += body.speed * 0.06;
        body.mesh.rotation.y += 0.0025;
        const target = id === activeRef.current ? body.base * 1.36 : body.base;
        const next = THREE.MathUtils.lerp(body.mesh.scale.x, target / body.base, 0.08);
        body.mesh.scale.setScalar(next);
      });
      if (focusRef.current.token !== consumedFocusToken) {
        consumedFocusToken = focusRef.current.token;
        const selected = focusRef.current.id ? bodies.get(focusRef.current.id) : undefined;
        if (selected) {
          system.updateMatrixWorld(true);
          selected.mesh.getWorldPosition(focusPosition);
          travel.target.copy(focusPosition);
          const direction = camera.position.clone().sub(controls.target).normalize();
          const distance = Math.max(4.5, selected.base * 5.7);
          travel.camera.copy(focusPosition).addScaledVector(direction, distance);
          travel.active = true;
        }
      }
      if (travel.active) {
        controls.target.lerp(travel.target, 0.055);
        camera.position.lerp(travel.camera, 0.045);
        if (camera.position.distanceTo(travel.camera) < 0.08 && controls.target.distanceTo(travel.target) < 0.06) travel.active = false;
      }
      sun.rotation.y += 0.003;
      corona.material.rotation += 0.0008;
      stars.rotation.y -= 0.000035;
      controls.update();
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      controls.removeEventListener("start", cancelTravel);
      controls.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="solar-webgl" ref={mountRef} aria-label="Interactive three-dimensional solar system. Drag to orbit, use the wheel to zoom, click a planet to lock it." />;
}

function glowTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext("2d");
  if (!context) return new THREE.CanvasTexture(canvas);
  const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, "#fff8da");
  gradient.addColorStop(0.18, color);
  gradient.addColorStop(0.58, "rgba(255,132,39,.18)");
  gradient.addColorStop(1, "rgba(255,132,39,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}
