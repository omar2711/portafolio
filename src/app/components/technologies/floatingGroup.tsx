"use client";
import React from "react";
import CentralHex from "./centralHex";
import FloatingIcon from "./floatingIcon";
import { allIcons, getSpherePosition, N } from "./data";

export default function FloatingGroup({ rotation }: { rotation: [number, number, number] }) {
  return (
    <group rotation={rotation}>
      <CentralHex />
      {allIcons.map((tech, i) => (
        <FloatingIcon
          key={tech.icon + i}
          position={getSpherePosition(i, N, 5.5)}
          icon={tech.icon}
          name={tech.name}
        />
      ))}
    </group>
  );
}