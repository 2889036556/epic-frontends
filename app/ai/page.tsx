"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AgentPipeline2D,
  AgentSwarm3D,
  HumanApprovalGate,
  StreamingTerminal,
  CitationInspector,
  initialAIOpsSteps,
  AgentStepItem,
  AgentStepStatus,
  InterventionAction,
} from "@nova-ui/core";
import { SoundEngine } from "../utils/audio";

type Scenario = "生成" | "洞察" | "检索" | "自动化";

const scenarios: Record<
  Scenario,
  {
    index: string;
    title: string;
    summary: string;
    signal: string;
    modules: string[];
    output: string;
    tone: string;
    samplePrompt: string;
    metrics: { tps: string; ttft: string; cost: string };
  }
> = {
  生成: {
    index: "01",
    title: "把能力表达成内容",
    summary: "为创作型产品预留叙事、版本、引用与结果呈现，让输出拥有清晰的层次与结构感。",
    signal: "Creative surface",
    modules: ["叙事首屏", "生成结果", "版本轨迹"],
    output: "从一个想法，到逻辑严密且可落地的方案架构。",
    tone: "coral",
    samplePrompt: "为企业级分布式多智能体（Multi-Agent）系统设计一套前端异步协同架构规范",
    metrics: { tps: "52.4 tok/s", ttft: "180ms", cost: "$0.0018" },
  },
  洞察: {
    index: "02",
    title: "让数据自己讲重点",
    summary: "把高维复杂数据压缩为核心结论、波动趋势与风险归因，适合数据分析与决策系统。",
    signal: "Signal surface",
    modules: ["关键指标", "洞察卡片", "证据来源"],
    output: "趋势不只是冷冰冰的数字，它应该给出确定性的归因与行动建议。",
    tone: "blue",
    samplePrompt: "分析近 30 天 LLM API 调用延迟波动与 Token 成本超标的根因，输出治理策略",
    metrics: { tps: "44.1 tok/s", ttft: "240ms", cost: "$0.0024" },
  },
  检索: {
    index: "03",
    title: "把答案连回来源",
    summary: "让知识库切片、跨模态引用关系与段落置信度同时透明可见，极大降低模型幻觉判断成本。",
    signal: "Knowledge surface",
    modules: ["答案摘要", "引用节点", "可信标记"],
    output: "每一个结论，都能一键溯源到对应的原文段落与置信度打分。",
    tone: "lime",
    samplePrompt: "检索知识库中关于本地模型微调（LoRA）内存优化策略与注意力机制剪枝的段落",
    metrics: { tps: "61.8 tok/s", ttft: "120ms", cost: "$0.0009" },
  },
  自动化: {
    index: "04",
    title: "给流程一张可读的脸",
    summary: "把触发条件、分支判断、工具调用与人工接管梳理成可观测的执行管道，给复杂 Agent 一张透明的脸。",
    signal: "Agent surface",
    modules: ["流程轨道", "动作状态", "人工接管"],
    output: "让自动化全速运行，同时在关键节点为人类保留确定性的控制权。",
    tone: "violet",
    samplePrompt: "构建数据管道自动化巡检 Agent，检测异常并调用写入工具执行隔离回滚",
    metrics: { tps: "38.6 tok/s", ttft: "310ms", cost: "$0.0031" },
  },
};

const moduleCards = [
  {
    number: "01",
    type: "Hero",
    title: "叙事首屏",
    text: "用一句最重要的话建立产品价值重心，消除 AI 黑盒感。",
    visual: "hero",
    targetMode: "stream",
  },
  {
    number: "02",
    type: "Result",
    title: "结果呈现",
    text: "将模型原始 Markdown 输出转化为可扫读、带层次的卡片。",
    visual: "result",
    targetMode: "stream",
  },
  {
    number: "03",
    type: "Signal",
    title: "可信反馈",
    text: "展示段落溯源、余弦相似度与置信度拆解，打破幻觉盲区。",
    visual: "signal",
    targetMode: "citation",
  },
  {
    number: "04",
    type: "Model",
    title: "模型路由",
    text: "平衡速度、质量与每千 Token 成本，提供透明权衡矩阵。",
    visual: "model",
    targetMode: "router",
  },
  {
    number: "05",
    type: "Memory",
    title: "知识记忆",
    text: "组织上下文切片与向量关联图谱，建立产品专属记忆库。",
    visual: "memory",
    targetMode: "citation",
  },
  {
    number: "06",
    type: "Flow",
    title: "流程结构",
    text: "可视化 Agent 执行流（Planner → RAG → Tool），支持人工拦截。",
    visual: "flow",
    targetMode: "agent",
  },
];

const sampleGenerations: Record<
  Scenario,
  {
    text: string;
    citations: Array<{ id: number; title: string; score: string; source: string; snippet: string }>;
  }
> = {
  生成: {
    text: "经过多智能体系统协同分析，已为你规划【企业级多 Agent 异步交互架构】：\n\n1. 状态层解耦 [1]：采用基于轻量级 Event-Bus 的状态机，避免全局 Context 膨胀导致的 Token 溢出与渲染重绘卡顿；\n2. 流式协议选型 [2]：优先采用 Server-Sent Events (SSE) 配合结构化 JSON-RPC Chunk，保证低端移动端 60fps 帧率；\n3. 人工在回路（Human-in-the-loop）[3]：对涉及数据库写操作的动作触发中断审批，确保系统安全性。",
    citations: [
      {
        id: 1,
        title: "分布式多智能体架构白皮书 §4.2",
        score: "96.4%",
        source: "Architecture_V3_Specs.pdf",
        snippet: "解耦状态层可将长会话的 Token 上下文冗余度降低 42%，同时避免全量重绘导致的 UI 线程阻塞。",
      },
      {
        id: 2,
        title: "大模型前端流式传输性能基准",
        score: "94.1%",
        source: "Web_Streaming_Benchmarks_2026.md",
        snippet: "SSE 相较于双向 WebSocket 在单向打字机场景下减少了 18% 的握手开销与断线重连复杂度。",
      },
      {
        id: 3,
        title: "AI 安全治理与人机协同准则",
        score: "91.8%",
        source: "Safety_Guardrail_Guidelines.pdf",
        snippet: "对于具备副作用（Side-effects）的 Tool Call，必须提供显式的前端确认模态与参数审计日志。",
      },
    ],
  },
  洞察: {
    text: "根据近 30 天 450,000+ 次模型调用数据归因分析：\n\n1. 延迟峰值原因 [1]：主要集中于晚高峰时段的旗舰模型排队，平均首字时延（TTFT）从 180ms 飙升至 1420ms；\n2. 成本超标项 [2]：未开启前缀缓存（Prompt Caching）导致系统提示词重复计费占总账单的 38.6%；\n3. 优化建议 [3]：对只读查询强制路由至轻量级模型，可立即削减 62% 的推理费用。",
    citations: [
      {
        id: 1,
        title: "API 网关实时监控指标报表",
        score: "98.2%",
        source: "Telemetry_Gateway_Logs.csv",
        snippet: "在 20:00-22:00 时段，GPU 集群并发饱和导致请求排队时间占总耗时 72%。",
      },
      {
        id: 2,
        title: "Token 消耗与成本审计报告",
        score: "95.5%",
        source: "Billing_Audit_Q2.xlsx",
        snippet: "重复 System Prompt 每日消耗约 1.2 亿 Token，开启 Prompt Caching 预计节省成本 3.8 万美元/月。",
      },
      {
        id: 3,
        title: "模型分流与动态降级策略",
        score: "92.7%",
        source: "Model_Routing_Optimization.pdf",
        snippet: "将 70% 的低复杂度问答分流至轻量模型，在保持整体满意度不变的前提下，综合延迟下降 45%。",
      },
    ],
  },
  检索: {
    text: "知识库向量索引匹配完成，检索到高相关度优化方案：\n\n1. 显存管理机制 [1]：采用 FlashAttention-3 与 4-bit 量化技术，单卡显存占用减少 55%；\n2. 剪枝与秩分配 [2]：动态调整 LoRA Rank（r=16/32），在低活跃层采用稀疏注意力剪枝；\n3. 吞吐提升 [3]：结合 Speculative Decoding（推测解码），文本生成整体吞吐量提升 2.1 倍。",
    citations: [
      {
        id: 1,
        title: "FlashAttention-3 显存优化技术实现",
        score: "97.8%",
        source: "Efficient_Inference_Research.pdf",
        snippet: "通过重构计算图与异步矩阵乘法，KV Cache 内存带宽瓶颈得到显著缓解。",
      },
      {
        id: 2,
        title: "LoRA 参数高效微调实验对比",
        score: "94.3%",
        source: "LoRA_Rank_Ablation.md",
        snippet: "动态 Rank 分配相比固定 Rank 能在减少 30% 训练参数的同时保持 99.2% 的下游任务精度。",
      },
      {
        id: 3,
        title: "推测解码加速方案评测",
        score: "89.6%",
        source: "Speculative_Draft_Benchmarks.pdf",
        snippet: "使用小型 Draft 模型提前预判候选 Token，主模型批量并行验证，可大幅降低生成延迟。",
      },
    ],
  },
  自动化: {
    text: "自动化巡检 Agent 已完成全链路诊断，生成拦截方案：\n\n1. 异常捕捉 [1]：检测到数据导入管道节点 #3 出现模式漂移与数据污染；\n2. 推理决策 [2]：判定该污染将影响下游 3 个预测服务，需立即执行隔离阻断；\n3. 等待审批 [3]：已生成隔离脚本 `isolate_node_03()`，当前处于【人工审批拦截点】，等待操作人员确认。",
    citations: [
      {
        id: 1,
        title: "数据质量异常监控告警",
        score: "99.1%",
        source: "DataOps_Alert_Event_8892.json",
        snippet: "字段 null 值比例突增至 43.8%，触发 P1 级数据质量拦截规则。",
      },
      {
        id: 2,
        title: "Agent 链路依赖图谱",
        score: "93.4%",
        source: "Pipeline_Dependency_Graph.svg",
        snippet: "节点 #3 直接向用户画像与推荐特征库供数，影响范围评估为高风险。",
      },
      {
        id: 3,
        title: "自动化运维干预安全规程",
        score: "96.0%",
        source: "Security_Ops_Manual.pdf",
        snippet: "所有阻断核心供水供电管道的写操作指令，必须有授权操作人员在 5 分钟内完成二次确认。",
      },
    ],
  },
};

const modelsData = [
  {
    id: "flagship",
    name: "NOVA-Pro (旗舰推理)",
    tag: "深度思考",
    speed: "35 tok/s",
    latency: "280ms",
    cost: "$0.0030 / 1K",
    accuracy: "98.8%",
    desc: "适合复杂逻辑推理、多步骤规划、代码架构生成与高精度决策。",
    color: "var(--nova-blue)",
  },
  {
    id: "fast",
    name: "NOVA-Flash (极速流)",
    tag: "极低延迟",
    speed: "88 tok/s",
    latency: "95ms",
    cost: "$0.0006 / 1K",
    accuracy: "93.2%",
    desc: "适合实时交互打字机、高频摘要、简单问答与流式聊天场景。",
    color: "var(--nova-coral)",
  },
  {
    id: "balanced",
    name: "NOVA-Lite (平衡型)",
    tag: "性价比优选",
    speed: "55 tok/s",
    latency: "160ms",
    cost: "$0.0012 / 1K",
    accuracy: "96.1%",
    desc: "在响应速度与逻辑严密性之间达到理想平衡，通用场景默认推荐。",
    color: "var(--nova-lime)",
  },
];

export default function AIInterfaceTemplate() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("生成");
  const [activePlaygroundTab, setActivePlaygroundTab] = useState<"stream" | "citation" | "agent" | "router">("stream");
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Streaming generator state
  const [promptInput, setPromptInput] = useState(scenarios["生成"].samplePrompt);
  const [streamedText, setStreamedText] = useState(sampleGenerations["生成"].text);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tokenCount, setTokenCount] = useState(sampleGenerations["生成"].text.length);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedCitation, setSelectedCitation] = useState<number | null>(null);

  // Model router state
  const [selectedModel, setSelectedModel] = useState("flagship");

  // Agent workflow state
  const [agentSteps, setAgentSteps] = useState<AgentStepItem[]>(initialAIOpsSteps);
  const [agentStep, setAgentStep] = useState<number>(0);
  const [agentStatus, setAgentStatus] = useState<AgentStepStatus>("idle");
  const [agentViewMode, setAgentViewMode] = useState<"2d" | "3d">("3d");
  const [apiConfigOpen, setApiConfigOpen] = useState(false);
  const [useRealApi, setUseRealApi] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState("http://localhost:11434");
  const [apiKey, setApiKey] = useState("");

  const active = scenarios[activeScenario];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const generationIndexRef = useRef(0);
  const fullTextRef = useRef("");

  const toggleSound = () => {
    const next = SoundEngine.toggle();
    setSoundEnabled(next);
  };

  const handleScenarioChange = (scenario: Scenario) => {
    SoundEngine.playPop(500);
    setActiveScenario(scenario);
    setPromptInput(scenarios[scenario].samplePrompt);
    setSelectedCitation(null);
    if (!isGenerating) {
      setStreamedText(sampleGenerations[scenario].text);
      setTokenCount(sampleGenerations[scenario].text.length);
    }
  };

  const startStreaming = (customText?: string) => {
    SoundEngine.playPop(650);
    if (timerRef.current) clearInterval(timerRef.current);
    const textToStream = customText || sampleGenerations[activeScenario].text;
    fullTextRef.current = textToStream;
    generationIndexRef.current = 0;
    setStreamedText("");
    setIsGenerating(true);
    setIsPaused(false);
    setTokenCount(0);
    setElapsedTime(0);
    setSelectedCitation(null);

    const startTime = Date.now();

    timerRef.current = setInterval(() => {
      if (generationIndexRef.current < fullTextRef.current.length) {
        generationIndexRef.current += 1;
        setStreamedText(fullTextRef.current.slice(0, generationIndexRef.current));
        setTokenCount(generationIndexRef.current);
        setElapsedTime(Math.floor((Date.now() - startTime) / 10) / 100);

        // Sound effect on key token pulses
        if (generationIndexRef.current % 4 === 0) {
          SoundEngine.playTick(1300);
        }
      } else {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsGenerating(false);
        SoundEngine.playChime();
      }
    }, 28);
  };

  const togglePause = () => {
    SoundEngine.playPop(480);
    if (isPaused) {
      setIsPaused(false);
      const remainingText = fullTextRef.current;
      timerRef.current = setInterval(() => {
        if (generationIndexRef.current < remainingText.length) {
          generationIndexRef.current += 1;
          setStreamedText(remainingText.slice(0, generationIndexRef.current));
          setTokenCount(generationIndexRef.current);
          if (generationIndexRef.current % 4 === 0) {
            SoundEngine.playTick(1300);
          }
        } else {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsGenerating(false);
          SoundEngine.playChime();
        }
      }, 28);
    } else {
      setIsPaused(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const stopStreaming = () => {
    SoundEngine.playPop(320);
    if (timerRef.current) clearInterval(timerRef.current);
    setIsGenerating(false);
    setIsPaused(false);
  };

  const runAgentPipeline = () => {
    SoundEngine.playPop(600);
    setAgentStatus("running");
    setAgentStep(1);

    setTimeout(() => {
      SoundEngine.playTick(900);
      setAgentStep(2);
      setTimeout(() => {
        SoundEngine.playTick(1100);
        setAgentStep(3);
        setTimeout(() => {
          SoundEngine.playAlarm(); // Trigger alarm for human intervention
          setAgentStep(4);
          setAgentStatus("gate_approval");
        }, 1000);
      }, 1000);
    }, 900);
  };

  const handleIntervention = (
    action: InterventionAction,
    overriddenParams?: Record<string, string | number | boolean>,
  ) => {
    if (action === "approve") {
      SoundEngine.playChime();
      setAgentStatus("running");
      setAgentStep(5);
      setTimeout(() => {
        setAgentStatus("completed");
      }, 1200);
    } else if (action === "override_and_approve") {
      SoundEngine.playChime();
      if (overriddenParams) {
        setAgentSteps((prev) => {
          const next = [...prev];
          if (next[3]?.toolCallPayload) {
            next[3] = {
              ...next[3],
              toolCallPayload: {
                ...next[3].toolCallPayload,
                parameters: overriddenParams,
              },
            };
          }
          return next;
        });
      }
      setAgentStatus("running");
      setAgentStep(5);
      setTimeout(() => {
        setAgentStatus("completed");
      }, 1200);
    } else if (action === "reject") {
      SoundEngine.playPop(300);
      setAgentStatus("failed");
    } else if (action === "step_back") {
      SoundEngine.playPop(480);
      setAgentStep(3);
      setAgentStatus("running");
      setTimeout(() => {
        SoundEngine.playAlarm();
        setAgentStep(4);
        setAgentStatus("gate_approval");
      }, 1100);
    }
  };

  const resetAgent = () => {
    SoundEngine.playPop(400);
    setAgentStatus("idle");
    setAgentStep(0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <main className="nova-shell">
      <div className="nova-grain" aria-hidden="true" />

      {/* Top Header */}
      <header className="nova-header">
        <Link className="nova-brand" href="/" aria-label="返回轨道星图首页" onMouseEnter={() => SoundEngine.playTick()}>
          <span className="nova-mark">
            <i />
            <i />
            <i />
          </span>
          <strong>NOVA</strong>
          <em>AI INTERFACE SYSTEM / 生产级母版</em>
        </Link>
        <nav className="nova-nav" aria-label="模板页面导航">
          <Link href="/" onMouseEnter={() => SoundEngine.playTick()}>
            🪐 天体星图
          </Link>
          <Link href="/shop" onMouseEnter={() => SoundEngine.playTick()} onClick={() => SoundEngine.playPop()}>
            🛍️ 3D 交互电商 (NEW)
          </Link>
          <a href="#playground" onMouseEnter={() => SoundEngine.playTick()}>
            交互实验台
          </a>
          <a href="#modules" onMouseEnter={() => SoundEngine.playTick()}>
            模块组件
          </a>
          <a href="#scenarios" onMouseEnter={() => SoundEngine.playTick()}>
            业务场景
          </a>
        </nav>
        <div className="topbar-right-group">
          <button
            type="button"
            className="api-config-pill-btn"
            onClick={() => {
              SoundEngine.playPop(520);
              setApiConfigOpen(true);
            }}
            title="配置模型 API 通信通道"
          >
            <span className={`mode-dot ${useRealApi ? "is-real" : ""}`} />
            {useRealApi ? "真实 API" : "拟真引擎"}
          </button>
          <button
            className="sound-toggle-btn"
            onClick={toggleSound}
            title={soundEnabled ? "静音" : "开启声效"}
            aria-label="声效控制"
          >
            {soundEnabled ? "🔊 声效: 开" : "🔈 静音"}
          </button>
          <a className="nova-header-link" href="#playground" onMouseEnter={() => SoundEngine.playTick()}>
            进入实验台 <b>↓</b>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="nova-hero">
        <div className="nova-hero-copy">
          <p className="nova-eyebrow">
            <i /> 01— AI 前端模板 / 生产级可交互版
          </p>
          <h1>
            让每个智能系统
            <br />
            <span>都有清晰可控的界面。</span>
          </h1>
          <p className="nova-lead">
            一套兼顾<strong>高质感视觉排版</strong>与<strong>真实大模型交互状态机</strong>的前端母版。
            涵盖流式打字机、置信度溯源抽屉、Agent 流程轨道与多模型权衡矩阵。
          </p>
          <div className="nova-hero-actions">
            <a
              className="nova-action-primary"
              href="#playground"
              onClick={() => SoundEngine.playPop()}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              体验动态交互实验台 <b>↓</b>
            </a>
            <Link
              className="nova-action-text"
              href="/shop"
              onClick={() => SoundEngine.playPop()}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              浏览 3D 交互电商 <span>3D</span>
            </Link>
          </div>
        </div>

        {/* Hero Visual Artboard */}
        <div className="nova-artboard" aria-label="AI 界面层级示意">
          <div className="nova-artboard-top">
            <span>INTERFACE SPECIMEN</span>
            <b>v.02 / PRODUCTION READY</b>
          </div>
          <div className="nova-axis nova-axis-x">
            <i />
            流式吞吐 / TPS
          </div>
          <div className="nova-axis nova-axis-y">HUMAN CONTROL</div>
          <div className="nova-sheet nova-sheet-back">
            <span>03</span>
            <strong>EVIDENCE & CITATION</strong>
            <i />
          </div>
          <div className="nova-sheet nova-sheet-mid">
            <span>02</span>
            <strong>AGENT PIPELINE & CoT</strong>
            <i />
          </div>
          <div className="nova-sheet nova-sheet-front">
            <span>01</span>
            <strong>STREAMING TYPOGRAPHY</strong>
            <i />
          </div>
          <div className="nova-core">
            <small>NOVA</small>
            <b>04</b>
            <span>CORE</span>
          </div>
          <div className="nova-artboard-caption">
            <span>STREAMING · EVIDENCE · INTERRUPT · ROUTING</span>
            <b>可直接套用的生产级状态</b>
          </div>
        </div>
      </section>

      {/* Metric Bar */}
      <section className="nova-metrics" aria-label="模板特点">
        <div>
          <span>开箱即用场景</span>
          <strong>
            04<sup>+</sup>
          </strong>
          <p>生成 / 洞察 / 检索 / 自动化</p>
        </div>
        <div>
          <span>交互状态机</span>
          <strong>04</strong>
          <p>流式引擎 / 溯源抽屉 / 流程阻断 / 路由</p>
        </div>
        <div>
          <span>核心设计准则</span>
          <strong>03</strong>
          <p>信息透明 / 来源可信 / 人类终极掌控</p>
        </div>
        <p className="nova-metric-note">
          不只是排版展示，更是为你解决网络长延迟、流式断流、幻觉溯源与副作用审批等真实前端工程痛点。
        </p>
      </section>

      {/* CORE FEATURE: Interactive Playground & Workbench */}
      <section className="nova-playground-section" id="playground">
        <div className="nova-section-intro">
          <p className="nova-eyebrow">
            <i /> 02— 动态交互实验台 (PLAYGROUND)
          </p>
          <h2>
            不看静态截图，
            <br />
            直接上手操作。
          </h2>
          <p>
            切换下方 4 大核心 AI 交互能力，体验真实的数据流、状态变化与可操作组件。这些模块可直接解耦复制到你的业务代码中。
          </p>
        </div>

        {/* Workbench Card */}
        <div className="nova-workbench-container">
          {/* Workbench Tabs */}
          <div className="nova-workbench-tabs">
            <button
              className={activePlaygroundTab === "stream" ? "is-active" : ""}
              onClick={() => {
                SoundEngine.playPop(480);
                setActivePlaygroundTab("stream");
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>01</span>
              <strong>流式生成 & 速度监控</strong>
              <small>Streaming & Latency</small>
            </button>
            <button
              className={activePlaygroundTab === "citation" ? "is-active" : ""}
              onClick={() => {
                SoundEngine.playPop(540);
                setActivePlaygroundTab("citation");
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>02</span>
              <strong>可信反馈 & 溯源抽屉</strong>
              <small>Citation & Confidence</small>
            </button>
            <button
              className={activePlaygroundTab === "agent" ? "is-active" : ""}
              onClick={() => {
                SoundEngine.playPop(600);
                setActivePlaygroundTab("agent");
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>03</span>
              <strong>Agent 流程 & 人工拦截</strong>
              <small>Human-in-the-Loop</small>
            </button>
            <button
              className={activePlaygroundTab === "router" ? "is-active" : ""}
              onClick={() => {
                SoundEngine.playPop(660);
                setActivePlaygroundTab("router");
              }}
              onMouseEnter={() => SoundEngine.playTick()}
            >
              <span>04</span>
              <strong>多模型路由权衡矩阵</strong>
              <small>Speed / Quality / Cost</small>
            </button>
          </div>

          {/* Workbench Body */}
          <div className="nova-workbench-body">
            {/* TAB 1: Streaming Generator */}
            {activePlaygroundTab === "stream" && (
              <StreamingTerminal
                streamedText={streamedText}
                isGenerating={isGenerating}
                isPaused={isPaused}
                telemetry={{
                  elapsed: elapsedTime,
                  tokens: tokenCount,
                  ttft: active.metrics.ttft,
                  tps: isGenerating && !isPaused ? active.metrics.tps : "0.0 tok/s",
                  cost: active.metrics.cost,
                }}
                promptValue={promptInput}
                onPromptChange={setPromptInput}
                onStart={() => startStreaming(promptInput)}
                onPause={togglePause}
                onStop={stopStreaming}
                onOpenCitationDrawer={(id) => {
                  SoundEngine.playPop(520);
                  setActivePlaygroundTab("citation");
                  setSelectedCitation(id);
                }}
              />
            )}

            {/* TAB 2: Citation & Evidence Inspector */}
            {activePlaygroundTab === "citation" && (
              <CitationInspector
                citations={sampleGenerations[activeScenario].citations}
                selectedCitationId={selectedCitation}
                onSelectCitation={(id) => {
                  SoundEngine.playPop(620);
                  setSelectedCitation(id);
                }}
                onViewSourceFullText={() => SoundEngine.playChime()}
              />
            )}

            {/* TAB 3: Agent Workflow & Human-in-the-Loop */}
            {activePlaygroundTab === "agent" && (
              <div className="nova-agent-panel">
                <div className="nova-agent-head">
                  <div>
                    <span>AGENT EXECUTION PIPELINE / AIOPS CLUSTER</span>
                    <strong>可观测智能体协同指挥室与三级人工干预沙盘</strong>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                    {/* 2D / 3D Dual-Mode Toggle */}
                    <div className="nova-view-switch-group">
                      <button
                        type="button"
                        className={`nova-view-switch-btn ${agentViewMode === "3d" ? "is-active" : ""}`}
                        onClick={() => {
                          SoundEngine.playPop(520);
                          setAgentViewMode("3d");
                        }}
                      >
                        🪐 3D 空间全景
                      </button>
                      <button
                        type="button"
                        className={`nova-view-switch-btn ${agentViewMode === "2d" ? "is-active" : ""}`}
                        onClick={() => {
                          SoundEngine.playPop(520);
                          setAgentViewMode("2d");
                        }}
                      >
                        📊 2D DAG 看板
                      </button>
                    </div>

                    <div className="nova-agent-controls">
                      {(agentStatus === "idle" || agentStatus === "failed") && (
                        <button
                          className="nova-btn-primary"
                          type="button"
                          onClick={runAgentPipeline}
                          onMouseEnter={() => SoundEngine.playTick()}
                        >
                          ▶ 启动自愈协同流水线
                        </button>
                      )}
                      {agentStatus === "running" && (
                        <button className="nova-btn-secondary" type="button" disabled>
                          ⏳ 协同执行中 ({agentStep}/5)...
                        </button>
                      )}
                      {agentStatus === "completed" && (
                        <button
                          className="nova-btn-secondary"
                          type="button"
                          onClick={resetAgent}
                          onMouseEnter={() => SoundEngine.playTick()}
                        >
                          🔄 重置执行链
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3D or 2D Presentation depending on user toggle */}
                {agentViewMode === "3d" ? (
                  <AgentSwarm3D
                    currentStepIndex={agentStep}
                    steps={agentSteps}
                    overallStatus={agentStatus}
                  />
                ) : (
                  <AgentPipeline2D
                    steps={agentSteps}
                    currentStepIndex={agentStep}
                    overallStatus={agentStatus}
                  />
                )}

                {/* 3-Level Human Approval Gate when safety intercept is hit */}
                {agentStatus === "gate_approval" && (
                  <HumanApprovalGate
                    step={agentSteps[3]}
                    onIntervene={handleIntervention}
                  />
                )}

                {agentStatus === "failed" && (
                  <div className="nova-approval-banner" style={{ borderColor: "#ff4444", background: "#200d0d" }}>
                    <div className="nova-approval-copy">
                      <strong style={{ color: "#ff6b6b" }}>✕ 流程已由操作员人工阻断拒绝 (TERMINATED)</strong>
                      <p>未执行任何底层写入副作用，集群当前保持只读安全隔离状态。</p>
                    </div>
                    <button
                      type="button"
                      className="nova-btn-secondary"
                      onClick={resetAgent}
                    >
                      重新初始化
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Model Router & Matrix */}
            {activePlaygroundTab === "router" && (
              <div className="nova-router-panel">
                <div className="nova-router-head">
                  <span>MODEL SELECTION & TRADEOFF MATRIX</span>
                  <strong>根据业务场景动态切换模型策略</strong>
                </div>

                <div className="nova-models-grid">
                  {modelsData.map((model) => (
                    <div
                      key={model.id}
                      role="button"
                      tabIndex={0}
                      className={`nova-model-choice-card ${selectedModel === model.id ? "is-selected" : ""}`}
                      onClick={() => {
                        SoundEngine.playWhoosh();
                        setSelectedModel(model.id);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          SoundEngine.playWhoosh();
                          setSelectedModel(model.id);
                        }
                      }}
                      onMouseEnter={() => SoundEngine.playTick()}
                    >
                      <div className="model-choice-top">
                        <strong>{model.name}</strong>
                        <span className="model-tag" style={{ borderColor: model.color, color: model.color }}>
                          {model.tag}
                        </span>
                      </div>
                      <p className="model-desc">{model.desc}</p>
                      <div className="model-matrix-grid">
                        <div>
                          <span>生成速率</span>
                          <b>{model.speed}</b>
                        </div>
                        <div>
                          <span>首字时延</span>
                          <b>{model.latency}</b>
                        </div>
                        <div>
                          <span>每千 Token 单价</span>
                          <b>{model.cost}</b>
                        </div>
                        <div>
                          <span>基准准确率</span>
                          <b style={{ color: "var(--nova-lime)" }}>{model.accuracy}</b>
                        </div>
                      </div>
                      <button className="model-select-btn" type="button" tabIndex={-1}>
                        {selectedModel === model.id ? "✓ 当前选中生效" : "切换为此模型"}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="nova-router-foot">
                  <span>
                    当前路由模式：
                    <b>{modelsData.find((m) => m.id === selectedModel)?.name}</b> · 自动应用至全局流式生成引擎
                  </span>
                  <button
                    className="nova-btn-text"
                    onClick={() => {
                      SoundEngine.playPop(550);
                      setActivePlaygroundTab("stream");
                      startStreaming();
                    }}
                    onMouseEnter={() => SoundEngine.playTick()}
                  >
                    前往流式测试生成 ↗
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Modules Overview */}
      <section className="nova-modules" id="modules">
        <div className="nova-section-intro">
          <p className="nova-eyebrow">
            <i /> 03— 可套用模块结构
          </p>
          <h2>
            不是堆功能，
            <br />
            而是建立清晰秩序。
          </h2>
          <p>每个模块都可以独立替换、组合。它们不是产品功能本身，而是让 AI 能力被人理解的视觉容器。</p>
        </div>
        <div className="nova-module-grid">
          {moduleCards.map((card) => (
            <article className={`nova-module-card is-${card.visual}`} key={card.number}>
              <div className="nova-card-head">
                <span>{card.number}</span>
                <i>{card.type}</i>
              </div>
              <div className="nova-mini" aria-hidden="true">
                <div className="nova-mini-ui">
                  <i />
                  <i />
                  <i />
                  <b />
                  <b />
                  <em />
                </div>
              </div>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
              <button
                className="nova-module-jump-btn"
                onClick={() => {
                  SoundEngine.playPop(520);
                  setActivePlaygroundTab(card.targetMode as "stream" | "citation" | "agent" | "router");
                  const el = document.getElementById("playground");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                onMouseEnter={() => SoundEngine.playTick()}
              >
                在实验台体验此模块 <b>↗</b>
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Scenarios Overview */}
      <section className="nova-scenarios" id="scenarios">
        <div className="nova-scenario-head">
          <div>
            <p className="nova-eyebrow">
              <i /> 04— 适配场景
            </p>
            <h2>
              同一套骨架，
              <br />
              支持不同业务形态。
            </h2>
          </div>
          <p>选择一个场景，查看同一套界面原则如何映射到不同的 AI 产品与性能指标。</p>
        </div>
        <div className="nova-scenario-layout">
          <div className="nova-scenario-tabs" role="tablist" aria-label="AI 产品场景">
            {(Object.keys(scenarios) as Scenario[]).map((scenario) => {
              const item = scenarios[scenario];
              return (
                <button
                  key={scenario}
                  type="button"
                  role="tab"
                  aria-selected={activeScenario === scenario}
                  className={activeScenario === scenario ? "is-active" : ""}
                  onClick={() => handleScenarioChange(scenario)}
                  onMouseEnter={() => SoundEngine.playTick()}
                >
                  <span>{item.index}</span>
                  <strong>{scenario}</strong>
                  <i>{item.signal}</i>
                  <b>↗</b>
                </button>
              );
            })}
          </div>
          <article className={`nova-scenario-panel is-${active.tone}`}>
            <div className="nova-panel-meta">
              <span>SCENARIO / {active.index}</span>
              <i>{active.signal}</i>
            </div>
            <h3>{active.title}</h3>
            <p>{active.summary}</p>
            <div className="nova-panel-surface">
              <div className="nova-surface-top">
                <span>BENCHMARK PROFILE</span>
                <b>READY TO COPY</b>
              </div>
              <div className="nova-surface-output">
                <span>产品传达体验</span>
                <strong>{active.output}</strong>
              </div>
              <div className="nova-surface-tags">
                {active.modules.map((module, index) => (
                  <i key={module}>
                    <b>0{index + 1}</b>
                    {module}
                  </i>
                ))}
              </div>
              <div className="nova-scenario-perf-bar">
                <div>
                  <span>推荐速率</span>
                  <b>{active.metrics.tps}</b>
                </div>
                <div>
                  <span>首字延迟</span>
                  <b>{active.metrics.ttft}</b>
                </div>
                <div>
                  <span>单次预估</span>
                  <b>{active.metrics.cost}</b>
                </div>
              </div>
            </div>
            <div className="nova-panel-foot">
              <span>把提示词换成你的业务场景</span>
              <button
                className="nova-btn-text"
                onClick={() => {
                  SoundEngine.playPop(580);
                  const el = document.getElementById("playground");
                  el?.scrollIntoView({ behavior: "smooth" });
                  startStreaming(active.samplePrompt);
                }}
                onMouseEnter={() => SoundEngine.playTick()}
              >
                将此场景载入实验台 ↗
              </button>
            </div>
          </article>
        </div>
      </section>

      {/* System Guidelines */}
      <section className="nova-system" id="system">
        <div className="nova-system-copy">
          <p className="nova-eyebrow">
            <i /> 05— 界面规范与人机准则
          </p>
          <h2>
            好的 AI 界面，
            <br />
            让人清楚三件事。
          </h2>
        </div>
        <div className="nova-principles">
          <article>
            <span>01</span>
            <h3>现在在发生什么</h3>
            <p>流式状态、延迟、Token 进度清晰可见，但不让状态过度喧宾夺主。</p>
          </article>
          <article>
            <span>02</span>
            <h3>为什么值得相信</h3>
            <p>知识来源、向量切片与置信度打分完全透明，消除黑盒猜疑成本。</p>
          </article>
          <article>
            <span>03</span>
            <h3>我仍然能掌控什么</h3>
            <p>让 Agent 自动化有边界，敏感工具调用设定人工审批，保留撤回与拦截权。</p>
          </article>
        </div>
        <div className="nova-blueprint" aria-label="AI 界面信息架构">
          <div className="nova-blueprint-label">NOVA / PRODUCTION SYSTEM MAP</div>
          <div className="nova-blueprint-track">
            <span>NARRATIVE</span>
            <i>→</i>
            <span>CONTEXT</span>
            <i>→</i>
            <span>INTELLIGENCE</span>
            <i>→</i>
            <span>HUMAN CONTROL</span>
          </div>
          <p>产品表达 · 向量检索 · 智能推理 · 人机协同控制</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="nova-footer">
        <div>
          <strong>NOVA</strong>
          <span>AI INTERFACE SYSTEM / 生产级交互母版</span>
        </div>
        <div className="footer-links">
          <Link href="/shop" onMouseEnter={() => SoundEngine.playTick()} onClick={() => SoundEngine.playPop()}>
            前往 3D 交互电商平台 ↗
          </Link>
          <Link href="/" onMouseEnter={() => SoundEngine.playTick()}>
            返回天体星图 <b>↗</b>
          </Link>
        </div>
      </footer>
      {/* Real Model API Adapter Modal */}
      {apiConfigOpen && (
        <div
          className="nova-modal-overlay"
          role="button"
          tabIndex={0}
          aria-label="关闭配置弹窗"
          onClick={(e) => {
            if (e.target === e.currentTarget) setApiConfigOpen(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") setApiConfigOpen(false);
          }}
        >
          <div
            className="nova-modal-box"
            role="dialog"
            aria-modal="true"
            aria-label="API 引擎配置"
          >
            <div className="nova-modal-head">
              <strong>⚙️ 模型通讯与数据源适配器 (DUAL-MODE ADAPTER)</strong>
              <button
                type="button"
                className="nova-modal-close"
                onClick={() => setApiConfigOpen(false)}
              >
                ✕
              </button>
            </div>
            <div className="nova-modal-body">
              <div className="nova-field-group">
                <label htmlFor="engine-mode-select">运行模式：</label>
                <select
                  id="engine-mode-select"
                  value={useRealApi ? "real" : "sim"}
                  onChange={(e) => setUseRealApi(e.target.value === "real")}
                >
                  <option value="sim">拟真事件流模式 (零配置 / 内置网络抖动与异常注入)</option>
                  <option value="real">真实模型连接模式 (SSE / OpenAI 协议 / 本地 Ollama)</option>
                </select>
              </div>

              {useRealApi && (
                <>
                  <div className="nova-field-group">
                    <label htmlFor="api-endpoint-input">API Base URL / Endpoint：</label>
                    <input
                      id="api-endpoint-input"
                      type="text"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      placeholder="如 http://localhost:11434 或 https://api.openai.com/v1"
                    />
                  </div>
                  <div className="nova-field-group">
                    <label htmlFor="api-key-input">API Key (本地留存，不上传)：</label>
                    <input
                      id="api-key-input"
                      type="password"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk-..."
                    />
                  </div>
                </>
              )}

              <p style={{ color: "#7b7d75", fontSize: "9px", margin: 0, lineHeight: 1.5 }}>
                💡 提示：在【拟真事件流模式】下，系统会自动模拟真实的分布式 Agent 通信延迟与 TPS 波动；在【真实模式】下，系统将通过 SSE 直接拉取模型流式 Chunk。
              </p>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "8px" }}>
                <button
                  type="button"
                  className="nova-btn-primary"
                  onClick={() => {
                    SoundEngine.playChime();
                    setApiConfigOpen(false);
                  }}
                >
                  保存配置并生效
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
