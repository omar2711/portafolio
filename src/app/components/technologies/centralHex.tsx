"use client";
import React from "react";

export default function CentralHex() {
  return (
    <mesh>
      <sphereGeometry args={[1, 5, 3]} />
      <meshStandardMaterial color="#0ea5e9" metalness={0.5} roughness={0.3} />
    </mesh>
  );
}