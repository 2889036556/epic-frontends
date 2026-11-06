"use client";

import { ModelTelemetry } from "../types";

interface StreamingTerminalProps {
  streamedText: string;
  isGenerating: boolean;
  isPaused: boolean;
  telemetry: ModelTelemetry;
  promptValue: string;
  onPromptChange: (val: string) => void;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onOpenCitationDrawer: (id: number) => void;
  modelEngineName?: string;
}

export function StreamingTerminal({
  streamedText,
  isGenerating,
  isPaused,
  telemetry,
  promptValue,
  onPromptChange,
  onStart,
  onPause,
  onStop,
  onOpenCitationDrawer,
  modelEngineName = "NOVA-PRO ENGINE",
}: StreamingTerminalProps) {
  return (
    <div className="nova-stream-panel">
      {/* Stream Header & Telemetry */}
      <div className="nova-stream-header">
        <div className="nova-stream-status">
          <span className={`status-light ${isGenerating ? (isPaused ? "is-paused" : "is-active") : ""}`} />
          <strong>
            {isGenerating
              ? isPaused
                ? "生成已暂停 (PAUSED)"
                : "模型流式响应中 (STREAMING...)"
              : "准备就绪 (READY)"}
          </strong>
        </div>
        <div className="nova-stream-telemetry">
          <span>
            耗时: <b>{telemetry.elapsed}s</b>
          </span>
          <span>
            Token: <b>{telemetry.tokens}</b>
          </span>
          <span>
            首字时延: <b>{telemetry.ttft}</b>
          </span>
          <span>
            瞬时速率: <b>{isGenerating && !isPaused ? telemetry.tps : "0.0 tok/s"}</b>
          </span>
        </div>
      </div>

      {/* Prompt Command Bar */}
      <div className="nova-prompt-bar">
        <div className="nova-prompt-input-group">
          <label htmlFor="stream-prompt-input">输入或选择提示词：</label>
          <input
            id="stream-prompt-input"
            type="text"
            value={promptValue}
            onChange={(e) => onPromptChange(e.target.value)}
            placeholder="输入你的业务提示词或选择场景..."
          />
        </div>
        <div className="nova-prompt-actions">
          {!isGenerating ? (
            <button type="button" className="nova-btn-primary" onClick={onStart}>
              ▶ 开始流式生成
            </button>
          ) : (
            <>
              <button type="button" className="nova-btn-secondary" onClick={onPause}>
                {isPaused ? "▶ 继续" : "⏸ 暂停"}
              </button>
              <button type="button" className="nova-btn-danger" onClick={onStop}>
                ⏹ 终止
              </button>
            </>
          )}
        </div>
      </div>

      {/* Streamed Output Display with Citation Linking */}
      <div className="nova-output-box">
        <div className="nova-output-head">
          <span>MODEL OUTPUT / STREAMING PARSER</span>
          <b>{modelEngineName}</b>
        </div>
        <div className="nova-output-content">
          <p className="stream-text">
            {streamedText}
            {isGenerating && !isPaused && <span className="stream-cursor">▌</span>}
          </p>
        </div>
        <div className="nova-output-foot">
          <span>💡 提示：流式文本带有可点击的引用角标 [1]、[2]、[3]，可在第二标签页查看详细切片溯源。</span>
          <button
            type="button"
            className="nova-btn-text"
            onClick={() => onOpenCitationDrawer(1)}
          >
            查看溯源抽屉 ↗
          </button>
        </div>
      </div>
    </div>
  );
}
