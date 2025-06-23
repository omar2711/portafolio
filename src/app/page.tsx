"use client";
import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingGroup from "./components/technologies/floatingGroup";

function ElasticOrbitControls() {
  const controlsRef = useRef<any>(null);
  const targetPolar = Math.PI / 2; 
  const elasticRange = 0.5; 

  useFrame(() => {
    const controls = controlsRef.current;
    if (controls) {
      if (!controls.dragging) {
        controls.setPolarAngle(
          controls.getPolarAngle() +
            (targetPolar - controls.getPolarAngle()) * 0.1
        );
      }
      if (controls.getPolarAngle() < targetPolar - elasticRange) {
        controls.setPolarAngle(targetPolar - elasticRange);
      }
      if (controls.getPolarAngle() > targetPolar + elasticRange) {
        controls.setPolarAngle(targetPolar + elasticRange);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={false}
      minPolarAngle={Math.PI / 2 - elasticRange}
      maxPolarAngle={Math.PI / 2 + elasticRange}
    />
  );
}

export default function HomePage() {
  return (
    <main style={{ width: "100vw", height: "100vh", background: "#0f172a" }}>
      <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} />
        <FloatingGroup rotation={[0, 0, 0]} />
        <ElasticOrbitControls />
      </Canvas>
    </main>
  );
}