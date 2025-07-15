'use client';

import { useState, useEffect } from 'react';
import { Github, Mail, X, Check } from 'lucide-react';

const Contact = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showCopiedNotification, setShowCopiedNotification] = useState(false);
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);
  const [showButtons, setShowButtons] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExpanded(true);
      const shrinkTimer = setTimeout(() => {
        setIsExpanded(false);
      }, 3000);
      return () => clearTimeout(shrinkTimer);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const sentinelElement = document.createElement('div');
    sentinelElement.style.height = '1px';
    sentinelElement.style.position = 'absolute';
    sentinelElement.style.bottom = '0';
    sentinelElement.style.width = '100%';
    sentinelElement.setAttribute('data-footer-sentinel', 'true');

    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.position = 'relative';
      footer.appendChild(sentinelElement);

      const observer = new IntersectionObserver(
        ([entry]) => {

          setShowButtons(!entry.isIntersecting);
        },
        {
          threshold: 0,
          rootMargin: '0px 0px -200px 0px'
        }
      );

      observer.observe(sentinelElement);

      return () => {
        observer.disconnect();
        if (sentinelElement.parentNode) {
          sentinelElement.parentNode.removeChild(sentinelElement);
        }
      };
    }
  }, []);

  const handleGithubClick = () => {
    window.open('https://github.com/omar2711', '_blank');
  };

  const handleEmailClick = () => {
    setShowEmailModal(true);
  };

  const closeModal = () => {
    setShowEmailModal(false);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("omarvzaga@gmail.com");
      setShowCopiedNotification(true);
      
      setTimeout(() => {
        setIsNotificationVisible(true);
      }, 10);
      
      setTimeout(() => {
        setIsNotificationVisible(false);
      }, 2500);
      
      setTimeout(() => {
        setShowCopiedNotification(false);
      }, 3000);
    } catch (err) {
      console.error('Failed to copy email: ', err);
    }
  };

  return (
    <>
      {showCopiedNotification && (
        <div 
          className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[200] transition-all duration-500 ease-out ${
            isNotificationVisible 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-4 opacity-0'
          }`}
        >
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg border border-green-400/30 flex items-center gap-2"
            style={{
              boxShadow: `
                0 0 20px rgba(34, 197, 94, 0.5),
                0 0 40px rgba(34, 197, 94, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `
            }}
          >
            <Check size={20} className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
            <span className="font-medium drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
              Mail copied!
            </span>
          </div>
        </div>
      )}

      <div 
        className={`fixed bottom-8 right-8 flex flex-col gap-4 z-50 transition-all duration-500 ease-in-out ${
          showButtons 
            ? 'opacity-100 translate-y-0 pointer-events-auto' 
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={handleEmailClick}
          className={`
            group relative overflow-hidden
            ${isExpanded ? "w-40 h-12" : "w-12 h-12"}
            bg-gradient-to-r from-purple-600 to-blue-600
            rounded-full transition-all duration-700 ease-in-out
            shadow-lg shadow-purple-500/25
            border border-purple-400/30
            hover:shadow-xl hover:shadow-purple-500/40
            hover:scale-105 active:scale-95
          `}
          style={{
            boxShadow: `
              0 0 20px rgba(168, 85, 247, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full animate-pulse" />

          <div className="relative flex items-center justify-center h-full px-3">
            <Mail
              size={20}
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            {isExpanded && (
              <span className="ml-2 text-white font-medium text-sm whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                Contact me
              </span>
            )}
          </div>
        </button>

        <button
          onClick={handleGithubClick}
          className={`
            group relative overflow-hidden
            ${isExpanded ? "w-40 h-12" : "w-12 h-12"}
            bg-gradient-to-r from-gray-800 to-gray-600
            rounded-full transition-all duration-700 ease-in-out
            shadow-lg shadow-gray-500/25
            border border-gray-400/30
            hover:shadow-xl hover:shadow-gray-500/40
            hover:scale-105 active:scale-95
          `}
          style={{
            boxShadow: `
              0 0 20px rgba(75, 85, 99, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.2)
            `,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-gray-300/20 rounded-full animate-pulse" />

          <div className="relative flex items-center justify-center h-full px-3">
            <Github
              size={20}
              className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            />
            {isExpanded && (
              <span className="ml-2 text-white font-medium text-sm whitespace-nowrap drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                GitHub
              </span>
            )}
          </div>
        </button>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200 dark:border-gray-700">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>

            <div className="text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Contact me
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  You can reach me at my email address :)
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
                <p className="text-lg font-mono text-gray-900 dark:text-white">
                  omarvzaga@gmail.com
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() =>
                    (window.location.href = "mailto:omarvzaga@gmail.com")
                  }
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-300"
                >
                  Open Email
                </button>
                <button
                  onClick={handleCopyEmail}
                  className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 py-3 px-6 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;