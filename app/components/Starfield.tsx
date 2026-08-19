"use client";

import { useEffect, useRef } from "react";

type StarfieldProps = { density?: number };

export function Starfield({ density = 180 }: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frame = 0;
    let pointer = { x: 0, y: 0 };
    const stars = Array.from({ length: density }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.3 + 0.15,
      drift: (Math.random() * 0.35 + 0.08) * (index % 3 === 0 ? -1 : 1),
      alpha: Math.random() * 0.65 + 0.15,
      hue: Math.random() > 0.88 ? 210 + Math.random() * 55 : 0,
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      context.clearRect(0, 0, width, height);
      stars.forEach((star, index) => {
        const x = ((star.x * width + frame * star.drift + pointer.x * (index % 4) * 0.3) % width + width) % width;
        const y = star.y * height + pointer.y * (index % 5) * 0.12;
        const pulse = 0.74 + Math.sin(frame * 0.015 + index) * 0.26;
        context.beginPath();
        context.fillStyle = star.hue
          ? `hsla(${star.hue}, 80%, 85%, ${star.alpha * pulse})`
          : `rgba(255,255,255,${star.alpha * pulse})`;
        context.arc(x, y, star.size, 0, Math.PI * 2);
        context.fill();
      });
      frame += 0.35;
      requestAnimationFrame(draw);
    };

    const onMove = (event: PointerEvent) => {
      pointer = {
        x: (event.clientX / window.innerWidth - 0.5) * 10,
        y: (event.clientY / window.innerHeight - 0.5) * 10,
      };
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density]);

  return <canvas ref={canvasRef} className="starfield" aria-hidden="true" />;
}
