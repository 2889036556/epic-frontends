export type Planet = {
  id: string;
  name: string;
  kicker: string;
  function: string;
  image: string;
  texture: string;
  accent: string;
  darkAccent: string;
  descriptor: string;
  description: string;
  distance: string;
  period: string;
  rotation: string;
  temperature: string;
  primaryLabel: string;
  primaryValue: string;
  rangeLabel: string;
  timeline: { code: string; label: string; detail: string }[];
};

export const planets: Planet[] = [
  {
    id: "mercury",
    name: "水星",
    kicker: "任务档案",
    function: "任务日志",
    image: "/planets/mercury.jpg",
    texture: "/textures/mercury.jpg",
    accent: "#d9a96f",
    darkAccent: "#332017",
    descriptor: "黎明之后抵达的第一束信号。",
    description: "回看近距离飞掠记录，把内太阳系的任务档案整理成精确的轨道序列。",
    distance: "5,790 万公里",
    period: "88 天",
    rotation: "58.6 天",
    temperature: "167°C",
    primaryLabel: "已归档飞掠",
    primaryValue: "2,942",
    rangeLabel: "记录窗口",
    timeline: [
      { code: "01", label: "信使号", detail: "表面中继已同步" },
      { code: "02", label: "卡洛里斯", detail: "热力档案已索引" },
      { code: "03", label: "晨昏线", detail: "夜侧飞掠已就绪" },
    ],
  },
  {
    id: "venus",
    name: "金星",
    kicker: "大气阵列",
    function: "气候监测",
    image: "/planets/venus.jpg",
    texture: "/textures/venus_surface.jpg",
    accent: "#ff7a27",
    darkAccent: "#351507",
    descriptor: "没有着陆点的天气系统。",
    description: "观察二氧化碳包层、气压梯度，以及这颗明亮邻星缓慢的逆行自转。",
    distance: "1.082 亿公里",
    period: "224.7 天",
    rotation: "243 天",
    temperature: "464°C",
    primaryLabel: "云层速度",
    primaryValue: "360 km/h",
    rangeLabel: "高度采样",
    timeline: [
      { code: "01", label: "云顶", detail: "硫酸层已绘制" },
      { code: "02", label: "暮光线", detail: "压力轮廓实时" },
      { code: "03", label: "低层云霾", detail: "预计会有信号衰减" },
    ],
  },
  {
    id: "earth",
    name: "地球",
    kicker: "蓝色星球观测",
    function: "生命系统",
    image: "/planets/earth.jpg",
    texture: "/textures/earth_daymap.jpg",
    accent: "#54b8ff",
    darkAccent: "#071c36",
    descriptor: "一颗用来校准一切的星球。",
    description: "调谐到一颗活着的行星：海洋节律、云层形成，以及近地轨道上人类任务组成的小型星座。",
    distance: "1.496 亿公里",
    period: "365.2 天",
    rotation: "23 小时 56 分",
    temperature: "14°C",
    primaryLabel: "海洋覆盖",
    primaryValue: "71%",
    rangeLabel: "观测频段",
    timeline: [
      { code: "01", label: "日照侧", detail: "蓝色星球已锁定" },
      { code: "02", label: "低轨道", detail: "卫星网络可见" },
      { code: "03", label: "夜侧", detail: "极光带已预测" },
    ],
  },
  {
    id: "mars",
    name: "火星",
    kicker: "地表实验室",
    function: "探测车台",
    image: "/planets/mars.jpg",
    texture: "/textures/mars.jpg",
    accent: "#ef6c4e",
    darkAccent: "#35110c",
    descriptor: "红尘、蓝调时刻，以及新的地面。",
    description: "为远方的探测车编排一段野外序列：选择地形、设定火星日，沿着路径驶向下一道地平线。",
    distance: "2.279 亿公里",
    period: "687 天",
    rotation: "24 小时 37 分",
    temperature: "−63°C",
    primaryLabel: "当前火星日",
    primaryValue: "SOL 1,479",
    rangeLabel: "行驶范围",
    timeline: [
      { code: "01", label: "杰泽罗", detail: "样本缓存位置" },
      { code: "02", label: "山脊", detail: "行驶路径已编排" },
      { code: "03", label: "蓝调时刻", detail: "成像队列已就绪" },
    ],
  },
  {
    id: "jupiter",
    name: "木星",
    kicker: "风暴信号",
    function: "信号流",
    image: "/planets/jupiter.jpg",
    texture: "/textures/jupiter.jpg",
    accent: "#e6c097",
    darkAccent: "#2c1d18",
    descriptor: "一台行星尺度的天气引擎。",
    description: "扫描这颗巨行星的大气，寻找无线电脉冲、闪电特征，以及大红斑不断变化的边界。",
    distance: "7.785 亿公里",
    period: "11.9 年",
    rotation: "9 小时 56 分",
    temperature: "−110°C",
    primaryLabel: "风暴直径",
    primaryValue: "16,350 km",
    rangeLabel: "无线电频谱",
    timeline: [
      { code: "01", label: "大红斑", detail: "涡量轨迹活动中" },
      { code: "02", label: "木卫一等离子环", detail: "等离子噪声已分离" },
      { code: "03", label: "北极", detail: "气旋集群扫描" },
    ],
  },
  {
    id: "saturn",
    name: "土星",
    kicker: "光环制图",
    function: "光环工作室",
    image: "/planets/saturn.jpg",
    texture: "/textures/saturn.jpg",
    accent: "#f5d68f",
    darkAccent: "#322814",
    descriptor: "一套由冰与阴影写成的系统。",
    description: "设定穿过土星光环平面的观察角度，分离发光的缝隙、带状结构，以及外侧环绕的碎片。",
    distance: "14.3 亿公里",
    period: "29.5 年",
    rotation: "10 小时 42 分",
    temperature: "−140°C",
    primaryLabel: "光环跨度",
    primaryValue: "282,000 km",
    rangeLabel: "光环平面角度",
    timeline: [
      { code: "01", label: "A 环", detail: "外缘已进入视野" },
      { code: "02", label: "卡西尼缝", detail: "阴影间隔已标记" },
      { code: "03", label: "恩克缝", detail: "已检测到小卫星尾迹" },
    ],
  },
  {
    id: "uranus",
    name: "天王星",
    kicker: "深空档案",
    function: "档案库",
    image: "/planets/uranus.jpg",
    texture: "/textures/uranus.jpg",
    accent: "#42cfdf",
    darkAccent: "#073139",
    descriptor: "一颗横滚着穿过空间的世界。",
    description: "浏览安静的外太阳系档案，围绕一颗以数十年计算季节的行星对齐观测。",
    distance: "28.7 亿公里",
    period: "84 年",
    rotation: "17 小时 14 分",
    temperature: "−195°C",
    primaryLabel: "轴向倾角",
    primaryValue: "98°",
    rangeLabel: "档案深度",
    timeline: [
      { code: "01", label: "南极", detail: "季节记录已打开" },
      { code: "02", label: "米兰达", detail: "卫星目录已关联" },
      { code: "03", label: "暗淡光环", detail: "低光照飞掠已加载" },
    ],
  },
  {
    id: "neptune",
    name: "海王星",
    kicker: "外层导航",
    function: "航线绘制",
    image: "/planets/neptune.jpg",
    texture: "/textures/neptune.jpg",
    accent: "#6c8eff",
    darkAccent: "#101749",
    descriptor: "在熟悉光线的边缘。",
    description: "在外部的黑暗中绘制一条航线：太阳只是一颗明亮的星，而太阳系最快的风在此发生。",
    distance: "45.0 亿公里",
    period: "164.8 年",
    rotation: "16 小时 6 分",
    temperature: "−200°C",
    primaryLabel: "风速",
    primaryValue: "2,100 km/h",
    rangeLabel: "航线偏移",
    timeline: [
      { code: "01", label: "海卫一", detail: "接近向量已设定" },
      { code: "02", label: "暗斑", detail: "天气标记活动中" },
      { code: "03", label: "日球层顶", detail: "远程航线已就绪" },
    ],
  },
];

export function findPlanet(id: string) {
  return planets.find((planet) => planet.id === id);
}
