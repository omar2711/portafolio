"use client";
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import FloatingGroup from "./components/technologies/floatingGroup";
import Hero from './components/Hero';
import AboutMe from './components/AboutMe';
import Contact from './components/Contact';

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [viewportHeight, setViewportHeight] = useState(0);
  const aboutMeRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(window.innerHeight);
    };

    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);

    return () => {
      window.removeEventListener('resize', setVH);
      window.removeEventListener('orientationchange', setVH);
    };
  }, []);

  const scrollToAboutMe = () => {
    aboutMeRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <main
      className="relative w-full"
      style={{
        background: "#0f172a",
        backgroundImage: "url('/images/wallbrick.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full">
        <Hero onScrollToAbout={scrollToAboutMe} />
        <div ref={aboutMeRef}>
          <AboutMe />
        </div>
        <Contact />
      </div>
    </main>
  );
}