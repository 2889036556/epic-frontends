"use client";

import { AgentStepItem, AgentStepStatus } from "../types";

interface AgentPipeline2DProps {
  steps: AgentStepItem[];
  currentStepIndex: number;
  overallStatus: AgentStepStatus;
  onSelectStep?: (index: number) => void;
}

export function AgentPipeline2D({ steps, currentStepIndex, overallStatus, onSelectStep }: AgentPipeline2DProps) {
  return (
    <div className="nova-pipeline-track" role="list">
      {steps.map((step, idx) => {
        const stepNum = idx + 1;
        const isDone = currentStepIndex > stepNum || overallStatus === "completed";
        const isCurrent = currentStepIndex === stepNum && overallStatus !== "idle" && overallStatus !== "completed";
        const isAlert = step.isApprovalGate && isCurrent && overallStatus === "gate_approval";

        return (
          <div
            key={step.id}
            role="button"
            tabIndex={0}
            className={`nova-step-item ${isDone ? "is-done" : ""} ${isCurrent ? "is-current" : ""} ${
              step.isApprovalGate ? "is-gate" : ""
            } ${isAlert ? "is-alert" : ""}`}
            onClick={() => onSelectStep?.(stepNum)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectStep?.(stepNum);
              }
            }}
          >
            <div className="step-num">{step.stepNum}</div>

            <div className="step-content">
              <div className="step-role-badge">
                <span>{step.agentRole}</span>
                {step.isApprovalGate && <span className="gate-tag">HUMAN GATE</span>}
              </div>
              <strong style={{ color: isAlert ? "var(--nova-coral)" : undefined }}>
                {step.title}
              </strong>
              <span>{step.description}</span>
            </div>

            <div className="step-status">
              {isDone && (
                <span className="status-done">
                  ✓ 完成 {step.durationMs ? `(${step.durationMs}ms)` : ""}
                </span>
              )}
              {isAlert && <span className="status-gate">🚨 待人工审批</span>}
              {isCurrent && !isAlert && <span className="status-running">⏳ 协同执行中...</span>}
              {!isDone && !isCurrent && <span className="status-waiting">等待中</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
