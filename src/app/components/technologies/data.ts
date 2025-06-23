// Number of icons
export const N = 19;

export const allIcons = [
  { icon: "django.svg", name: "Django" },
  { icon: "dotnet.svg", name: ".NET" },
  { icon: "expo.svg", name: "Expo" },
  { icon: "express.svg", name: "Express" },
  { icon: "figma.svg", name: "Figma" },
  { icon: "github.svg", name: "GitHub" },
  { icon: "gitlab.svg", name: "GitLab" },
  { icon: "java.svg", name: "Java" },
  { icon: "nestjs.svg", name: "NestJS" },
  { icon: "nextjs.svg", name: "Next.js" },
  { icon: "node.svg", name: "Node.js" },
  { icon: "opencv.svg", name: "OpenCV" },
  { icon: "python.svg", name: "Python" },
  { icon: "pytorch.svg", name: "PyTorch" },
  { icon: "railway.svg", name: "Railway" },
  { icon: "react.svg", name: "React" },
  { icon: "threejs.svg", name: "Three.js" },
  { icon: "vuejs.svg", name: "Vue.js" },
  { icon: "yolo.svg", name: "YOLO" },
];

// Function to get a position on a sphere for each icon
export function getSpherePosition(i: number, n: number, radius: number): [number, number, number] {
  const phi = Math.acos(-1 + (2 * i) / n);
  const theta = Math.sqrt(n * Math.PI) * phi;
  return [
    radius * Math.cos(theta) * Math.sin(phi),
    radius * Math.sin(theta) * Math.sin(phi),
    radius * Math.cos(phi),
  ];
}