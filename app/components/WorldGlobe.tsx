"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { Planet } from "../space-data";

export function WorldGlobe({ planet }: { planet: Planet }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 50);
    camera.position.set(0, 0.4, 7.1);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0x7689be, 0.32));
    const keyLight = new THREE.DirectionalLight(0xffe3b0, 2.6);
    keyLight.position.set(4, 2, 5);
    scene.add(keyLight);
    const rimLight = new THREE.DirectionalLight(0x4f7dff, 0.8);
    rimLight.position.set(-4, -1, -3);
    scene.add(rimLight);

    const texture = new THREE.TextureLoader().load(planet.texture);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const globe = new THREE.Group();
    // Saturn needs a stable oblique ring plane: it stays recognisably Saturn
    // while still rotating as one physical object with the globe.
    globe.rotation.z = planet.id === "uranus" ? 1.58 : planet.id === "saturn" ? 0.47 : 0.12;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(2.05, 72, 72),
      new THREE.MeshStandardMaterial({ map: texture, roughness: planet.id === "earth" ? 0.58 : 0.86 }),
    );
    mesh.rotation.y = 0.65;
    globe.add(mesh);
    scene.add(globe);

    if (planet.id === "saturn") {
      const ringTexture = new THREE.TextureLoader().load("/textures/saturn_ring_alpha.png");
      ringTexture.colorSpace = THREE.SRGBColorSpace;
      const geometry = new THREE.RingGeometry(2.75, 4.32, 128);
      const positions = geometry.attributes.position;
      const uvs = geometry.attributes.uv;
      for (let index = 0; index < positions.count; index += 1) {
        const radius = Math.sqrt(positions.getX(index) ** 2 + positions.getY(index) ** 2);
        uvs.setXY(index, (radius - 2.75) / (4.32 - 2.75), 0.5);
      }
      const rings = new THREE.Mesh(
        geometry,
        new THREE.MeshBasicMaterial({ map: ringTexture, transparent: true, opacity: 0.9, side: THREE.DoubleSide, depthWrite: false }),
      );
      rings.rotation.x = Math.PI * 0.5;
      rings.rotation.z = 0.16;
      globe.add(rings);
    }

    const stars = new THREE.Points(
      makeStarGeometry(460),
      new THREE.PointsMaterial({ color: 0xb9caff, size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.7 }),
    );
    scene.add(stars);

    let drag = { active: false, x: 0, y: 0 };
    const canvas = renderer.domElement;
    const down = (event: PointerEvent) => {
      drag = { active: true, x: event.clientX, y: event.clientY };
      canvas.setPointerCapture(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!drag.active) return;
      globe.rotation.y += (event.clientX - drag.x) * 0.008;
      globe.rotation.x += (event.clientY - drag.y) * 0.005;
      drag = { ...drag, x: event.clientX, y: event.clientY };
    };
    const up = () => { drag.active = false; };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);

    const resize = () => {
      const { width, height } = mount.getBoundingClientRect();
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    let frame = 0;
    const draw = () => {
      frame = requestAnimationFrame(draw);
      if (!drag.active) globe.rotation.y += 0.0018;
      stars.rotation.y -= 0.0004;
      renderer.render(scene, camera);
    };
    draw();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [planet]);

  return <div className="world-globe" ref={mountRef} aria-label={`Interactive three-dimensional view of ${planet.name}. Drag to rotate.`} />;
}

function makeStarGeometry(count: number) {
  const positions = new Float32Array(count * 3);
  for (let index = 0; index < positions.length; index += 3) {
    const radius = 6 + Math.random() * 11;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[index] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index + 1] = radius * Math.cos(phi);
    positions[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return geometry;
}
