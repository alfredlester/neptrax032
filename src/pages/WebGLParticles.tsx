'use client';
import { useEffect, useRef, useState } from 'react';

const PremiumCanvasBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // High-end color palette
    const colors = [
      { r: 59, g: 130, b: 246, a: 0.4 },  // blue-500
      { r: 139, g: 92, b: 246, a: 0.4 },  // violet-500
      { r: 96, g: 165, b: 250, a: 0.3 },  // blue-400
      { r: 168, g: 85, b: 247, a: 0.3 },  // violet-400
      { r: 52, g: 211, b: 153, a: 0.2 },  // emerald-400
      { r: 245, g: 158, b: 11, a: 0.2 },  // amber-500
    ];

    // Optimized particle count
    const particleCount = isMobile ? 60 : 120;
    
    // Create particles with depth simulation
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const size = Math.random() * 3 + 1;
      const depth = Math.random() * 2 + 0.5; // Simulate 3D depth
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: size,
        originalSize: size,
        depth: depth,
        speedX: (Math.random() - 0.5) * 0.8 * depth,
        speedY: (Math.random() - 0.5) * 0.8 * depth,
        color: color,
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.02 + 0.01,
        waveAmplitude: Math.random() * 15 + 5,
        connections: [] as number[],
      };
    });

    // Create connections between nearby particles
    particles.forEach((particle, i) => {
      particle.connections = [];
      particles.forEach((other, j) => {
        if (i !== j && Math.random() > 0.7) {
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 200) {
            particle.connections.push(j);
          }
        }
      });
    });

    let time = 0;

    const drawParticle = (p: any, ctx: CanvasRenderingContext2D) => {
      // Wave motion
      const waveX = Math.sin(time * p.waveSpeed + p.waveOffset) * p.waveAmplitude;
      const waveY = Math.cos(time * p.waveSpeed + p.waveOffset) * p.waveAmplitude;
      
      const drawX = p.x + waveX;
      const drawY = p.y + waveY;
      
      // Depth-based size variation
      const currentSize = p.originalSize * (0.8 + 0.4 * Math.sin(time * 0.003 + p.waveOffset));

      // Glow effect
      const gradient = ctx.createRadialGradient(
        drawX, drawY, 0,
        drawX, drawY, currentSize * 3
      );
      gradient.addColorStop(0, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.color.a})`);
      gradient.addColorStop(1, `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, 0)`);
      
      ctx.beginPath();
      ctx.arc(drawX, drawY, currentSize, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      return { x: drawX, y: drawY };
    };

    const drawConnection = (p1: any, p2: any, ctx: CanvasRenderingContext2D) => {
      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const opacity = 0.2 * (1 - distance / 150);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.05;

      // Draw gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.1)'); // slate-900
      gradient.addColorStop(0.5, 'rgba(30, 41, 59, 0.05)'); // slate-800
      gradient.addColorStop(1, 'rgba(51, 65, 85, 0.1)'); // slate-700
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      const particlePositions = particles.map((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Boundary wrap
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.x < -50) p.x = canvas.width + 50;
        if (p.y > canvas.height + 50) p.y = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        
        return drawParticle(p, ctx);
      });

      // Draw connections
      particles.forEach((p, i) => {
        p.connections.forEach((connIndex) => {
          if (connIndex < particlePositions.length) {
            drawConnection(
              { x: particlePositions[i].x, y: particlePositions[i].y },
              { x: particlePositions[connIndex].x, y: particlePositions[connIndex].y },
              ctx
            );
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isMobile]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />
      {/* Subtle overlay for extra polish */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 via-transparent to-slate-900/5"></div>
    </>
  );
};

export default PremiumCanvasBackground;