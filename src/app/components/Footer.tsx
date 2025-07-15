import React from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaCode } from 'react-icons/fa';

const Footer: React.FC = () => {
  return (
    <footer className="relative w-full bg-gradient-to-t from-slate-900 via-slate-800 to-transparent">
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cyan-500/20 via-purple-500/10 to-transparent blur-sm"></div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-emerald-500/15 via-blue-500/8 to-transparent blur-lg"></div>
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-pink-500/10 via-indigo-500/5 to-transparent blur-xl"></div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-cyan-400 via-purple-400 via-emerald-400 to-cyan-400 opacity-80 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      
      <div className="relative z-10 px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center gap-6 sm:gap-8 mb-6 sm:mb-8">
            <a
              href="https://github.com/omar2711"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(99, 102, 241, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaGithub className="text-white text-xl sm:text-2xl transition-all duration-300 group-hover:scale-110" />
            </a>
            
            <a
              href="https://www.linkedin.com/in/omarv27/"
              target="_blank"
              rel="noopener noreferrer"
              className="group p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(14, 165, 233, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(14, 165, 233, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaLinkedin className="text-white text-xl sm:text-2xl transition-all duration-300 group-hover:scale-110" />
            </a>
            
            <a
              href="mailto:omarvzaga@gmail.com"
              className="group p-3 sm:p-4 rounded-full transition-all duration-300 hover:scale-110 backdrop-blur-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(34, 197, 94, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <FaEnvelope className="text-white text-xl sm:text-2xl transition-all duration-300 group-hover:scale-110" />
            </a>
          </div>
          
          <div className="text-center mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
              Thanks for visiting!
            </h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Always excited to collaborate on innovative projects and bring creative ideas to life. 
              Let&apos;s build something amazing together!
            </p>
          </div>
          
          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full max-w-md opacity-50"></div>
            <FaCode className="mx-4 text-cyan-400 text-lg sm:text-xl animate-pulse" />
            <div className="h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-full max-w-md opacity-50"></div>
          </div>
          
          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-400 flex items-center justify-center gap-2">
              <span>Made with</span>
              <FaHeart className="text-red-400 animate-pulse text-sm" />
              <span>by Omar Santiago Veizaga Ochoa</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">
              © {new Date().getFullYear()} All rights reserved.
            </p>
          </div>
        </div>
      </div>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-12 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-ping" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-16 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-ping" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-14 left-1/2 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-50 animate-ping" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 right-1/4 w-1 h-1 bg-pink-400 rounded-full opacity-30 animate-ping" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-18 left-1/6 w-1 h-1 bg-blue-400 rounded-full opacity-35 animate-ping" style={{ animationDelay: '0.8s' }}></div>
        <div className="absolute bottom-22 right-1/6 w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-45 animate-ping" style={{ animationDelay: '2.3s' }}></div>
      </div>
    </footer>
  );
};

export default Footer;