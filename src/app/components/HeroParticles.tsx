import React, { useState, useEffect } from "react";
import "./components.css";

type ParticleArea = {
  x: [number, number];
  y: [number, number];
  colors: string[];
  count: number;
  sizeRange: [number, number];
};

export default function HeroParticles() {
  const [isReady, setIsReady] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  useEffect(() => {
    const handleLoad = () => {
      setIsReady(true);
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('load', handleLoad);
    window.addEventListener('resize', handleResize);
    
    if (document.readyState === 'complete') {
      handleLoad();
    }

    return () => {
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const generateParticles = (areas: ParticleArea[]) => {
    return areas.flatMap((area, areaIndex) => 
      Array.from({ length: area.count }).map((_, i) => {
        const size = area.sizeRange[0] + Math.random() * (area.sizeRange[1] - area.sizeRange[0]);
        const color = area.colors[i % area.colors.length];
        
        const style: React.CSSProperties = {
          left: `${area.x[0] + Math.random() * (area.x[1] - area.x[0])}px`,
          top: `${area.y[0] + Math.random() * (area.y[1] - area.y[0])}px`,
          opacity: 0.4 + Math.random() * 0.4,
          animationDelay: `${Math.random() * 3}s`,
          width: `${size}px`,
          height: `${size}px`,
        };

        return (
          <div
            key={`${areaIndex}-${i}`}
            className={`hero-particle ${color}`}
            style={style}
          />
        );
      })
    );
  };

  const particleAreas: ParticleArea[] = [
    { 
      x: [windowSize.width * 0.2, windowSize.width * 0.8], 
      y: [0, windowSize.height * 0.3], 
      colors: ["green", "fuchsia", "blue"], 
      count: 40,
      sizeRange: [3, 8]
    },
    { 
      x: [0, windowSize.width * 0.2], 
      y: [0, windowSize.height * 0.4], 
      colors: ["green", "blue"], 
      count: 20,
      sizeRange: [2, 6]
    },
    { 
      x: [windowSize.width * 0.8, windowSize.width], 
      y: [0, windowSize.height * 0.4], 
      colors: ["fuchsia", "blue"], 
      count: 20,
      sizeRange: [2, 6]
    },
    { 
      x: [0, windowSize.width], 
      y: [windowSize.height * 0.3, windowSize.height * 0.7], 
      colors: ["blue", "green"], 
      count: 15,
      sizeRange: [2, 5]
    },
    // Zona inferior
    { 
      x: [0, windowSize.width], 
      y: [windowSize.height * 0.7, windowSize.height], 
      colors: ["fuchsia", "green"], 
      count: 10,
      sizeRange: [1, 4]
    }
  ];

  if (!isReady) return null;

  return (
    <div className="hero-particles-container">
      {generateParticles(particleAreas)}
    </div>
    
  );
}