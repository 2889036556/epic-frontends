"use client";

import { CitationItem } from "../types";

interface CitationInspectorProps {
  citations: CitationItem[];
  selectedCitationId: number | null;
  onSelectCitation: (id: number | null) => void;
  onViewSourceFullText?: (item: CitationItem) => void;
}

export function CitationInspector({
  citations,
  selectedCitationId,
  onSelectCitation,
  onViewSourceFullText,
}: CitationInspectorProps) {
  const activeCitation = citations.find((c) => c.id === selectedCitationId) || null;

  return (
    <div className="nova-citation-panel">
      {/* Left Column: Synthetic Text with Evidence Badges */}
      <div className="nova-citation-left">
        <div className="nova-card-title">
          <span>GENERATED SYNTHESIS</span>
          <strong>带有证据锚点的知识生成段落</strong>
        </div>

        <div className="nova-text-with-citations">
          <p>
            已完成多维知识库比对与段落锚定：
            <br />
            <br />
            1. <strong>状态层解耦机制</strong>
            <button
              type="button"
              className={`nova-cite-badge ${selectedCitationId === 1 ? "is-active" : ""}`}
              onClick={() => onSelectCitation(1)}
            >
              [01 架构白皮书 §4.2]
            </button>
            ：采用基于轻量级 Event-Bus 的状态机，显著降低 Token 上下文冗余与渲染抖动；
            <br />
            <br />
            2. <strong>流式网络传输协议</strong>
            <button
              type="button"
              className={`nova-cite-badge ${selectedCitationId === 2 ? "is-active" : ""}`}
              onClick={() => onSelectCitation(2)}
            >
              [02 传输基准 2026]
            </button>
            ：优先采用 Server-Sent Events (SSE) 配合结构化 JSON-RPC Chunk 分发；
            <br />
            <br />
            3. <strong>人机协同安全边界</strong>
            <button
              type="button"
              className={`nova-cite-badge ${selectedCitationId === 3 ? "is-active" : ""}`}
              onClick={() => onSelectCitation(3)}
            >
              [03 安全准则 §8.1]
            </button>
            ：对具备写操作副作用的敏感 Tool Call，设定硬性人类在回路审批拦截点。
          </p>
        </div>

        <p className="nova-hint">🖱️ 点击上方任意引用徽章，右侧即时展开原始语料切片与向量得分。</p>
      </div>

      {/* Right Column: Evidence Source Drawer */}
      <div className="nova-citation-drawer">
        <div className="nova-drawer-header">
          <span>EVIDENCE SOURCE DRAWER</span>
          <b>{selectedCitationId ? `REF #[0${selectedCitationId}]` : "点击引用查看"}</b>
        </div>

        {activeCitation ? (
          <div className="nova-drawer-content">
            <div className="nova-cite-score-card">
              <div>
                <span>余弦相似度 / Cosine</span>
                <strong>{activeCitation.score}</strong>
              </div>
              <div>
                <span>幻觉风险评估</span>
                <strong
                  style={{
                    color:
                      activeCitation.confidenceTier === "medium"
                        ? "var(--nova-coral)"
                        : activeCitation.confidenceTier === "low"
                        ? "#ff4444"
                        : "var(--nova-lime)",
                  }}
                >
                  {activeCitation.confidenceTier === "medium"
                    ? "中等 (MEDIUM)"
                    : activeCitation.confidenceTier === "low"
                    ? "偏高 (HIGH)"
                    : "极低 (LOW)"}
                </strong>
              </div>
              <div>
                <span>匹配耗时</span>
                <strong>{activeCitation.latencyMs ?? "16.4"}ms</strong>
              </div>
            </div>

            <div className="nova-source-meta">
              <span>来源知识库文档</span>
              <strong>📄 {activeCitation.source}</strong>
            </div>

            <div className="nova-source-snippet">
              <span>原始检索切片 (Raw Chunk)：</span>
              <blockquote>“{activeCitation.snippet}”</blockquote>
            </div>

            <div className="nova-source-actions">
              <button
                type="button"
                className="nova-btn-primary-small"
                onClick={() => onViewSourceFullText?.(activeCitation)}
              >
                查看文档全文 ↗
              </button>
              <button
                type="button"
                className="nova-btn-secondary-small"
                onClick={() => onSelectCitation(null)}
              >
                关闭抽屉
              </button>
            </div>
          </div>
        ) : (
          <div className="nova-drawer-empty">
            <p>👈 请在左侧点击任意 [01]、[02] 或 [03] 引用徽章，查看底层向量检索与置信度溯源证据。</p>
          </div>
        )}
      </div>
    </div>
  );
}
