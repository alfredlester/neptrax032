'use client';
import { useEffect, useState } from 'react';

const SimpleGradientBackground = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Main Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, 
            #0f172a 0%, 
            #1e293b 25%, 
            #1e1b4b 50%, 
            #312e81 75%, 
            #1e1b4b 100%
          )`,
        }}
      />
      
      {/* Subtle Noise Texture for Depth */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Subtle Grid Overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
      
      {/* Focal Point Glow */}
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-96">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 blur-3xl" />
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-blue-400/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-purple-400/5 rounded-full blur-3xl" />
        </div>
      )}
      
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-purple-500/5 to-transparent" />
    </div>
  );
};

export default SimpleGradientBackground;