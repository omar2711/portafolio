import React, { useRef, useEffect, useState } from 'react'
import { FaGithub, FaChevronDown } from 'react-icons/fa'
import Typewriter from 'typewriter-effect'
import './components.css'
import HeroParticles from './HeroParticles'

interface HeroProps {
  onScrollToAbout?: () => void;
}

export default function Hero({ onScrollToAbout }: HeroProps) {
  const [isSticky, setIsSticky] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [particlesKey, setParticlesKey] = useState(0)
  const progressRef = useRef({ value: 0, lastTime: 0 })
  const requestRef = useRef<number>(0)
  const textRef = useRef<HTMLHeadingElement>(null)
  const diagonalRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleLoad = () => {
      setParticlesKey(prev => prev + 1)
    }
    window.addEventListener('load', handleLoad)
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  const animate = (timestamp: number) => {
    if (!progressRef.current.lastTime) {
      progressRef.current.lastTime = timestamp
    }
    const delta = timestamp - progressRef.current.lastTime
    progressRef.current.value += delta * 0.02
    progressRef.current.lastTime = timestamp
    if (textRef.current) {
      textRef.current.style.backgroundPosition = `${progressRef.current.value % 150}% 50%`
    }
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    if (isHovering) {
      progressRef.current.lastTime = 0
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [isHovering])

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsSticky(entry.boundingClientRect.top <= 0),
      { threshold: [0] }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="relative">
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

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <button
            onClick={onScrollToAbout}
            className="group p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
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
            <FaChevronDown 
              className="text-white text-xl sm:text-2xl animate-bounce" 
              style={{
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.5))'
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}