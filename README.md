# Epic Web Experiences 🪐 🛍️ 🤖

> 一套融合顶级视觉美学、Three.js 三维渲染、Web Audio 实时声音合成与生产级 AI 原生交互的次世代前端工程展示集。

[![React 19](https://img.shields.io/badge/React-19.2-61DAFB.svg)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black.svg)](https://threejs.org/)
[![Vite / Vinext](https://img.shields.io/badge/Vite_8-Vinext-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/TailwindCSS-v4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 三大核心交互场景

### 01 / 🪐 轨道星图 (Orbital Atlas) · 太阳系三维科学仪器
- **路由路径**：`http://localhost:3000/`
- **核心特色**：
  - 基于真实天文数据的太阳系八大行星 3D 物理轨道模拟；
  - 深度着色器渲染（太阳光晕、土星环多层透明阴影、地球云层与自转）；
  - 动态轨道相机平滑插值追踪与行星属性面板。

### 02 / 🛍️ 3D 交互电商硬件 (Aura Space Audio)
- **路由路径**：`http://localhost:3000/shop`
- **核心特色**：
  - Lusion 风格的弹性物理与手势拖拽阻尼；
  - 四大定制着色器模式（液态流动 Fluid、空间解构 Exploded、全息线框 Wireframe、晶体折射 Crystal）；
  - 四大主题材质即时切换（液态镀铬、曜石暗钛、星云赤金、极光紫晶）；
  - 纯 Web Audio 动态合成操作音效。

### 03 / 🤖 NOVA 多智能体 3D 指挥台 (AI Interface System)
- **路由路径**：`http://localhost:3000/ai`
- **核心特色**：
  - **3D 智能体星系拓扑 (`AgentSwarm3D`)**：将 Planner、Monitor、RAG、Fixer、Auditor 渲染为三维天体核心，带通信贝塞尔流光粒子与空间向量点云；
  - **三级深度人机协同 (`HumanApprovalGate`)**：敏感写操作触发硬性拦截，操作员可在线修改/覆盖执行参数（Parameter Override）并支持单步回滚（Step-Back）；
  - **RAG 向量切片溯源抽屉 (`CitationInspector`)**：点击引用角标即时滑出余弦相似度（Cosine）与原始语料切片（Raw Chunk）；
  - **实时流式速率遥测 (`StreamingTerminal`)**：动态监控 TPS（每秒 Token）、TTFT 首字延迟与 Token 开销。

---

## 📦 架构与组件库分层 (Monorepo)

本项目采用清晰的分层架构：
- `app/`：三大场景的应用展示站（基于 Vinext App Router + React 19）；
- `packages/nova-ui/`：**独立开源 AI 组件包 (`@2889036556/nova-ui`)**，可独立发布至 npm，并在其他任何 React / Next.js 项目中复用。

---

## 🚀 快速启动

### 环境要求
- Node.js `>= 22.13.0`
- npm `>= 10.0.0`

### 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动本地开发服务 (默认端口 3000)
npm run dev

# 3. 执行代码静态分析与无损自动化测试
npm run lint
npm run test

# 4. 构建生产环境部署包
npm run build
```

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 开源发布。
欢迎 Star ⭐️ 与 Fork 探讨！
