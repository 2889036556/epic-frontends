"use client";

import { useState } from "react";
import { AgentStepItem, InterventionAction } from "../types";

interface HumanApprovalGateProps {
  step: AgentStepItem;
  onIntervene: (action: InterventionAction, overriddenParams?: Record<string, string | number | boolean>) => void;
}

export function HumanApprovalGate({ step, onIntervene }: HumanApprovalGateProps) {
  const payload = step.toolCallPayload;
  const initialParams = payload?.parameters || {};

  const [editMode, setEditMode] = useState(false);
  const [params, setParams] = useState<Record<string, string | number | boolean>>(initialParams);

  const handleParamChange = (key: string, val: string) => {
    // Attempt parsing number or boolean, otherwise string
    let parsed: string | number | boolean = val;
    if (val === "true") parsed = true;
    else if (val === "false") parsed = false;
    else if (!isNaN(Number(val)) && val.trim() !== "") parsed = Number(val);

    setParams((prev) => ({
      ...prev,
      [key]: parsed,
    }));
  };

  return (
    <div className="nova-approval-gate-card">
      <div className="gate-header">
        <div className="gate-badge">
          <span className="gate-pulse-dot" />
          <strong>🚨 智能体触发硬性拦截：待人类操作员审批 (GATE-04)</strong>
        </div>
        <span className="gate-risk-tag">{payload?.riskLevel || "CRITICAL"} RISK</span>
      </div>

      <div className="gate-body">
        <p className="gate-desc">
          智能体 <strong>{step.agentRole}</strong> 拟执行具备强破坏性的底层基础设施写操作：
        </p>

        <div className="gate-tool-spec">
          <div className="tool-row">
            <span>调用工具：</span>
            <code>{payload?.toolName || "isolate_cluster_node"}</code>
          </div>
          <div className="tool-row">
            <span>目标服务：</span>
            <b>{payload?.targetService || "prod-pipeline-ingest-03"}</b>
          </div>
          <div className="tool-row">
            <span>潜在副作用：</span>
            <em>{payload?.sideEffects || "将阻断数据管道的所有新数据写入，触发自动重路由。"}</em>
          </div>
        </div>

        {/* 3-Level Intervention Area */}
        <div className="gate-params-container">
          <div className="params-header">
            <span>拟执行参数 (PARAMETERS)</span>
            <button
              type="button"
              className="toggle-edit-btn"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? "✕ 锁定参数" : "✎ 篡改/覆盖参数 (Override)"}
            </button>
          </div>

          <div className="params-fields">
            {Object.entries(params).map(([key, value]) => (
              <div key={key} className="param-field-item">
                <label htmlFor={`param-${key}`}>{key}:</label>
                {editMode ? (
                  <input
                    id={`param-${key}`}
                    type="text"
                    value={String(value)}
                    onChange={(e) => handleParamChange(key, e.target.value)}
                    className="param-input-editable"
                  />
                ) : (
                  <code className="param-value-locked">{JSON.stringify(value)}</code>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons: Level 1 Approve / Reject, Level 2 Override, Level 3 Step-Back */}
      <div className="gate-actions">
        <button
          type="button"
          className="nova-btn-primary"
          onClick={() => {
            if (editMode) {
              onIntervene("override_and_approve", params);
            } else {
              onIntervene("approve");
            }
          }}
        >
          {editMode ? "✓ 保存篡改并授权执行" : "✓ 立即授权并执行 (Approve)"}
        </button>

        <button
          type="button"
          className="nova-btn-danger"
          onClick={() => onIntervene("reject")}
        >
          ✕ 拒绝阻断 (Reject)
        </button>

        <button
          type="button"
          className="nova-btn-secondary"
          onClick={() => onIntervene("step_back")}
          title="回滚到上一步重新分析"
        >
          ↺ 单步回滚 (Step-Back)
        </button>
      </div>
    </div>
  );
}
