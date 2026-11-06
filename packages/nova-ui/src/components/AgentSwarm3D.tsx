"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { initialAIOpsNodes } from "../engine/agent-stream";
import { AgentStepItem, AgentStepStatus, SwarmNode3D } from "../types";

interface AgentSwarm3DProps {
  currentStepIndex: number;
  steps: AgentStepItem[];
  overallStatus: AgentStepStatus;
  onSelectAgent?: (agentId: string) => void;
}

export function AgentSwarm3D({ currentStepIndex, steps, overallStatus, onSelectAgent }: AgentSwarm3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hoveredAgent, setHoveredAgent] = useState<SwarmNode3D | null>(null);

  const stepIndexRef = useRef(currentStepIndex);
  const statusRef = useRef(overallStatus);

  useEffect(() => {
    stepIndexRef.current = currentStepIndex;
  }, [currentStepIndex]);

  useEffect(() => {
    statusRef.current = overallStatus;
  }, [overallStatus]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0e1013, 0.12);

    const camera = new THREE.PerspectiveCamera(45, mount.clientWidth / Math.max(mount.clientHeight, 1), 0.1, 100);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x598cff, 2.5, 20);
    pointLight.position.set(0, 3, 4);
    scene.add(pointLight);

    // 3. Central Swarm Coordinator Core (Wireframe sphere + Ring)
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const coreGeo = new THREE.IcosahedronGeometry(0.55, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x598cff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    const coreRingGeo = new THREE.RingGeometry(0.85, 0.88, 64);
    const coreRingMat = new THREE.MeshBasicMaterial({
      color: 0x598cff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.25,
    });
    const coreRing = new THREE.Mesh(coreRingGeo, coreRingMat);
    coreRing.rotation.x = Math.PI / 2.5;
    coreGroup.add(coreRing);

    // 4. Vector Memory 3D Embeddings Cluster (Particle Point Cloud near RAG node)
    const ragPos = initialAIOpsNodes.find((n) => n.id === "rag")?.pos || [1.1, -1.3, -0.3];
    const particleCount = 280;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);
    const limeColor = new THREE.Color(0xb5dc59);
    const blueColor = new THREE.Color(0x598cff);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.2 + u * 0.75;

      const px = ragPos[0] + r * Math.sin(phi) * Math.cos(theta);
      const py = ragPos[1] + r * Math.sin(phi) * Math.sin(theta);
      const pz = ragPos[2] + r * Math.cos(phi);

      particlePositions[i * 3] = px;
      particlePositions[i * 3 + 1] = py;
      particlePositions[i * 3 + 2] = pz;

      const mixed = limeColor.clone().lerp(blueColor, Math.random() * 0.4);
      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    const vectorGeo = new THREE.BufferGeometry();
    vectorGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    vectorGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const vectorMat = new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });
    const vectorPoints = new THREE.Points(vectorGeo, vectorMat);
    scene.add(vectorPoints);

    // 5. Agent Node Mesh Representations
    const agentMeshes: Array<{
      id: string;
      group: THREE.Group;
      sphere: THREE.Mesh;
      halo: THREE.Mesh;
      color: string;
      pos: [number, number, number];
    }> = [];

    const sphereGeo = new THREE.SphereGeometry(0.32, 32, 32);

    initialAIOpsNodes.forEach((node) => {
      const nodeGroup = new THREE.Group();
      nodeGroup.position.set(...node.pos);

      // Node Sphere
      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(node.color),
        roughness: 0.25,
        metalness: 0.65,
        emissive: new THREE.Color(node.color),
        emissiveIntensity: 0.28,
      });
      const sphere = new THREE.Mesh(sphereGeo, mat);
      nodeGroup.add(sphere);

      // Orbit Halo Ring
      const haloGeo = new THREE.RingGeometry(0.48, 0.52, 48);
      const haloMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(node.color),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.35,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = Math.PI / 3;
      nodeGroup.add(halo);

      scene.add(nodeGroup);
      agentMeshes.push({ id: node.id, group: nodeGroup, sphere, halo, color: node.color, pos: node.pos });
    });

    // 6. Directed Communication Packet Streams (Curved Bezier Paths between nodes)
    const pipelineOrder = ["planner", "monitor", "rag", "fixer", "auditor"];
    const packetCurves: THREE.QuadraticBezierCurve3[] = [];

    for (let i = 0; i < pipelineOrder.length - 1; i++) {
      const fromNode = initialAIOpsNodes.find((n) => n.id === pipelineOrder[i])!;
      const toNode = initialAIOpsNodes.find((n) => n.id === pipelineOrder[i + 1])!;

      const start = new THREE.Vector3(...fromNode.pos);
      const end = new THREE.Vector3(...toNode.pos);
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5)
        .add(new THREE.Vector3(0, 0.35, 0.2));

      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      packetCurves.push(curve);

      // Draw faint trajectory guide line
      const linePoints = curve.getPoints(36);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(linePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
      });
      const curveLine = new THREE.Line(lineGeo, lineMat);
      scene.add(curveLine);
    }

    // Dynamic energy packets along curves
    const packetMeshGeo = new THREE.SphereGeometry(0.065, 16, 16);
    const packetMeshes = packetCurves.map((_, idx) => {
      const pMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(initialAIOpsNodes[idx].color),
      });
      const pMesh = new THREE.Mesh(packetMeshGeo, pMat);
      pMesh.visible = false;
      scene.add(pMesh);
      return pMesh;
    });

    // 7. Interactive Mouse / Raycaster Controls
    const mouse = new THREE.Vector2(-999, -999);
    const raycaster = new THREE.Raycaster();
    let isDragging = false;
    let pointerPrev = { x: 0, y: 0 };
    const targetRotation = { x: 0, y: 0 };
    const currentRotation = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      pointerPrev = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      if (!isDragging) return;
      const deltaX = e.clientX - pointerPrev.x;
      const deltaY = e.clientY - pointerPrev.y;
      pointerPrev = { x: e.clientX, y: e.clientY };

      targetRotation.y += deltaX * 0.005;
      targetRotation.x += deltaY * 0.005;
      targetRotation.x = Math.max(-0.6, Math.min(0.6, targetRotation.x));
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const interactiveSpheres = agentMeshes.map((m) => m.sphere);
      const intersects = raycaster.intersectObjects(interactiveSpheres);
      if (intersects.length > 0) {
        const hitSphere = intersects[0].object;
        const found = agentMeshes.find((m) => m.sphere === hitSphere);
        if (found && onSelectAgent) {
          onSelectAgent(found.id);
        }
      }
    };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("click", onClick);

    // 8. Resize Observer
    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(mount);

    // 9. Render & Animation Loop
    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = clock.getElapsedTime();
      const currentStep = stepIndexRef.current;
      const currentStat = statusRef.current;

      // Smooth scene rotation inertia
      currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
      currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;
      scene.rotation.y = currentRotation.y + elapsed * 0.04;
      scene.rotation.x = currentRotation.x;

      // Rotate core
      coreMesh.rotation.y += 0.01;
      coreRing.rotation.z -= 0.007;

      // Rotate vector memory points
      vectorPoints.rotation.y -= 0.008;

      // Dynamic Node Pulsation
      agentMeshes.forEach((mesh, idx) => {
        mesh.halo.rotation.z += 0.015;

        // Is this node active right now?
        const isActive = idx === currentStep - 1 && currentStat === "running";
        const isGateAlert = idx === currentStep - 1 && currentStat === "gate_approval";
        const isDone = idx < currentStep - 1 || currentStat === "completed";

        const standardMat = mesh.sphere.material as THREE.MeshStandardMaterial;

        if (isGateAlert) {
          // Warning blink
          const pulse = (Math.sin(elapsed * 8) + 1) * 0.5;
          mesh.group.scale.setScalar(1 + pulse * 0.28);
          mesh.halo.scale.setScalar(1 + pulse * 0.5);
          standardMat.emissiveIntensity = 0.8 + pulse * 0.8;
          standardMat.emissive.setHex(0xff6b46); // Alert coral
        } else if (isActive) {
          // Smooth active breathe
          const breathe = (Math.sin(elapsed * 4) + 1) * 0.5;
          mesh.group.scale.setScalar(1 + breathe * 0.18);
          mesh.halo.scale.setScalar(1 + breathe * 0.35);
          standardMat.emissiveIntensity = 0.6 + breathe * 0.5;
          standardMat.emissive.set(new THREE.Color(mesh.color));
        } else if (isDone) {
          mesh.group.scale.setScalar(1.0);
          mesh.halo.scale.setScalar(1.0);
          standardMat.emissiveIntensity = 0.35;
          standardMat.emissive.set(new THREE.Color(mesh.color));
        } else {
          // Idle
          mesh.group.scale.setScalar(0.92);
          mesh.halo.scale.setScalar(0.92);
          standardMat.emissiveIntensity = 0.12;
        }
      });

      // Animate packet transmission
      packetMeshes.forEach((packet, idx) => {
        // Packet flows when transition is occurring
        const isActiveChannel = idx === currentStep - 2 && currentStat === "running";
        if (isActiveChannel) {
          packet.visible = true;
          const curve = packetCurves[idx];
          const t = (elapsed * 1.5) % 1;
          const pos = curve.getPoint(t);
          packet.position.copy(pos);
        } else {
          packet.visible = false;
        }
      });

      // Raycasting for Hover
      raycaster.setFromCamera(mouse, camera);
      const interactiveSpheres = agentMeshes.map((m) => m.sphere);
      const intersects = raycaster.intersectObjects(interactiveSpheres);

      if (intersects.length > 0) {
        const hitSphere = intersects[0].object;
        const found = agentMeshes.find((m) => m.sphere === hitSphere);
        if (found) {
          const nodeData = initialAIOpsNodes.find((n) => n.id === found.id) || null;
          setHoveredAgent(nodeData);
        }
      } else {
        setHoveredAgent(null);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("click", onClick);

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectAgent]);

  return (
    <div className="nova-swarm-3d-wrapper" style={{ position: "relative", width: "100%", height: "460px" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%", cursor: "grab" }} />

      {/* Floating 3D HUD Telemetry overlay */}
      <div className="swarm-3d-hud-top">
        <div className="hud-badge">
          <span className="hud-dot" />
          <strong>3D SPATIAL SWARM ENGINE</strong>
          <small>THREE.JS / WEBGL VIRTUAL TOPOLOGY</small>
        </div>
        <div className="hud-legend">
          <span>
            <i style={{ background: "#598cff" }} /> Planner
          </span>
          <span>
            <i style={{ background: "#ffa748" }} /> Monitor
          </span>
          <span>
            <i style={{ background: "#b5dc59" }} /> RAG (2.4GB Vector)
          </span>
          <span>
            <i style={{ background: "#ff6b46" }} /> Fixer (Gate)
          </span>
          <span>
            <i style={{ background: "#9a82ff" }} /> Auditor
          </span>
        </div>
      </div>

      {/* Hovered Node Tooltip */}
      {hoveredAgent && (
        <div className="swarm-3d-tooltip">
          <div className="tooltip-head">
            <strong style={{ color: hoveredAgent.color }}>{hoveredAgent.label}</strong>
            <span>{hoveredAgent.role}</span>
          </div>
          <div className="tooltip-stats">
            <span>
              Memory: <b>{hoveredAgent.memorySize}</b>
            </span>
            <span>
              Status: <b>{hoveredAgent.id === steps[currentStepIndex - 1]?.id ? "ACTIVE" : "ONLINE"}</b>
            </span>
          </div>
        </div>
      )}

      {/* Bottom Hint */}
      <div className="swarm-3d-hint">
        <span>🖱️ 拖拽可旋转 3D 智能体星系 · 点击星体节点可聚焦查看 Memory 内存与运行上下文</span>
      </div>
    </div>
  );
}
