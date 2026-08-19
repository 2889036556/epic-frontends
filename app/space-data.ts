export type Planet = {
  id: string;
  name: string;
  kicker: string;
  function: string;
  image: string;
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
    name: "Mercury",
    kicker: "MISSION ARCHIVE",
    function: "Mission Log",
    image: "/planets/mercury.png",
    accent: "#d9a96f",
    darkAccent: "#332017",
    descriptor: "The first signal after dawn.",
    description: "Review close-range flyby records and keep the inner-system mission archive in precise orbital order.",
    distance: "57.9M km",
    period: "88 days",
    rotation: "58.6 days",
    temperature: "167°C",
    primaryLabel: "ARCHIVED PASSES",
    primaryValue: "2,942",
    rangeLabel: "RECORDING WINDOW",
    timeline: [
      { code: "01", label: "MESSENGER", detail: "Surface relay synchronized" },
      { code: "02", label: "CALORIS", detail: "Thermal archive indexed" },
      { code: "03", label: "TERMINATOR", detail: "Night-side pass ready" },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    kicker: "ATMOSPHERE ARRAY",
    function: "Climate Monitor",
    image: "/planets/venus.png",
    accent: "#ff7a27",
    darkAccent: "#351507",
    descriptor: "A weather system with nowhere to land.",
    description: "Observe the carbon-dioxide envelope, pressure gradients, and slow retrograde spin of Earth’s brilliant neighbor.",
    distance: "108.2M km",
    period: "224.7 days",
    rotation: "243 days",
    temperature: "464°C",
    primaryLabel: "CLOUD VELOCITY",
    primaryValue: "360 km/h",
    rangeLabel: "ALTITUDE SAMPLE",
    timeline: [
      { code: "01", label: "CLOUD TOP", detail: "Sulfuric layer mapped" },
      { code: "02", label: "DUSK LINE", detail: "Pressure contour live" },
      { code: "03", label: "LOWER HAZE", detail: "Signal loss expected" },
    ],
  },
  {
    id: "earth",
    name: "Earth",
    kicker: "BLUE MARBLE FEED",
    function: "Living Systems",
    image: "/planets/earth.png",
    accent: "#54b8ff",
    darkAccent: "#071c36",
    descriptor: "The reference world.",
    description: "Tune into a living planet: ocean rhythms, cloud formation, and the small constellation of human missions in orbit.",
    distance: "149.6M km",
    period: "365.2 days",
    rotation: "23h 56m",
    temperature: "14°C",
    primaryLabel: "OCEAN COVER",
    primaryValue: "71%",
    rangeLabel: "OBSERVATION BAND",
    timeline: [
      { code: "01", label: "DAYLIGHT", detail: "Blue Marble lock acquired" },
      { code: "02", label: "LOW ORBIT", detail: "Satellite lattice visible" },
      { code: "03", label: "NIGHT SIDE", detail: "Auroral band predicted" },
    ],
  },
  {
    id: "mars",
    name: "Mars",
    kicker: "SURFACE LAB",
    function: "Rover Desk",
    image: "/planets/mars.png",
    accent: "#ef6c4e",
    darkAccent: "#35110c",
    descriptor: "Red dust. Blue hour. New ground.",
    description: "Build a field sequence for a distant rover: select terrain, set the sol, and follow the path toward the next horizon.",
    distance: "227.9M km",
    period: "687 days",
    rotation: "24h 37m",
    temperature: "−63°C",
    primaryLabel: "ACTIVE SOL",
    primaryValue: "SOL 1,479",
    rangeLabel: "TRAVERSE RANGE",
    timeline: [
      { code: "01", label: "JEZERO", detail: "Sample cache location" },
      { code: "02", label: "RIDGE", detail: "Drive path compiled" },
      { code: "03", label: "BLUE HOUR", detail: "Imaging queue ready" },
    ],
  },
  {
    id: "jupiter",
    name: "Jupiter",
    kicker: "STORM SIGNALS",
    function: "Signal Streams",
    image: "/planets/jupiter.png",
    accent: "#e6c097",
    darkAccent: "#2c1d18",
    descriptor: "A planet-sized weather engine.",
    description: "Sweep the giant’s atmosphere for radio bursts, lightning signatures, and the ever-changing boundary of its great red storm.",
    distance: "778.5M km",
    period: "11.9 years",
    rotation: "9h 56m",
    temperature: "−110°C",
    primaryLabel: "STORM DIAMETER",
    primaryValue: "16,350 km",
    rangeLabel: "RADIO SPECTRUM",
    timeline: [
      { code: "01", label: "GREAT RED SPOT", detail: "Vorticity trace active" },
      { code: "02", label: "IO TORUS", detail: "Plasma noise isolated" },
      { code: "03", label: "NORTH POLE", detail: "Cyclone cluster scan" },
    ],
  },
  {
    id: "saturn",
    name: "Saturn",
    kicker: "RING CARTOGRAPHY",
    function: "Ring Studio",
    image: "/planets/saturn.png",
    accent: "#f5d68f",
    darkAccent: "#322814",
    descriptor: "A system written in ice and shadow.",
    description: "Set a viewing angle through Saturn’s ring plane and isolate the luminous gaps, bands, and orbiting fragments beyond it.",
    distance: "1.43B km",
    period: "29.5 years",
    rotation: "10h 42m",
    temperature: "−140°C",
    primaryLabel: "RING SPAN",
    primaryValue: "282,000 km",
    rangeLabel: "RING PLANE ANGLE",
    timeline: [
      { code: "01", label: "A RING", detail: "Outer edge in view" },
      { code: "02", label: "CASSINI GAP", detail: "Shadow interval marked" },
      { code: "03", label: "ENCKE GAP", detail: "Moonlet wake detected" },
    ],
  },
  {
    id: "uranus",
    name: "Uranus",
    kicker: "DEEP ARCHIVE",
    function: "Archive Vault",
    image: "/planets/uranus.png",
    accent: "#42cfdf",
    darkAccent: "#073139",
    descriptor: "The world that rolls through space.",
    description: "Browse the quiet outer-system archive and align observations around a planet whose seasons are measured in decades.",
    distance: "2.87B km",
    period: "84 years",
    rotation: "17h 14m",
    temperature: "−195°C",
    primaryLabel: "AXIAL TILT",
    primaryValue: "98°",
    rangeLabel: "ARCHIVE DEPTH",
    timeline: [
      { code: "01", label: "SOUTH POLE", detail: "Seasonal record opened" },
      { code: "02", label: "MIRANDA", detail: "Moon catalog linked" },
      { code: "03", label: "FAINT RINGS", detail: "Low-light pass loaded" },
    ],
  },
  {
    id: "neptune",
    name: "Neptune",
    kicker: "OUTER NAVIGATOR",
    function: "Course Plotter",
    image: "/planets/neptune.png",
    accent: "#6c8eff",
    darkAccent: "#101749",
    descriptor: "At the edge of the familiar light.",
    description: "Plot a line through the outer dark where the Sun is a bright star and the fastest winds in the solar system take hold.",
    distance: "4.50B km",
    period: "164.8 years",
    rotation: "16h 6m",
    temperature: "−200°C",
    primaryLabel: "WIND SPEED",
    primaryValue: "2,100 km/h",
    rangeLabel: "COURSE OFFSET",
    timeline: [
      { code: "01", label: "TRITON", detail: "Approach vector set" },
      { code: "02", label: "DARK SPOT", detail: "Weather marker active" },
      { code: "03", label: "HELIOPAUSE", detail: "Long range course ready" },
    ],
  },
];

export function findPlanet(id: string) {
  return planets.find((planet) => planet.id === id);
}
