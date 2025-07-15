"use client";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CrystalCube() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const t = clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.2;
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.z = t * 0.1;
    }
  });

  return (
    <>
      <directionalLight
        position={[2, 4, 2]}
        intensity={4.2}
        castShadow={false}
      />
      
      <pointLight position={[0, 0, 0]} intensity={3} color="#ff00ff" />
      <pointLight position={[2, 0, 0]} intensity={1} color="#ff00ff" />
      <pointLight position={[-2, 0, 0]} intensity={1} color="#ff00ff" />
      <pointLight position={[0, 2, 0]} intensity={1} color="#ff00ff" />
      
      <mesh ref={meshRef}>
        <dodecahedronGeometry args={[1]} />
        <meshStandardMaterial
          color="#ff44ff"
          emissive="#ff00ff"
          emissiveIntensity={1.9}
          wireframe
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}