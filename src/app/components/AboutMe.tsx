import React, { useState, useRef, Suspense, lazy, createContext, useContext } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ErrorBoundary } from "react-error-boundary";
import dynamic from 'next/dynamic';
import Image from 'next/image';

const ProjectCarousel = dynamic(() => import('./projects/ProjectCarousel'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full text-white">
      <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mr-2 sm:mr-4"></div>
      <span className="text-sm sm:text-base">Loading Projects...</span>
    </div>
  ),
});

const LazyFloatingGroup = lazy(() => import("./technologies/floatingGroup"));

interface AboutContextType {
  activeSection: number;
  setActiveSection: (section: number) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const AboutContext = createContext<AboutContextType | undefined>(undefined);

const useAbout = () => {
  const context = useContext(AboutContext);
  if (!context) {
    throw new Error("useAbout must be used within an AboutProvider");
  }
  return context;
};

const AboutProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeSection, setActiveSection] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AboutContext.Provider value={{ activeSection, setActiveSection, isLoading, setIsLoading }}>
      {children}
    </AboutContext.Provider>
  );
};

const ErrorFallback: React.FC<{ resetErrorBoundary: () => void }> = ({ 
  resetErrorBoundary 
}) => (
  <div
    className="flex flex-col items-center justify-center text-center p-3 sm:p-4"
    style={{
      background: "rgba(255, 0, 0, 0.1)",
      borderRadius: "1rem",
      border: "1px solid rgba(255, 0, 0, 0.3)",
      color: "#ff6b6b",
      minHeight: "200px",
    }}
  >
    <h3 className="text-lg sm:text-xl font-bold mb-2">Oops! Something went wrong</h3>
    <p className="text-xs sm:text-sm mb-4">Failed to load 3D scene</p>
    <button
      onClick={resetErrorBoundary}
      className="px-3 py-2 sm:px-4 sm:py-2 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
    >
      Try Again
    </button>
  </div>
);

const TecnologiasCanvas = () => {
  const { setIsLoading } = useAbout();

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => setIsLoading(false)}
      onError={(error) => {
        console.error("3D Canvas Error:", error);
        setIsLoading(false);
      }}
    >
      <Canvas 
        camera={{ 
          position: [0, 0, 14],
          fov: 60
        }}
        style={{ 
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          width: 'calc(100% - 20px)', 
          height: 'calc(100% - 20px)',
          display: 'block'
        }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 7]} intensity={0.8} />
        <Suspense 
          fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#2ee8bb" opacity={0.5} transparent />
            </mesh>
          }
        >
          <LazyFloatingGroup rotation={[0, 0, 0]} />
        </Suspense>
        <ElasticOrbitControls />
      </Canvas>
    </ErrorBoundary>
  );
};

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

const AboutSection = {
  Container: ({ children, className = "", style = {} }: { 
    children: React.ReactNode; 
    className?: string; 
    style?: React.CSSProperties 
  }) => (
    <div className={`flex items-center justify-center ${className}`} style={style}>
      {children}
    </div>
  ),
  
  Card: ({ children, background, boxShadow, className = "" }: {
    children: React.ReactNode;
    background: string;
    boxShadow: string;
    className?: string;
  }) => (
    <div
      className={`p-3 sm:p-4 lg:p-6 ${className}`}
      style={{
        background,
        borderRadius: "1rem sm:1.5rem",
        boxShadow,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(2px)",
      }}
    >
      {children}
    </div>
  ),

  Title: ({ children, color, className = "" }: {
    children: React.ReactNode;
    color: string;
    className?: string;
  }) => (
    <h3
      className={`mb-2 sm:mb-3 lg:mb-4 text-lg sm:text-xl lg:text-2xl font-bold text-center ${className}`}
      style={{
        fontFamily: "'League Script', cursive",
        letterSpacing: "1px",
        color,
      }}
    >
      {children}
    </h3>
  ),
};

function AboutMeContent() {
  return (
    <section className="relative z-0 w-full py-8 sm:py-12 lg:py-16 px-2 sm:px-4 flex flex-col gap-4 sm:gap-6 lg:gap-8 mt-20">
      <div className="flex flex-col lg:flex-row items-center justify-center gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
        <div className="w-full lg:w-2/3 order-2 lg:order-1">
          <div
            className="cut-border-container"
            style={{ width: "100%", height: "100%" }}
          >
            <div className="neon-border p-4 sm:p-6 lg:p-8 w-full bg-transparent rounded-xl sm:rounded-2xl">
              <h2
                className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-100 text-center lg:text-left"
                style={{
                  fontFamily: "'League Script', cursive",
                  letterSpacing: "1px",
                }}
              >
                About Me
              </h2>
              <p
                className="text-center lg:text-left text-sm sm:text-base lg:text-lg font-medium text-white"
                style={{
                  textShadow:
                    "0 0 8px #fff, 0 0 16px #a5e82e, 0 0 24px #2ee8bb",
                }}
              >
                Last-year Computer Systems Engineering student at Universidad
                del Valle - Bolivia, aspiring Full Stack Developer. I have
                hands-on experience with modern web technologies like React and
                Node.js. I&apos;m passionate about building scalable applications and
                eager to work on real-world projects where I can learn, grow,
                and contribute to impactful solutions.
              </p>
            </div>
          </div>
        </div>

        <ErrorBoundary
          FallbackComponent={({ resetErrorBoundary }) => (
            <div className="flex items-center justify-center w-full h-48 sm:h-64">
              <div className="text-center text-red-400">
                <p className="text-sm">Failed to load image</p>
                <button
                  onClick={resetErrorBoundary}
                  className="text-blue-400 underline text-xs"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        >
          <div className="w-full lg:w-1/3 flex justify-center order-1 lg:order-2">
            <div
              className="w-32 h-32 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
              style={{
                borderRadius: "50%",
                background:
                  "linear-gradient(45deg, #a5e82e, #ffffff, #2ee8bb, #ffffff, #2ebce8)",
                padding: "3px sm:4px",
                boxShadow:
                  "0 0 20px rgba(165, 232, 46, 0.5), 0 0 40px rgba(46, 232, 187, 0.3)",
              }}
            >
              <Image
                src="/images/myprofile/yo.jpg"
                alt="Omar Santiago Veizaga Ochoa"
                width={224}
                height={224}
                className="rounded-full w-full h-full object-cover"
                style={{ border: "2px solid rgba(255, 255, 255, 0.1)" }}
                onError={() => console.log("Image failed to load")}
                priority
              />
            </div>
          </div>
        </ErrorBoundary>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-6 max-w-7xl mx-auto w-full">
        <div className="w-full lg:w-1/4">
          <AboutSection.Card
            background="rgba(46, 232, 187, 0.1)"
            boxShadow="0 0 24px #2ee8bb44, 0 0 48px #2ee8bb33"
            className="min-h-[200px] sm:min-h-[300px] lg:min-h-[450px]"
          >
            <AboutSection.Title color="#2ee8bb">
              What I Work With
            </AboutSection.Title>
            <div className="flex flex-col gap-2 sm:gap-3 text-center w-full">
              <div className="text-white">
                <p className="font-semibold mb-1 text-sm sm:text-base">
                  Frontend
                </p>
                <p className="text-xs sm:text-sm">React, Next.js, Vue.js</p>
              </div>
              <div className="text-white">
                <p className="font-semibold mb-1 text-sm sm:text-base">
                  Backend
                </p>
                <p className="text-xs sm:text-sm">Node.js, Express, NestJS</p>
              </div>
              <div className="text-white">
                <p className="font-semibold mb-1 text-sm sm:text-base">
                  Database
                </p>
                <p className="text-xs sm:text-sm">MySQL, PostgreSQL, MongoDB</p>
              </div>
              <div className="text-white">
                <p className="font-semibold mb-1 text-sm sm:text-base">Tools</p>
                <p className="text-xs sm:text-sm">Git, Railway</p>
              </div>
            </div>
          </AboutSection.Card>
        </div>

        <div className="w-full lg:w-1/2">
          <div
            className="skills-border-container p-3 sm:p-4 lg:p-8 w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[450px]"
            style={{
              background: "rgba(85, 3, 72, 0.15)",
              borderRadius: "1rem sm:1.5rem",
              boxShadow: "0 0 24px #ec489944, 0 0 48px #ec489933",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "flex-start",
              backdropFilter: "blur(2px)",
            }}
          >
            <h2
              className="skills-title mb-3 sm:mb-4 lg:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-center flex-shrink-0"
              style={{
                fontFamily: "'League Script', cursive",
                letterSpacing: "1px",
                color: "#ec4899",
              }}
            >
              Skills and Frameworks
            </h2>
            <div
              className="w-full flex-1"
              style={{
                position: "relative",
                minHeight: "200px",
              }}
            >
              <TecnologiasCanvas />
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/4">
          <AboutSection.Card
            background="rgba(165, 232, 46, 0.1)"
            boxShadow="0 0 24px #a5e82e44, 0 0 48px #a5e82e33"
            className="min-h-[200px] sm:min-h-[300px] lg:min-h-[450px]"
          >
            <AboutSection.Title color="#a5e82e">
              Currently Learning
            </AboutSection.Title>
            <div className="text-center text-white space-y-1 sm:space-y-2">
              <p className="text-xs sm:text-sm">
                • Machine Learning with PyTorch
              </p>
              <p className="text-xs sm:text-sm">• Three.js & 3D Development</p>
              <p className="text-xs sm:text-sm">• Advanced React Patterns</p>
              <p className="text-xs sm:text-sm">• DevOps</p>
            </div>
          </AboutSection.Card>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4">
        <div
          className="w-full p-4 sm:p-6 lg:p-12"
          style={{
            background: "rgba(46, 188, 232, 0.1)",
            borderRadius: "1rem sm:1.5rem",
            boxShadow: "0 0 24px #2ebce844, 0 0 48px #2ebce833",
            backdropFilter: "blur(2px)",
          }}
        >
          <h3
            className="mb-4 sm:mb-6 text-2xl sm:text-3xl lg:text-4xl font-bold text-center"
            style={{
              fontFamily: "'League Script', cursive",
              letterSpacing: "1px",
              color: "#2ebce8",
            }}
          >
            Things I&apos;ve Built
          </h3>
          <div className="w-full h-96 sm:h-[32rem] md:h-[36rem] lg:h-96 relative">
            <ProjectCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AboutMe() {
  return (
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary }) => (
        <div className="flex items-center justify-center min-h-screen px-4">
          <ErrorFallback resetErrorBoundary={resetErrorBoundary} />
        </div>
      )}
    >
    <AboutProvider>
      <div className="relative">
        <AboutMeContent />
      </div>
    </AboutProvider>
    </ErrorBoundary>
  );
}