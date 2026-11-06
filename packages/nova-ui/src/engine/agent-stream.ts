import { AgentStepItem, SwarmNode3D } from "../types";

export const initialAIOpsNodes: SwarmNode3D[] = [
  {
    id: "planner",
    label: "AIOps-Planner",
    role: "意图拆解与编排核心",
    pos: [-2.2, 1.2, 0],
    color: "#598cff", // nova blue
    status: "idle",
    memorySize: "128 MB",
  },
  {
    id: "monitor",
    label: "Metrics-Monitor",
    role: "APM 告警与时序诊断",
    pos: [-0.9, -1.4, 0.4],
    color: "#ffa748", // amber
    status: "idle",
    memorySize: "512 MB",
  },
  {
    id: "rag",
    label: "RAG-Investigator",
    role: "知识切片与拓扑检索",
    pos: [1.1, -1.3, -0.3],
    color: "#b5dc59", // lime
    status: "idle",
    memorySize: "2.4 GB",
  },
  {
    id: "fixer",
    label: "Fix-Engineer",
    role: "自愈脚本生成与写操作",
    pos: [2.3, 1.1, 0.2],
    color: "#ff6b46", // coral
    status: "idle",
    memorySize: "256 MB",
  },
  {
    id: "auditor",
    label: "Sec-Auditor",
    role: "全链路留痕与状态巡检",
    pos: [0, 2.2, -0.2],
    color: "#9a82ff", // violet
    status: "idle",
    memorySize: "64 MB",
  },
];

export const initialAIOpsSteps: AgentStepItem[] = [
  {
    id: "step-1",
    stepNum: "01",
    agentRole: "Planner Agent",
    title: "告警聚合与有向无环图 (DAG) 拆解",
    description: "收到 P1 级导入管道积压告警，自动生成隔离排查与下游通知 DAG 节点拓扑",
    status: "idle",
    durationMs: 42,
  },
  {
    id: "step-2",
    stepNum: "02",
    agentRole: "Monitor Agent",
    title: "时序指标异动定位与根因归因",
    description: "检测到数据管道 #3 节点内存占用突增至 94.2%，伴随异常空值率上升 43.8%",
    status: "idle",
    durationMs: 118,
  },
  {
    id: "step-3",
    stepNum: "03",
    agentRole: "RAG Investigator",
    title: "应急运维拓扑与排障切片召回",
    description: "匹配知识库中《生产环境数据流阻断与熔断治理规程 §4.2》，召回余弦相似度 97.4% 最佳实践",
    status: "idle",
    durationMs: 85,
  },
  {
    id: "step-4",
    stepNum: "04",
    agentRole: "Fix Engineer",
    title: "下发隔离指令：人工审批拦截点",
    description: "拟调用写操作工具隔离故障节点，触发最高级防护拦截，等待人类操作员确认",
    status: "idle",
    isApprovalGate: true,
    toolCallPayload: {
      toolName: "isolate_cluster_node",
      targetService: "prod-pipeline-ingest-03",
      parameters: {
        node_id: "data_pipe_03",
        grace_period_sec: 15,
        drain_existing_traffic: true,
        notify_downstream_sla: true,
      },
      riskLevel: "CRITICAL",
      sideEffects: "将阻断数据管道 03 的所有新数据写入，可能导致下游产生秒级延迟并触发自动重路由",
    },
  },
  {
    id: "step-5",
    stepNum: "05",
    agentRole: "Auditor Agent",
    title: "自愈校验与责任留痕交付",
    description: "确认故障节点下线、备用通道接管成功，签名生成合规审计日志写入数据库",
    status: "idle",
    durationMs: 64,
  },
];
