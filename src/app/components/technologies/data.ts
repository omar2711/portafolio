export const N = 25;

export const allIcons = [
  { icon: "SiDjango", name: "Django" },
  { icon: "SiDotnet", name: ".NET" },
  { icon: "SiExpo", name: "Expo" },
  { icon: "SiExpress", name: "Express" },
  { icon: "SiFigma", name: "Figma" },
  { icon: "SiGithub", name: "GitHub" },
  { icon: "SiGitlab", name: "GitLab" },
  { icon: "SiJava", name: "Java" },
  { icon: "SiNestjs", name: "NestJS" },
  { icon: "SiNextdotjs", name: "Next.js" },
  { icon: "SiNodedotjs", name: "Node.js" },
  { icon: "SiOpencv", name: "OpenCV" },
  { icon: "SiPython", name: "Python" },
  { icon: "SiPytorch", name: "PyTorch" },
  { icon: "SiRailway", name: "Railway" },
  { icon: "SiReact", name: "React" },
  { icon: "SiThreedotjs", name: "Three.js" },
  { icon: "SiVuedotjs", name: "Vue.js" },
  { icon: "SiMysql", name: "MySQL" },
  { icon: "SiOracle", name: "Oracle" },
  { icon: "SiPostgresql", name: "PostgreSQL" },
  { icon: "SiMongodb", name: "MongoDB" },
  { icon: "SiRedis", name: "Redis" },
  { icon: "SiTypescript", name: "TypeScript" },
  { icon: "SiJavascript", name: "JavaScript" },
];

export function getSpherePosition(i: number, n: number, radius: number): [number, number, number] {
  const phi = Math.acos(-1 + (2 * i) / n);
  const theta = Math.sqrt(n * Math.PI) * phi;
  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ];
}