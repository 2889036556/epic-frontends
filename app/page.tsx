"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { SolarSystem3D } from "./components/SolarSystem3D";
import { planets } from "./space-data";
import { SoundEngine } from "./utils/audio";

export default function Home() {
  const [activeId, setActiveId] = useState("earth");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [focusToken, setFocusToken] = useState(0);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(true);

  const active = useMemo(
    () => planets.find((planet) => planet.id === activeId) ?? planets[2],
    [activeId],
  );

  const selectWorld = (id: string) => {
    SoundEngine.playPop(580);
    setActiveId(id);
    setFocusId(id);
    setFocusToken((token) => token + 1);
  };

  const toggleSound = () => {
    const next = SoundEngine.toggle();
    setSoundActive(next);
  };

  return (
    <main className="galaxy-shell">
      <SolarSystem3D activeId={activeId} focusId={focusId} focusToken={focusToken} onSelect={selectWorld} />
      <div className="galaxy-vignette" />
      <div className="galaxy-grain" />

      <header className="galaxy-topbar">
        <Link className="wordmark" href="/" aria-label="轨道星图首页" onMouseEnter={() => SoundEngine.playTick()}>
          <span className="wordmark-dot" />
          <span>ORBITAL</span>
          <i>/</i>
          <em>星图</em>
        </Link>

        {/* Global Navigation Hub */}
        <nav className="galaxy-hub-nav">
          <Link href="/" className="is-active" onMouseEnter={() => SoundEngine.playTick()}>
            🪐 太阳系星图
          </Link>
          <Link href="/shop" onMouseEnter={() => SoundEngine.playTick()} onClick={() => SoundEngine.playPop()}>
            🛍️ 3D 交互电商 (NEW)
          </Link>
          <Link href="/ai" onMouseEnter={() => SoundEngine.playTick()} onClick={() => SoundEngine.playPop()}>
            🤖 AI 生产级母版
          </Link>
        </nav>

        <div className="topbar-right-group">
          <button
            className="sound-toggle-btn"
            onClick={toggleSound}
            title={soundActive ? "静音" : "开启声效"}
            aria-label="声效控制"
          >
            {soundActive ? "🔊 声效: 开" : "🔈 静音"}
          </button>
          <button
            className="menu-trigger"
            onClick={() => {
              SoundEngine.playPop();
              setIsMapOpen((open) => !open);
            }}
            aria-expanded={isMapOpen}
            onMouseEnter={() => SoundEngine.playTick()}
          >
            <span>行星索引</span>
            <b>{isMapOpen ? "×" : "+"}</b>
          </button>
        </div>
      </header>

      <section className="galaxy-intro" aria-labelledby="galaxy-title">
        <p className="eyebrow">交互式天体场 / 08 个观测仪器在线 · LERPS 视差阻尼</p>
        <h1 id="galaxy-title">
          进入
          <br />
          <span>已知</span>宇宙。
        </h1>
        <p>移动鼠标体验视差阻尼，拖拽旋转，滚轮推进，点击行星锁定观测镜头。</p>
      </section>

      <section className="target-hud" aria-live="polite">
        <div className="hud-number">{String(planets.findIndex(({ id }) => id === active.id) + 1).padStart(2, "0")}</div>
        <div className="hud-copy">
          <p>{focusId === active.id ? "观测已锁定" : "观测目标"}</p>
          <strong>{active.name}</strong>
          <span>{active.kicker}</span>
        </div>
        <div className="hud-data">
          <span>距太阳</span>
          <b>{active.distance}</b>
          <span>公转周期</span>
          <b>{active.period}</b>
        </div>
        <Link
          className="hud-enter"
          href={`/${active.id}`}
          onClick={() => SoundEngine.playChime()}
          onMouseEnter={() => SoundEngine.playTick()}
        >
          打开 {active.function} <b>↗</b>
        </Link>
      </section>

      <aside className={`galaxy-index ${isMapOpen ? "is-open" : ""}`}>
        <div className="index-head">
          <span>行星索引</span>
          <small>选择以聚焦</small>
        </div>
        <div className="galaxy-index-list">
          {planets.map((planet, index) => (
            <button
              key={planet.id}
              className={planet.id === active.id ? "is-selected" : ""}
              onClick={() => {
                selectWorld(planet.id);
                setIsMapOpen(false);
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{planet.name}</strong>
              <em>{planet.function}</em>
              <b>+</b>
            </button>
          ))}
        </div>
      </aside>

      <div className="galaxy-controls" aria-hidden="true">
        <span>拖拽 / 旋转</span>
        <i /> <span>滚轮 / 推进</span>
        <i /> <span>鼠标移动 / 视差跟随</span>
        <i /> <span>点击 / 锁定</span>
      </div>
      <footer className="galaxy-footer">
        <span>WEBGL 飞行甲板 · 自动节能休眠模式</span>
        <div className="footer-links">
          <Link href="/shop" onMouseEnter={() => SoundEngine.playTick()}>
            前往 3D 交互电商平台 ↗
          </Link>
          <Link href="/ai" onMouseEnter={() => SoundEngine.playTick()}>
            前往 AI 生产级前端母版 ↗
          </Link>
        </div>
      </footer>
    </main>
  );
}
