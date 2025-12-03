'use client';
import { useEffect, useState } from 'react';

const PremiumAnimatedBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Animated Gradient Layers - Creates depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/40 to-purple-900/30 animate-gradient-slow"></div>
      
      {/* Subtle grid overlay - adds tech/design feel */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 95%, rgba(59, 130, 246, 0.3) 100%),
            linear-gradient(0deg, transparent 95%, rgba(59, 130, 246, 0.3) 100%)
          `,
          backgroundSize: '40px 40px'
        }}
      ></div>
      
      {/* Floating elements with different animations for depth */}
      <div className="absolute inset-0">
        {/* Layer 1: Slow moving large circles */}
        {[...Array(isMobile ? 4 : 8)].map((_, i) => (
          <div
            key={`large-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-xl"
            style={{
              width: `${Math.random() * 200 + 100}px`,
              height: `${Math.random() * 200 + 100}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-large ${15 + Math.random() * 15}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
        
        {/* Layer 2: Medium speed medium circles */}
        {[...Array(isMobile ? 6 : 12)].map((_, i) => (
          <div
            key={`medium-${i}`}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-300/20 blur-lg"
            style={{
              width: `${Math.random() * 80 + 40}px`,
              height: `${Math.random() * 80 + 40}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-medium ${8 + Math.random() * 8}s ease-in-out infinite alternate`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
        
        {/* Layer 3: Fast moving small dots (like particles) */}
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <div
            key={`small-${i}`}
            className="absolute rounded-full bg-blue-300/30"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float-small ${4 + Math.random() * 4}s linear infinite`,
              animationDelay: `${Math.random() * 2}s`,
              boxShadow: '0 0 8px rgba(96, 165, 250, 0.5)'
            }}
          />
        ))}
        
        {/* Subtle connecting lines for network effect */}
        {!isMobile && (
          <svg className="absolute inset-0 w-full h-full opacity-20">
            <defs>
              <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.5" />
              </linearGradient>
            </defs>
            {[...Array(6)].map((_, i) => (
              <line
                key={`line-${i}`}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#line-gradient)"
                strokeWidth="0.5"
                strokeDasharray="5,5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="0"
                  to="20"
                  dur={`${3 + Math.random() * 4}s`}
                  repeatCount="indefinite"
                />
              </line>
            ))}
          </svg>
        )}
      </div>
      
      {/* Subtle noise texture overlay for premium feel */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>
    </div>
  );
};

export default PremiumAnimatedBackground;