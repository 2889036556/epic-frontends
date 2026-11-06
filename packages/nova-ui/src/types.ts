export type ScenarioType = "生成" | "洞察" | "检索" | "自动化";

export interface CitationItem {
  id: number;
  title: string;
  score: string;
  source: string;
  snippet: string;
  confidenceTier?: "high" | "medium" | "low";
  latencyMs?: number;
}

export interface ModelTelemetry {
  tps: string;
  ttft: string;
  cost: string;
  tokens: number;
  elapsed: number;
}

export type AgentStepStatus = "idle" | "pending" | "running" | "gate_approval" | "completed" | "failed" | "rolled_back";

export interface AgentStepItem {
  id: string;
  stepNum: string;
  agentRole: string;
  title: string;
  description: string;
  status: AgentStepStatus;
  durationMs?: number;
  isApprovalGate?: boolean;
  toolCallPayload?: {
    toolName: string;
    targetService: string;
    parameters: Record<string, string | number | boolean>;
    riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
    sideEffects: string;
  };
}

export type InterventionAction = "approve" | "reject" | "override_and_approve" | "step_back";

export interface SwarmNode3D {
  id: string;
  label: string;
  role: string;
  pos: [number, number, number];
  color: string;
  status: AgentStepStatus;
  memorySize: string;
}

export interface SwarmPacket3D {
  from: string;
  to: string;
  progress: number;
  color: string;
}
