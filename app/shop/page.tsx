"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductTheme, ShaderMode, ShopCanvas3D } from "../components/ShopCanvas3D";
import { SoundEngine } from "../utils/audio";

const themeList: Array<{
  id: ProductTheme;
  code: string;
  name: string;
  enName: string;
  hex: string;
  accent: string;
}> = [
  { id: "chrome", code: "01", name: "液态镀铬", enName: "Liquid Chrome", hex: "#e0e6f0", accent: "#64f5ba" },
  { id: "obsidian", code: "02", name: "曜石暗钛", enName: "Obsidian Titanium", hex: "#15171d", accent: "#598cff" },
  { id: "amber", code: "03", name: "星云赤金", enName: "Solar Amber", hex: "#ff6b46", accent: "#ffa748" },
  { id: "violet", code: "04", name: "极光紫晶", enName: "Cyber Violet", hex: "#9a82ff", accent: "#d48eff" },
];

const hotspotData = [
  {
    id: 1,
    tag: "01 / GYRO",
    title: "磁悬浮动量外环",
    desc: "精密磁悬浮轴承配合双轴无刷微电机，0.02° 物理偏角实时自适应追踪。",
  },
  {
    id: 2,
    tag: "02 / CORE",
    title: "40mm 碳纤维纳米振膜",
    desc: "高纯度铍悬边结合多层碳纳米管涂层，瞬态高频响应扩展至 48,000Hz。",
  },
  {
    id: 3,
    tag: "03 / CHIP",
    title: "AURA 空间计算核心",
    desc: "实时运行 HRTF 双耳渲染与房间声学建模算法，无线端到端延迟仅 1.2ms。",
  },
];

export default function LusionShopPage() {
  const [theme, setTheme] = useState<ProductTheme>("chrome");
  const [mode, setMode] = useState<ShaderMode>("fluid");
  const [activeHotspot, setActiveHotspot] = useState<number | null>(1);
  const [soundActive, setSoundActive] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutDone, setIsCheckoutDone] = useState(false);

  // Audio wave visualizer canvas ref
  const soundWaveRef = useRef<HTMLCanvasElement>(null);

  // Animate sound visualizer in the header
  useEffect(() => {
    const canvas = soundWaveRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    const renderWave = () => {
      frame = requestAnimationFrame(renderWave);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 5;
      const barWidth = 3;
      const gap = 3;
      const totalWidth = barCount * barWidth + (barCount - 1) * gap;
      const startX = (canvas.width - totalWidth) / 2;

      ctx.fillStyle = soundActive ? "#ffffff" : "rgba(255,255,255,0.3)";
      for (let i = 0; i < barCount; i++) {
        const h = soundActive ? Math.sin(Date.now() * 0.008 + i * 1.2) * 8 + 10 : 3;
        const x = startX + i * (barWidth + gap);
        const y = (canvas.height - h) / 2;
        ctx.fillRect(x, y, barWidth, h);
      }
    };
    renderWave();

    return () => cancelAnimationFrame(frame);
  }, [soundActive]);

  const toggleSound = () => {
    const next = SoundEngine.toggle();
    setSoundActive(next);
  };

  const handleThemeChange = (t: ProductTheme) => {
    SoundEngine.playWhoosh();
    setTheme(t);
  };

  const handleModeChange = (m: ShaderMode) => {
    SoundEngine.playPop(520);
    setMode(m);
  };

  const handleAddToCart = () => {
    SoundEngine.playChime();
    setCartCount((c) => c + 1);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    SoundEngine.playChime();
    setIsCheckoutDone(true);
    setTimeout(() => {
      setIsCheckoutDone(false);
      setIsCartOpen(false);
      setCartCount(0);
    }, 2600);
  };

  const currentThemeConfig = themeList.find((t) => t.id === theme) || themeList[0];

  return (
    <main className="lusion-shop-shell">
      {/* 3D WebGL Fluid Canvas */}
      <ShopCanvas3D theme={theme} mode={mode} activeHotspot={activeHotspot} />

      {/* Atmospheric Vignette & Soft Grain */}
      <div className="lusion-vignette" />
      <div className="lusion-grain" />

      {/* Lusion-style Signature Header */}
      <header className="lusion-header">
        <Link className="lusion-logo" href="/" onMouseEnter={() => SoundEngine.playTick()}>
          <svg width="110" height="22" viewBox="0 0 121 24" fill="none">
            <path
              d="M0 23.781V.22h3.871v20.129h10.132v3.433H0ZM22.76.118v13.666c0 2.222.438 3.893 1.313 5.015.875 1.1 2.233 1.65 4.073 1.65 1.862 0 3.231-.55 4.106-1.65.898-1.122 1.347-2.793 1.347-5.015V.118h3.87v13.464c0 3.366-.796 5.924-2.39 7.675-1.57 1.75-3.881 2.625-6.933 2.625-3.03 0-5.33-.875-6.9-2.625-1.572-1.75-2.357-4.309-2.357-7.675V.118h3.871ZM46.16 16.123c.112 1.392.673 2.514 1.683 3.366 1.032.83 2.367 1.246 4.005 1.246 1.436 0 2.592-.303 3.467-.909.898-.628 1.347-1.492 1.347-2.592 0-.785-.247-1.402-.74-1.851-.472-.471-1.123-.83-1.953-1.077-.83-.247-1.997-.505-3.5-.774-1.527-.27-2.84-.618-3.94-1.044a6.43 6.43 0 0 1-2.658-2.02c-.674-.897-1.01-2.075-1.01-3.534 0-1.346.348-2.547 1.043-3.602.718-1.054 1.706-1.873 2.962-2.457C48.146.292 49.604 0 51.242 0c1.683 0 3.187.314 4.51.942 1.325.629 2.368 1.493 3.131 2.592.763 1.1 1.178 2.357 1.246 3.77h-3.804c-.135-1.211-.662-2.188-1.582-2.928-.92-.74-2.087-1.11-3.5-1.11-1.37 0-2.47.302-3.3.908-.807.583-1.211 1.414-1.211 2.49 0 .764.235 1.37.707 1.818.493.45 1.144.786 1.952 1.01.808.225 1.964.472 3.467.74 1.526.27 2.839.63 3.938 1.078 1.1.449 1.998 1.11 2.693 1.986.696.875 1.044 2.03 1.044 3.467 0 1.391-.37 2.637-1.111 3.736-.74 1.1-1.773 1.964-3.097 2.592-1.324.606-2.828.909-4.51.909-1.863 0-3.501-.337-4.915-1.01-1.414-.673-2.524-1.604-3.332-2.794-.786-1.211-1.19-2.591-1.212-4.14l3.803.067ZM65.419.219h3.87V23.78h-3.87V.22ZM97.065 12c0 2.289-.482 4.342-1.447 6.16-.965 1.818-2.323 3.242-4.073 4.275-1.728 1.032-3.703 1.548-5.924 1.548-2.222 0-4.208-.516-5.958-1.548-1.728-1.032-3.075-2.457-4.04-4.275-.965-1.818-1.447-3.871-1.447-6.16s.483-4.342 1.447-6.16c.965-1.818 2.312-3.243 4.04-4.275C81.413.533 83.399.017 85.62.017c2.221 0 4.196.516 5.924 1.548 1.75 1.032 3.108 2.457 4.073 4.275.965 1.818 1.447 3.871 1.447 6.16Zm-18.917 0c0 1.638.314 3.12.943 4.443.628 1.302 1.503 2.323 2.625 3.063 1.144.718 2.446 1.078 3.905 1.078 1.458 0 2.749-.36 3.87-1.078 1.145-.74 2.031-1.761 2.66-3.063.628-1.324.942-2.805.942-4.443 0-1.638-.314-3.108-.942-4.41-.629-1.324-1.515-2.345-2.66-3.063-1.121-.74-2.412-1.11-3.87-1.11-1.459 0-2.76.37-3.905 1.11-1.122.718-1.997 1.74-2.625 3.063-.629 1.302-.943 2.772-.943 4.41ZM101.951 23.781V.22h3.535l11.478 16.695V.22h3.804V23.78h-3.535L105.755 7.086V23.78h-3.804Z"
              fill="currentColor"
            />
          </svg>
          <span className="lusion-submark">AURA / 01</span>
        </Link>

        <nav className="lusion-center-nav">
          <Link href="/" onMouseEnter={() => SoundEngine.playTick()}>
            🪐 SOLAR SYSTEM
          </Link>
          <Link href="/ai" onMouseEnter={() => SoundEngine.playTick()}>
            🤖 AI BENCHMARK
          </Link>
          <span className="is-active">🛍️ SPATIAL STORE</span>
        </nav>

        <div className="lusion-header-right">
          {/* Audio Equalizer Button */}
          <button
            className="lusion-sound-btn"
            onClick={toggleSound}
            title={soundActive ? "Mute Audio" : "Unmute Audio"}
            aria-label="Sound Toggle"
          >
            <canvas ref={soundWaveRef} width="32" height="24" />
          </button>

          {/* Cart Pill Button */}
          <button
            className="lusion-pill-btn lusion-cart-pill"
            onClick={() => {
              SoundEngine.playPop(480);
              setIsCartOpen(true);
            }}
            onMouseEnter={() => SoundEngine.playTick()}
          >
            <span className="pill-text">BAG</span>
            <span className="pill-badge">{cartCount}</span>
          </button>

          {/* Contact / Order CTA Pill */}
          <button
            className="lusion-pill-btn lusion-cta-pill"
            onClick={handleAddToCart}
            onMouseEnter={() => SoundEngine.playTick()}
          >
            <span className="pill-dot" />
            <span className="pill-text">ORDER · $899</span>
            <span className="pill-arrow">↗</span>
          </button>
        </div>
      </header>

      {/* Main Hero Screen - Lusion Bold Typography & Interactive Overlays */}
      <section className="lusion-hero">
        <div className="lusion-hero-content">
          <div className="lusion-kicker">
            <span className="kicker-index">SPECIMEN // 01</span>
            <span className="kicker-tag">SPATIAL TRANSDUCER</span>
          </div>

          <h1 className="lusion-title">
            AURA
            <br />
            <span className="lusion-stroke">KINETIC</span>
          </h1>

          <p className="lusion-bio">
            An organic, magnetic-levitation acoustic transducer crafted from liquid titanium. 7.1.4 spatial audio with 1.2ms
            latency.
          </p>

          <div className="lusion-interaction-cue">
            <span className="cue-dot" />
            <span>DRAG ANYWHERE TO MORPH FLUID PHYSICS</span>
          </div>
        </div>

        {/* Floating Shader Mode Switcher (Lusion Floating Pills) */}
        <aside className="lusion-floating-modes">
          <span className="panel-label">SHADER STATE</span>
          <div className="lusion-pill-group">
            <button
              className={mode === "fluid" ? "is-active" : ""}
              onClick={() => handleModeChange("fluid")}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>01</span> FLUID PHYSICS
            </button>
            <button
              className={mode === "exploded" ? "is-active" : ""}
              onClick={() => handleModeChange("exploded")}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>02</span> EXPLODED VIEW
            </button>
            <button
              className={mode === "wireframe" ? "is-active" : ""}
              onClick={() => handleModeChange("wireframe")}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>03</span> X-RAY MATRIX
            </button>
            <button
              className={mode === "crystal" ? "is-active" : ""}
              onClick={() => handleModeChange("crystal")}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>04</span> ARCTIC CRYSTAL
            </button>
          </div>
        </aside>

        {/* Floating Material Palette (Lusion Swatch Dock) */}
        <aside className="lusion-floating-swatches">
          <span className="panel-label">MATERIAL FINISH</span>
          <div className="lusion-swatch-list">
            {themeList.map((t) => (
              <button
                key={t.id}
                className={`lusion-swatch-item ${theme === t.id ? "is-selected" : ""}`}
                onClick={() => handleThemeChange(t.id)}
                onMouseEnter={() => SoundEngine.playTick()}
              >
                <span className="swatch-bubble" style={{ backgroundColor: t.hex }} />
                <div className="swatch-text">
                  <strong>{t.enName}</strong>
                  <small>{t.name}</small>
                </div>
                <span className="swatch-code">{t.code}</span>
              </button>
            ))}
          </div>
        </aside>
      </section>

      {/* Floating 3D Hotspot Inspector Strip */}
      <section className="lusion-hotspot-strip">
        <div className="hotspot-head">
          <span className="hotspot-overline">ENGINEERING ANATOMY</span>
          <h2>Click to inspect hardware subsystem</h2>
        </div>

        <div className="hotspot-grid">
          {hotspotData.map((spot) => (
            <div
              key={spot.id}
              role="button"
              tabIndex={0}
              className={`hotspot-card ${activeHotspot === spot.id ? "is-active" : ""}`}
              onClick={() => {
                SoundEngine.playPop(580);
                setActiveHotspot(spot.id);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  SoundEngine.playPop(580);
                  setActiveHotspot(spot.id);
                }
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span className="hotspot-tag">{spot.tag}</span>
              <h3>{spot.title}</h3>
              <p>{spot.desc}</p>
              <div className="hotspot-bar" />
            </div>
          ))}
        </div>
      </section>

      {/* Big Typographic Specs Band (Lusion Style) */}
      <section className="lusion-specs-band">
        <div className="spec-huge">
          <span>LATENCY</span>
          <strong>1.2ms</strong>
          <small>Zero-lag lossless 24-bit stream</small>
        </div>
        <div className="spec-huge">
          <span>WEIGHT</span>
          <strong>184g</strong>
          <small>Grade-5 Aerospace Titanium</small>
        </div>
        <div className="spec-huge">
          <span>RESPONSE</span>
          <strong>48kHz</strong>
          <small>Carbon Nanotube Diaphragm</small>
        </div>
        <div className="spec-huge">
          <span>POWER</span>
          <strong>48hrs</strong>
          <small>Qi2 Mag-Lev Continuous Playback</small>
        </div>
      </section>

      {/* Slide-over Shopping Bag Drawer */}
      {isCartOpen && (
        <div
          className="lusion-cart-overlay"
          role="button"
          tabIndex={0}
          aria-label="关闭购物车"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsCartOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setIsCartOpen(false);
          }}
        >
          <div className="lusion-cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping Bag">
            <div className="cart-header">
              <div>
                <span className="cart-eyebrow">AURA STORE // SELECTION</span>
                <strong>SHOPPING BAG ({cartCount})</strong>
              </div>
              <button
                className="cart-close-pill"
                onClick={() => setIsCartOpen(false)}
                onMouseEnter={() => SoundEngine.playTick()}
              >
                CLOSE ✕
              </button>
            </div>

            {cartCount > 0 ? (
              <div className="cart-content">
                <div className="cart-item">
                  <div className="cart-item-graphic" style={{ borderColor: currentThemeConfig.accent }}>
                    <span>3D</span>
                  </div>
                  <div className="cart-item-details">
                    <strong>AURA-X1 TRANSDUCER</strong>
                    <span>FINISH: {currentThemeConfig.enName}</span>
                    <b style={{ color: currentThemeConfig.accent }}>$899 USD</b>
                  </div>
                </div>

                <div className="cart-breakdown">
                  <div>
                    <span>Subtotal</span>
                    <b>${899 * cartCount} USD</b>
                  </div>
                  <div>
                    <span>Global Express Shipping</span>
                    <strong style={{ color: "var(--nova-lime)" }}>COMPLIMENTARY</strong>
                  </div>
                  <div>
                    <span>2-Year Full Hardware Coverage</span>
                    <span>INCLUDED</span>
                  </div>
                  <div className="cart-total-line">
                    <strong>TOTAL DUE</strong>
                    <b>${899 * cartCount} USD</b>
                  </div>
                </div>

                {isCheckoutDone ? (
                  <div className="checkout-badge-success">
                    <strong>✓ ORDER AUTHORIZED</strong>
                    <p>Redirecting to secure tokenized payment settlement...</p>
                  </div>
                ) : (
                  <button className="cart-checkout-pill" onClick={handleCheckout} onMouseEnter={() => SoundEngine.playTick()}>
                    <span className="pill-dot" />
                    <span>CHECKOUT SECURELY</span>
                    <span className="pill-arrow">↗</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="cart-empty-block">
                <p>Your bag is currently empty.</p>
                <button
                  className="lusion-pill-btn"
                  onClick={() => setIsCartOpen(false)}
                  onMouseEnter={() => SoundEngine.playTick()}
                >
                  RETURN TO 3D SHOWCASE
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Lusion Minimalist Footer */}
      <footer className="lusion-footer">
        <div className="footer-left">
          <strong>AURA / LUSION DESIGN SYSTEM</strong>
          <span>AWARD-WINNING INTERACTIVE 3D WEB COMMERCE</span>
        </div>
        <div className="footer-links">
          <Link href="/" onMouseEnter={() => SoundEngine.playTick()}>
            SOLAR SYSTEM ↗
          </Link>
          <Link href="/ai" onMouseEnter={() => SoundEngine.playTick()}>
            AI TEMPLATE ↗
          </Link>
        </div>
      </footer>
    </main>
  );
}
