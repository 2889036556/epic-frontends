"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Starfield } from "./components/Starfield";
import { planets } from "./space-data";

export default function Home() {
  const [activeId, setActiveId] = useState("earth");
  const [isMapOpen, setIsMapOpen] = useState(false);
  const active = useMemo(
    () => planets.find((planet) => planet.id === activeId) ?? planets[2],
    [activeId],
  );

  return (
    <main className="atlas-shell">
      <Starfield density={260} />
      <div className="nebula nebula-a" />
      <div className="nebula nebula-b" />
      <div className="grid-haze" />

      <header className="topbar">
        <Link className="wordmark" href="/" aria-label="Orbital Atlas home">
          <span className="wordmark-dot" />
          <span>ORBITAL</span>
          <i>/</i>
          <em>ATLAS</em>
        </Link>
        <div className="topbar-center">
          <span className="status-pip" />
          08 WORLDS · 08 INSTRUMENTS
        </div>
        <button
          className="menu-trigger"
          onClick={() => setIsMapOpen((open) => !open)}
          aria-expanded={isMapOpen}
          aria-controls="world-index"
        >
          <span>WORLD INDEX</span>
          <b>{isMapOpen ? "×" : "+"}</b>
        </button>
      </header>

      <section className="home-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">SECTOR 01 — OUR CELESTIAL NEIGHBORHOOD</p>
          <h1 id="home-title">
            SOLAR
            <br />
            <span>SYSTEM</span>
            <br />
            ATLAS
          </h1>
          <p className="hero-description">
            Eight worlds, eight instruments. Each celestial body opens a focused
            console for signals, missions, climate, and navigation.
          </p>
          <div className="hero-instructions">
            <span className="mouse-cue" />
            <span>SELECT A WORLD TO ENTER ITS CONSOLE</span>
          </div>
        </div>

        <div className="active-readout" aria-live="polite">
          <p>NOW IN FRAME</p>
          <strong>{active.name}</strong>
          <span>{active.kicker}</span>
          <Link href={`/${active.id}`} className="readout-link">
            OPEN {active.function.toUpperCase()} <b>↗</b>
          </Link>
        </div>
      </section>

      <section className="orbital-stage" aria-label="Choose a planetary console">
        <div className="sun-core" aria-hidden="true">
          <div className="sun-noise" />
          <span>THE SUN</span>
        </div>
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="orbit orbit-three" />
        <div className="orbit orbit-four" />
        <div className="orbit orbit-five" />

        {planets.map((planet, index) => (
          <Link
            href={`/${planet.id}`}
            key={planet.id}
            className={`world world-${planet.id} ${activeId === planet.id ? "is-active" : ""}`}
            onMouseEnter={() => setActiveId(planet.id)}
            onFocus={() => setActiveId(planet.id)}
            aria-label={`Enter ${planet.name}: ${planet.function}`}
            style={{ "--world-delay": `${index * -1.2}s` } as React.CSSProperties}
          >
            <span className="world-halo" />
            <span
              className={`world-surface ${planet.id === "saturn" ? "world-saturn" : ""}`}
              style={{ backgroundImage: `url(${planet.image})` }}
            />
            <span className="world-label">
              <i>{String(index + 1).padStart(2, "0")}</i>
              {planet.name}
            </span>
          </Link>
        ))}
      </section>

      <aside id="world-index" className={`world-index ${isMapOpen ? "is-open" : ""}`}>
        <div className="index-head">
          <span>WORLD INDEX</span>
          <small>SELECT AN INSTRUMENT</small>
        </div>
        <div className="index-list">
          {planets.map((planet, index) => (
            <Link key={planet.id} href={`/${planet.id}`} className="index-world">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{planet.name}</strong>
              <em>{planet.function}</em>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </aside>

      <footer className="home-footer">
        <span>LOCAL TIME // 00:00:00 UTC</span>
        <span>© ORBITAL ATLAS / RESEARCH INTERFACE</span>
        <a href="https://svs.gsfc.nasa.gov/30710/" target="_blank" rel="noreferrer">
          REAL PLANETARY IMAGERY: NASA SVS ↗
        </a>
      </footer>
    </main>
  );
}
