"use client";
import React, { useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

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

  const texture = React.useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load(`/images/technologies/${icon}`);
  }, [icon]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial map={texture} transparent />
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
            }}
          >
            {name}
          </div>
        </Html>
      )}
    </mesh>
  );
}