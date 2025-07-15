import React, { useState, Suspense, useEffect } from 'react';
import { projects, Project } from './data';
import './carousel.css';

const ProjectCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  const nextProject = () => {
    if (isTransitioning) return;
    changeProject((currentIndex + 1) % projects.length);
  };

  const prevProject = () => {
    if (isTransitioning) return;
    changeProject((currentIndex - 1 + projects.length) % projects.length);
  };

  const goToProject = (index: number) => {
    if (isTransitioning || index === currentIndex) return;
    changeProject(index);
  };

  const changeProject = (newIndex: number) => {
    setIsTransitioning(true);
    setIsVisible(false);
    
    setTimeout(() => {
      setCurrentIndex(newIndex);
      setDisplayIndex(newIndex);
      setIsVisible(true);
      
      setTimeout(() => {
        setIsTransitioning(false);
      }, 100);
    }, 400);
  };

  const currentProject = projects[displayIndex];

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mr-2 sm:mr-4"></div>
        <span className="text-sm sm:text-base">Loading Projects...</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 transition-all duration-700 ease-in-out transform"
        style={{
          background: currentProject.gradient,
          borderRadius: "1rem",
          padding: "1rem",
          paddingBottom: "4rem",
          opacity: isTransitioning ? 0.7 : 1,
          transform: isTransitioning ? 'scale(0.98)' : 'scale(1)',
        }}
      >
        {currentProject.type === "interactive" && currentProject.component ? (
          <div 
            className={`w-full h-full overflow-hidden rounded-lg transition-all duration-400 ease-out ${
              isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
            }`}
          >
            <Suspense fallback={
              <div className="flex items-center justify-center h-full text-white">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-white mr-2 sm:mr-4"></div>
                <span className="text-sm sm:text-base">Loading {currentProject.title}...</span>
              </div>
            }>
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-full h-full max-w-full max-h-full">
                  <currentProject.component />
                </div>
              </div>
            </Suspense>
          </div>
        ) : (
          <div 
            className={`flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 h-full min-h-0 transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-4'
            }`}
          >
            <div 
              className={`flex items-center justify-center order-1 lg:order-1 flex-shrink-0 transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 transform scale-100 translate-y-0' : 'opacity-0 transform scale-95 translate-y-4'
              }`}
              style={{ transitionDelay: isVisible ? '100ms' : '0ms' }}
            >
              <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl h-48 sm:h-64 lg:h-80 rounded-lg overflow-hidden border-2 border-white border-opacity-30 transition-all duration-300 hover:border-opacity-50">
                {currentProject.image ? (
                  <img
                    src={currentProject.image}
                    alt={currentProject.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-black bg-opacity-20 text-white">
                    <div className="text-center">
                      <div className="text-4xl sm:text-6xl lg:text-8xl mb-2 sm:mb-4 lg:mb-8 transition-transform duration-300 hover:scale-110">🚀</div>
                      <p className="text-lg sm:text-xl lg:text-2xl">Project Preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div 
              className={`flex flex-col justify-start px-2 sm:px-4 lg:px-8 order-2 lg:order-2 overflow-y-auto flex-1 min-h-0 project-scroll transition-all duration-600 ease-out ${
                isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform translate-x-8'
              }`}
              style={{ 
                color: currentProject.textColor,
                transitionDelay: isVisible ? '200ms' : '0ms'
              }}
            >
              <h4 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 text-center lg:text-left transition-all duration-400 hover:scale-105">
                {currentProject.title}
              </h4>
              <p className="text-base sm:text-lg lg:text-xl opacity-90 mb-2 sm:mb-3 lg:mb-4 text-center lg:text-left transition-opacity duration-300 hover:opacity-100">
                {currentProject.subtitle}
              </p>
              <p className="text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 lg:mb-6 leading-relaxed text-center lg:text-left transition-all duration-300">
                {currentProject.description}
              </p>
              
              <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-3 mb-3 sm:mb-4 lg:mb-6 justify-center lg:justify-start">
                {currentProject.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 sm:px-3 sm:py-2 lg:px-4 lg:py-2 text-xs sm:text-sm lg:text-base rounded-full border transition-all duration-400 hover:scale-105 transform ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{
                      backgroundColor: currentProject.color,
                      borderColor: currentProject.color,
                      color: currentProject.textColor,
                      boxShadow: `0 0 10px ${currentProject.color}20`,
                      transitionDelay: isVisible ? `${300 + index * 50}ms` : '0ms'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div 
                className={`flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4 items-center lg:items-start mt-auto transition-all duration-500 ease-out ${
                  isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
                }`}
                style={{ transitionDelay: isVisible ? '400ms' : '0ms' }}
              >
                {currentProject.demoLink && (
                  <a
                    href={currentProject.demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg text-center rounded-lg transition-all duration-300 hover:scale-105 border-2 transform hover:-translate-y-1"
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: currentProject.color,
                      color: currentProject.textColor,
                      boxShadow: `0 0 20px ${currentProject.color}30`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = currentProject.color;
                      e.currentTarget.style.boxShadow = `0 0 30px ${currentProject.color}60`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.boxShadow = `0 0 20px ${currentProject.color}30`;
                    }}
                  >
                    Live Demo
                  </a>
                )}
                <a
                  href={currentProject.githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 lg:px-8 lg:py-4 text-sm sm:text-base lg:text-lg text-center rounded-lg transition-all duration-300 hover:scale-105 border-2 transform hover:-translate-y-1"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.3)',
                    borderColor: currentProject.color,
                    color: currentProject.textColor,
                    boxShadow: `0 0 20px ${currentProject.color}20`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
                    e.currentTarget.style.boxShadow = `0 0 30px ${currentProject.color}40`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                    e.currentTarget.style.boxShadow = `0 0 20px ${currentProject.color}20`;
                  }}
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {projects.length > 1 && (
        <>
          <button
            onClick={prevProject}
            disabled={isTransitioning}
            className={`absolute left-2 sm:left-4 lg:left-8 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
            }`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isTransitioning) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }}
          >
            <span className="text-lg sm:text-xl lg:text-2xl font-bold transition-transform duration-200 hover:scale-110">‹</span>
          </button>
          <button
            onClick={nextProject}
            disabled={isTransitioning}
            className={`absolute right-2 sm:right-4 lg:right-8 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 backdrop-blur-sm ${
              isTransitioning ? 'opacity-50 cursor-not-allowed' : 'opacity-100 cursor-pointer'
            }`}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)'
            }}
            onMouseEnter={(e) => {
              if (!isTransitioning) {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
            }}
          >
            <span className="text-lg sm:text-xl lg:text-2xl font-bold transition-transform duration-200 hover:scale-110">›</span>
          </button>

          <div className="absolute bottom-2 sm:bottom-3 lg:bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 sm:gap-3 lg:gap-4 z-10">
            {projects.map((_, index) => (
              <button
                key={index}
                onClick={() => goToProject(index)}
                disabled={isTransitioning}
                className={`w-2 h-2 sm:w-3 sm:h-3 lg:w-4 lg:h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                  isTransitioning ? 'cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{
                  backgroundColor: index === currentIndex ? currentProject.color : 'rgba(255, 255, 255, 0.3)',
                  boxShadow: index === currentIndex ? `0 0 15px ${currentProject.color}60` : 'none',
                  transform: index === currentIndex ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectCarousel;