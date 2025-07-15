"use client";
import React, { useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import * as ReactIcons from "react-icons/si";

export default function FloatingIcon({
  position,
  icon,
  name,
}: {
  position: [number, number, number];
  icon: string;
  name: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime() + position[0] + position[1] + position[2];
      meshRef.current.position.y = position[1] + Math.sin(t * 0.8) * 0.25;
      meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.15;
      meshRef.current.lookAt(camera.position);
    }
  });

  const IconComponent = ReactIcons[icon as keyof typeof ReactIcons];

  const getNeonColor = (iconName: string) => {
    const neonColors: { [key: string]: string } = {
      "SiReact": "#61dafb",
      "SiNextdotjs": "#ffffff", 
      "SiNodedotjs": "#68a063",
      "SiJavascript": "#f7df1e",
      "SiTypescript": "#3178c6",
      "SiPython": "#3776ab",
      "SiJava": "#ed8b00",
      "SiDotnet": "#512bd4",
      "SiDjango": "#32ff32",
      "SiExpress": "#ffffff",
      "SiNestjs": "#e0234e",
      "SiMysql": "#4479a1",
      "SiPostgresql": "#336791",
      "SiMongodb": "#47a248",
      "SiOracle": "#f80000",
      "SiDocker": "#2496ed",
      "SiGithub": "#ffffff",
      "SiGitlab": "#fca326",
      "SiRailway": "#ffffff",    
      "SiThreedotjs": "#ffffff",
      "SiVuedotjs": "#4fc08d",
      "SiExpo": "#87ceeb",       
      "SiFigma": "#f24e1e",
      "SiOpencv": "#5c3ee8",
      "SiPytorch": "#ee4c2c",
      "SiRedis": "#dc382d"
    };
    return neonColors[iconName] || "#ffffff";
  };

  const iconColor = getNeonColor(icon);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial transparent opacity={0} />
      <Html center transform>
        <div 
          style={{ 
            fontSize: '40px',
            color: iconColor,
            filter: `drop-shadow(0 0 8px ${iconColor}) drop-shadow(0 0 16px ${iconColor}40)`,
            transition: 'all 0.3s ease',
            pointerEvents: 'none',
          }}
        >
          {IconComponent && <IconComponent />}
        </div>
      </Html>
      {hovered && (
        <Html center distanceFactor={8} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(30,41,59,0.92)",
              color: "#fff",
              padding: "6px 14px",
              borderRadius: "8px",
              fontSize: "0.95rem",
              fontWeight: 500,
              whiteSpace: "nowrap",
              boxShadow: "0 2px 8px #0003",
              marginTop: "-42px",
              marginLeft: "150px",
              transform: "translateX(-30%)",
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}