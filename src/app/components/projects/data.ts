import { ComponentType } from 'react';
import YOLODemo from './YOLODemo';

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  technologies: string[];
  component?: ComponentType;
  image?: string;
  demoLink?: string;
  githubLink: string;
  color: string;
  gradient: string;
  type: 'interactive' | 'standard';
  textColor?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    title: "Fire & Smoke Detection",
    subtitle: "YOLO Computer Vision Model",
    description: "Real-time AI detection of fire and smoke using YOLO architecture.",
    technologies: ["Python", "YOLO", "OpenCV", "PyTorch"],
    component: YOLODemo,
    githubLink: "https://github.com/omar2711/yolov8-pytorch-cuda-training",
    color: "#ff6b6b",
    textColor: "#ffffff",
    gradient: "linear-gradient(135deg, #ff6b6b, #ff8e8e)",
    type: "interactive"
  },
  {
    id: 2,
    title: "BlokisLabs",
    subtitle: "Frontend Development",
    description: "Contributed to the frontend development of BlokisLabs, a cutting-edge blockchain and web3 platform. Worked as part of the development team to create modern, responsive user interfaces.",
    technologies: ["React", "TypeScript", "Next.js", "Web3"],
    image: "/images/projects/blokislabs.png",
    demoLink: "https://blokislabs.com/",
    githubLink: "https://github.com/Blokis-dev",
    color: "#00d4ff",
    textColor: "#ffffff",
    gradient: "linear-gradient(135deg, #00d4ff, #0099cc)",
    type: "standard"
  },
  {
    id: 3,
    title: "CraterOdyssey",
    subtitle: "Game Jam Entry",
    description: "A 3D adventure game created for a game jam, featuring exploration and puzzle-solving.",
    technologies: ["Unity", "C#", "Game Design", "3D Graphics"],
    image: "/images/projects/craterOdyssey.png",
    demoLink: "https://omarsho2711.itch.io/crater-odyssey",
    githubLink: "https://github.com/omar2711/gameJam",
    color: "#9b59b6",
    textColor: "#ffffff",
    gradient: "linear-gradient(135deg, #9b59b6, #8e44ad)",
    type: "standard"
  },
  {
    id: 4,
    title: "Personal Portfolio",
    subtitle: "Modern Web Development",
    description: "A responsive portfolio website built with Next.js 15 and React.",
    technologies: ["Next.js 15", "React", "TypeScript", "Three.js", "Tailwind CSS", "GSAP"],
    image: "/images/projects/portfolio.png",
    demoLink: window.location.origin,
    githubLink: "https://github.com/omar2711/portafolio",
    color: "#a5e82e",
    textColor: "#ffffff",
    gradient: "linear-gradient(135deg, #a5e82e, #2ee8bb, #2ebce8)",
    type: "standard"
  }
];