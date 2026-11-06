"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Planet } from "../space-data";

export function WorldInstrument({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const props = { planet, isRunning };
  switch (planet.id) {
    case "mercury": return <MissionArchive {...props} />;
    case "venus": return <AtmosphereProbe {...props} />;
    case "earth": return <LivingSystems {...props} />;
    case "mars": return <RoverPlanner {...props} />;
    case "jupiter": return <SignalScanner {...props} />;
    case "saturn": return <RingStudio {...props} />;
    case "uranus": return <SeasonVault {...props} />;
    case "neptune": return <CoursePlotter {...props} />;
    default: return null;
  }
}

function ToolFrame({ planet, eyebrow, isRunning, children }: { planet: Planet; eyebrow: string; isRunning: boolean; children: ReactNode }) {
  return <section className="world-tool" data-running={isRunning} style={{ "--tool-accent": planet.accent } as CSSProperties}>
    <div className="tool-heading"><span>{eyebrow}</span><i>本地实时模拟</i></div>
    {children}
    {!isRunning && <div className="instrument-gate">仪器待机 <b>启动上方仪器以解锁</b></div>}
  </section>;
}

function MissionArchive({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [filter, setFilter] = useState("全部");
  const records = [
    ["飞掠", "水手 10 号 · 1974", "30% 地形中继"],
    ["环绕", "信使号 · 2011", "轨道地图合成"],
    ["热力", "贝皮科伦坡 · 2025", "晨昏线采样"],
  ].filter(([type]) => filter === "全部" || type === filter);
  return <ToolFrame planet={planet} eyebrow="任务档案" isRunning={isRunning}>
    <div className="archive-tool"><div className="tool-tabs">{["全部", "飞掠", "环绕", "热力"].map((type) => <button key={type} onClick={() => setFilter(type)} className={filter === type ? "is-active" : ""}>{type}</button>)}</div>
      <div className="archive-records">{records.map(([type, name, detail]) => <button key={name} className="archive-row"><span>{type}</span><strong>{name}</strong><em>{detail}</em><b>打开 ↗</b></button>)}</div>
    </div>
  </ToolFrame>;
}

function AtmosphereProbe({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [altitude, setAltitude] = useState(58);
  const temperature = Math.round(464 - altitude * 4.1);
  const pressure = Math.max(0.1, 92 - altitude * 1.42).toFixed(1);
  return <ToolFrame planet={planet} eyebrow="大气探针" isRunning={isRunning}>
    <div className="atmos-tool"><div className="atmos-scale"><span style={{ height: `${altitude}%` }} /><i>0 千米</i><i>50 千米</i><i>90 千米</i></div>
      <div className="atmos-readout"><div><span>高度</span><strong>{altitude} 千米</strong></div><div><span>温度</span><strong>{temperature}°C</strong></div><div><span>压力</span><strong>{pressure} bar</strong></div><input aria-label="金星大气高度" type="range" min="5" max="88" value={altitude} onChange={(event) => setAltitude(Number(event.target.value))} /></div>
      <p>移动探针穿过云层，高度改变后会实时更新当前采样读数。</p></div>
  </ToolFrame>;
}

function LivingSystems({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [region, setRegion] = useState("太平洋");
  const [utc, setUtc] = useState("--:--:--");
  useEffect(() => { const update = () => setUtc(new Date().toUTCString().slice(17, 25)); update(); const timer = window.setInterval(update, 1000); return () => window.clearInterval(timer); }, []);
  const regions: Record<string, string> = { 太平洋: "88% 少云", 大西洋: "两个风暴单体", 印度洋: "日出边界" };
  return <ToolFrame planet={planet} eyebrow="生命系统观测" isRunning={isRunning}>
    <div className="earth-tool"><div className="earth-clock"><span>地球观测 UTC</span><strong>{utc}</strong><i>◐ 日照终结线实时</i></div>
      <div className="region-picker">{Object.keys(regions).map((entry) => <button onClick={() => setRegion(entry)} key={entry} className={entry === region ? "is-active" : ""}>{entry}</button>)}</div>
      <div className="region-readout"><span>区域锁定 / {region}</span><strong>{regions[region]}</strong><div><i /><i /><i /><i /><i /><i /><i /><i /></div></div></div>
  </ToolFrame>;
}

function RoverPlanner({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [waypoints, setWaypoints] = useState<number[]>([8]);
  const toggle = (id: number) => setWaypoints((points) => points.includes(id) ? points.filter((point) => point !== id) : [...points, id].slice(-4));
  return <ToolFrame planet={planet} eyebrow="探测车路径规划" isRunning={isRunning}>
    <div className="rover-tool"><div className="terrain-grid">{Array.from({ length: 24 }, (_, id) => <button key={id} onClick={() => toggle(id)} className={waypoints.includes(id) ? "is-selected" : ""}><span>{String(id + 1).padStart(2, "0")}</span></button>)}</div>
      <div className="rover-summary"><span>已规划路径点</span><strong>{waypoints.length ? waypoints.map((point) => `JZ-${String(point + 1).padStart(2, "0")}`).join(" · ") : "没有目标"}</strong><p>{waypoints.length * 83} 米预计行驶 · {Math.max(1, waypoints.length)} 个火星日</p></div></div>
  </ToolFrame>;
}

function SignalScanner({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [isScanning, setIsScanning] = useState(isRunning);
  const [tick, setTick] = useState(0);
  useEffect(() => { if (!isScanning) return; const timer = window.setInterval(() => setTick((value) => value + 1), 180); return () => window.clearInterval(timer); }, [isScanning]);
  const bars = useMemo(() => Array.from({ length: 42 }, (_, index) => 14 + ((Math.sin(index * 1.8 + tick) + 1) * 30) + ((index * 17 + tick * 7) % 38)), [tick]);
  return <ToolFrame planet={planet} eyebrow="无线电信号扫描" isRunning={isRunning}>
    <div className="signal-tool"><div className="signal-bars">{bars.map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="signal-controls"><div><span>频率</span><strong>{(21.4 + tick * 0.03).toFixed(2)} MHz</strong></div><button onClick={() => setIsScanning((active) => !active)} className={isScanning ? "is-active" : ""}>{isScanning ? "暂停扫描" : "开始扫描"}</button><p>{isScanning ? "木卫一等离子环 / 已捕获信号" : "扫描器待机"}</p></div></div>
  </ToolFrame>;
}

function RingStudio({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [ring, setRing] = useState("A 环");
  const [focus, setFocus] = useState(54);
  const facts: Record<string, string> = { "A 环": "高密度冰粒子场", "卡西尼缝": "4,800 千米间隔", "恩克缝": "小卫星尾迹活动" };
  return <ToolFrame planet={planet} eyebrow="光环光谱仪" isRunning={isRunning}>
    <div className="ring-tool"><div className="ring-visual" style={{ "--ring-focus": `${focus}%` } as CSSProperties}><i /><i /><i /><i /></div><div className="ring-panel"><div className="tool-tabs">{Object.keys(facts).map((entry) => <button key={entry} className={entry === ring ? "is-active" : ""} onClick={() => setRing(entry)}>{entry}</button>)}</div><strong>{facts[ring]}</strong><input aria-label="光环径向焦点" type="range" min="10" max="90" value={focus} onChange={(event) => setFocus(Number(event.target.value))} /><span>径向焦点 {focus}%</span></div></div>
  </ToolFrame>;
}

function SeasonVault({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [tilt, setTilt] = useState(98);
  return <ToolFrame planet={planet} eyebrow="季节轴向档案" isRunning={isRunning}>
    <div className="uranus-tool"><div className="axis-planet"><div style={{ transform: `rotate(${tilt}deg)` }} /><i /></div><div className="axis-panel"><span>轴向姿态</span><strong>{tilt}°</strong><input aria-label="天王星轴向倾角" type="range" min="0" max="180" value={tilt} onChange={(event) => setTilt(Number(event.target.value))} /><p>{tilt > 80 && tilt < 112 ? "极区夏季 / 长阴影" : "赤道过渡 / 档案变化"}</p></div></div>
  </ToolFrame>;
}

function CoursePlotter({ planet, isRunning }: { planet: Planet; isRunning: boolean }) {
  const [burn, setBurn] = useState(64);
  const [target, setTarget] = useState("海卫一");
  const eta = Math.round(294 - burn * 1.37);
  return <ToolFrame planet={planet} eyebrow="外层航线绘制" isRunning={isRunning}>
    <div className="course-tool"><div className="course-field"><i /><i /><i /><b className={target === "海卫一" ? "is-target" : ""}>海卫一</b><b className={target === "暗斑" ? "is-target" : ""}>暗斑</b></div><div className="course-panel"><div className="tool-tabs">{["海卫一", "暗斑"].map((entry) => <button key={entry} className={target === entry ? "is-active" : ""} onClick={() => setTarget(entry)}>{entry}</button>)}</div><span>转移推进</span><input aria-label="航线转移推进" type="range" min="20" max="100" value={burn} onChange={(event) => setBurn(Number(event.target.value))} /><strong>{eta} 天</strong><p>预计抵达 / {target}</p></div></div>
  </ToolFrame>;
}
