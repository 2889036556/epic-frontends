"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Planet } from "../space-data";
import { WorldGlobe } from "./WorldGlobe";
import { WorldInstrument } from "./WorldInstrument";

export function PlanetConsole({ planet, index }: { planet: Planet; index: number }) {
  const [isRunning, setIsRunning] = useState(false);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const updateClock = () => setClock(new Date().toUTCString().slice(17, 25));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main className="world-shell" style={{ "--accent": planet.accent, "--accent-dark": planet.darkAccent } as CSSProperties}>
      <div className="world-background-grid" />
      <header className="world-topbar">
        <Link href="/" className="back-link"><span>←</span> 返回轨道星图</Link>
        <div>行星 {String(index + 1).padStart(2, "0")} / 08</div>
        <div>UTC {clock}</div>
      </header>

      <section className="world-hero">
        <div className="world-intro">
          <p className="eyebrow">{planet.kicker}</p>
          <h1>{planet.name}</h1>
          <p className="world-descriptor">{planet.descriptor}</p>
          <p className="world-description">{planet.description}</p>
          <button className={`sequence-button ${isRunning ? "is-running" : ""}`} onClick={() => setIsRunning((running) => !running)}>
            <span className="sequence-dot" />
            {isRunning ? "仪器流运行中" : `启动${planet.function}`}
            <b>↗</b>
          </button>
          <p className="sequence-status">{isRunning ? "控制已解锁 — 调整下方实时本地模拟。" : "待机 — 启动后开始使用工作仪器。"}</p>
        </div>

        <div className="world-globe-frame">
          <WorldGlobe planet={planet} />
          <div className="world-globe-caption top"><span>真实 3D 纹理</span><b>拖拽旋转</b></div>
          <div className="world-globe-caption left"><span>距太阳</span><b>{planet.distance}</b></div>
          <div className="world-globe-caption right"><span>公转周期</span><b>{planet.period}</b></div>
        </div>
      </section>

      <WorldInstrument planet={planet} isRunning={isRunning} />

      <section className="world-constants">
        <div><span>自转周期</span><strong>{planet.rotation}</strong></div>
        <div><span>平均温度</span><strong>{planet.temperature}</strong></div>
        <div><span>功能仪器</span><strong>{planet.function}</strong></div>
      </section>
      <footer className="world-footer"><span>轨道星图 · 本地交互模式</span><a href="https://www.solarsystemscope.com/textures/" target="_blank" rel="noreferrer">3D 纹理：SOLAR SYSTEM SCOPE ↗</a></footer>
    </main>
  );
}
