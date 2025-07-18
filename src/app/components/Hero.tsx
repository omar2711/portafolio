import React, { useRef, useEffect, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import Typewriter from 'typewriter-effect'
import './components.css'
import HeroParticles from './HeroParticles'

interface HeroProps {
  onScrollToAbout?: () => void;
}

export default function Hero({ onScrollToAbout }: HeroProps) {
  const [particlesKey, setParticlesKey] = useState(0)
  const [showScrollButton, setShowScrollButton] = useState(true)
  const progressRef = useRef({ value: 0, lastTime: 0 })
  const textRef = useRef<HTMLHeadingElement>(null)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleLoad = () => {
      setParticlesKey(prev => prev + 1)
    }
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(entry.intersectionRatio > 0.5);
      },
      { 
        threshold: [0, 0.25, 0.5, 0.75, 1],
        rootMargin: '-100px 0px -100px 0px'
      }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative" ref={heroRef}>
      <div
        className="relative w-full min-h-screen text-white overflow-hidden"
        style={{
          background: `
            linear-gradient(
              to bottom,
              transparent 0%,
              transparent 20%,
              rgba(10,24,51,0.95) 30%,
              rgba(10,24,51,0.95) 70%,
              transparent 80%,
              transparent 100%
            ),
            radial-gradient(
              ellipse at center,
              rgba(10,24,51,0.95) 20%,
              rgba(10,24,51,0.7) 40%,
              rgba(10,24,51,0.3) 60%,
              transparent 80%
            )
          `,
          transition: "background 5s ease-in-out",
        }}
      >
        <HeroParticles key={particlesKey} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1
            ref={textRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 bg-clip-text text-transparent leading-tight pb-2 cursor-default text-center"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #a5e82e, #2ee8bb, #2ebce8)",
              backgroundSize: "100% 100%",
              backgroundPosition: `${progressRef.current.value % 150}% 50%`,
              filter: "drop-shadow(0 0 0.1px rgba(165, 232, 46, 0.7))",
              textShadow: "0 0 10px rgba(46, 188, 232, 0.5)",
              transition: "filter 0.3s ease, text-shadow 0.3s ease",
            }}
          >
            Omar Santiago Veizaga Ochoa
          </h1>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-medium mb-4 sm:mb-6 neon-subtitle text-center">
            Full &nbsp;Stack &nbsp;Developer &nbsp;Junior
          </h2>
          <div className="text-sm sm:text-base lg:text-lg mb-6 sm:mb-8 max-w-xs sm:max-w-md lg:max-w-xl text-center px-4 font-mono bg-black bg-opacity-50 p-3 sm:p-4 rounded">
            <Typewriter
              options={{
                strings: ["Something need doin'? I can do that!"],
                autoStart: true,
                loop: false,
                delay: 7,
                cursor: "|",
                deleteSpeed: 900000000000000000,
              }}
            />
          </div>
        </div>

        <div 
          className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 ease-in-out ${
            showScrollButton 
              ? 'opacity-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <button
            onClick={onScrollToAbout}
            className="group relative p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Scroll to About Me section"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -translate-x-full group-hover:translate-x-full transition-all duration-700"></div>
            
            <FaChevronDown 
              className="relative text-white text-xl sm:text-2xl animate-bounce transition-all duration-300 group-hover:scale-110" 
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))'
              }}
            />
          </button>

          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="text-white text-xs sm:text-sm whitespace-nowrap bg-black bg-opacity-50 px-3 py-1 rounded-full backdrop-blur-sm">
              Explore More
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}