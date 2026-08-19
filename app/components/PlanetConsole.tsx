"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Planet } from "../space-data";
import { Starfield } from "./Starfield";

export function PlanetConsole({ planet, index }: { planet: Planet; index: number }) {
  const [range, setRange] = useState(62);
  const [isRunning, setIsRunning] = useState(false);
  const [selected, setSelected] = useState(0);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const updateClock = () => setClock(new Date().toUTCString().slice(17, 25));
    updateClock();
    const timer = window.setInterval(updateClock, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <main
      className="console-shell"
      style={{ "--accent": planet.accent, "--accent-dark": planet.darkAccent } as React.CSSProperties}
    >
      <Starfield density={160} />
      <div className="console-glow" />
      <div className="console-grid" />

      <header className="console-topbar">
        <Link href="/" className="back-link">
          <span>←</span> ATLAS
        </Link>
        <div className="console-id">WORLD {String(index + 1).padStart(2, "0")} / 08</div>
        <div className="utc-clock">UTC {clock}</div>
      </header>

      <section className="console-main">
        <div className="console-copy">
          <p className="eyebrow">{planet.kicker}</p>
          <h1>{planet.name}</h1>
          <p className="console-descriptor">{planet.descriptor}</p>
          <p className="console-description">{planet.description}</p>
          <button className={`sequence-button ${isRunning ? "is-running" : ""}`} onClick={() => setIsRunning((running) => !running)}>
            <span className="sequence-dot" />
            {isRunning ? "SEQUENCE IN PROGRESS" : `INITIATE ${planet.function.toUpperCase()}`}
            <b>↗</b>
          </button>
          <p className="sequence-status">
            {isRunning ? "DATA STREAM UNLOCKED — SELECT A REFERENCE BELOW." : "INTERFACE STANDBY — ALL SYSTEMS NOMINAL."}
          </p>
        </div>

        <div className="planet-visual-wrap" aria-label={`Real NASA imagery of ${planet.name}`}>
          <div className="reticle reticle-one" />
          <div className="reticle reticle-two" />
          <div className="orbit-sweep" />
          <div className={`hero-planet hero-${planet.id} ${isRunning ? "is-unlocked" : ""}`}>
            <img src={planet.image} alt={`${planet.name} from NASA imagery`} />
          </div>
          <div className="planet-caption caption-left">
            <span>01 / DISTANCE</span>
            <strong>{planet.distance}</strong>
          </div>
          <div className="planet-caption caption-right">
            <span>02 / PERIOD</span>
            <strong>{planet.period}</strong>
          </div>
          <div className="planet-scanline" />
        </div>
      </section>

      <section className="instrument-deck">
        <article className="data-card data-card-primary">
          <p>{planet.primaryLabel}</p>
          <strong>{planet.primaryValue}</strong>
          <span>LIVE REFERENCE</span>
          <div className="micro-bars" aria-hidden="true">
            {[42, 68, 36, 78, 58, 88, 51, 71, 46, 83, 61, 92].map((height, itemIndex) => (
              <i key={itemIndex} style={{ height: `${height}%` }} />
            ))}
          </div>
        </article>

        <article className="data-card control-card">
          <div className="card-label-row">
            <p>{planet.rangeLabel}</p>
            <span>{range.toString().padStart(3, "0")}°</span>
          </div>
          <input
            aria-label={planet.rangeLabel}
            type="range"
            min="0"
            max="100"
            value={range}
            onChange={(event) => setRange(Number(event.target.value))}
            style={{ "--progress": `${range}%` } as React.CSSProperties}
          />
          <div className="range-scale">
            <span>MIN</span><span>CALIBRATED</span><span>MAX</span>
          </div>
          <div className="orbit-readout">
            <i /> OBSERVATION VECTOR LOCKED
          </div>
        </article>

        <article className="data-card telemetry-card">
          <p>PLANETARY CONSTANTS</p>
          <dl>
            <div><dt>ROTATION</dt><dd>{planet.rotation}</dd></div>
            <div><dt>AVG TEMP.</dt><dd>{planet.temperature}</dd></div>
            <div><dt>STAR DIST.</dt><dd>{planet.distance}</dd></div>
          </dl>
        </article>
      </section>

      <section className="reference-strip" aria-label="Select a reference target">
        <div className="reference-head">
          <span>REFERENCE TARGETS</span>
          <small>{isRunning ? "STREAM ACTIVE" : "STANDBY MODE"}</small>
        </div>
        <div className="reference-items">
          {planet.timeline.map((item, itemIndex) => (
            <button
              key={item.code}
              className={`reference-item ${selected === itemIndex ? "is-selected" : ""}`}
              onClick={() => setSelected(itemIndex)}
            >
              <span>{item.code}</span>
              <strong>{item.label}</strong>
              <em>{selected === itemIndex ? "IN VIEW" : item.detail}</em>
              <b>{selected === itemIndex ? "●" : "↗"}</b>
            </button>
          ))}
        </div>
      </section>

      <footer className="console-footer">
        <span>ORBITAL ATLAS — EXPLORATION INTERFACE</span>
        <a href="https://svs.gsfc.nasa.gov/30710/" target="_blank" rel="noreferrer">IMAGE DATA: NASA SVS 30710 ↗</a>
      </footer>
    </main>
  );
}
