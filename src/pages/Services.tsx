'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import WebGLParticles from './WebGLParticles';
import ServicesStyles from './Services.module.css';

interface ServicesProps {
  onNavigate: (section: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const handleDiscoverClick = useCallback(() => {
    servicesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Single Intersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.classList.contains('reveal-up')) {
              entry.target.classList.add(ServicesStyles.inView);
            }
            if (entry.target.classList.contains('minimal-service-item')) {
              entry.target.classList.add(ServicesStyles.serviceVisible);
            }
          }
        });
      },
      { threshold: 0.15 }
    );

    const revealElements = document.querySelectorAll('.reveal-up, .minimal-service-item');
    revealElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Optimized image tilt effect
  useEffect(() => {
    if (window.innerWidth < 768) return;
    
    let animationFrameId: number;
    
    const handleMouseMove = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (!target.closest('.services-visual img')) return;
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      
      animationFrameId = requestAnimationFrame(() => {
        const img = target as HTMLImageElement;
        const r = img.getBoundingClientRect();
        const x = (ev.clientX - r.left) / r.width - 0.5;
        const y = (ev.clientY - r.top) / r.height - 0.5;
        img.style.transform = `perspective(900px) rotateX(${y * 6}deg) rotateY(${x * -6}deg) scale(1.02)`;
      });
    };

    const handleMouseLeave = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (!target.closest('.services-visual img')) return;
      
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      const img = target as HTMLImageElement;
      img.style.transform = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave, true);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave, true);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const servicesList = [
   {
  title: 'Custom Website Design',
  description: 'Clean, modern websites designed to match any brand. Focused on easy navigation, professional visuals, and turning visitors into customers.',
},
{
  title: 'Full-Stack Web Development',
  description: 'Fast, reliable websites and web apps built from front-end to back-end. Made to perform smoothly and scale as the business grows.',
},
{
  title: 'AI-Powered Chatbots',
  description: 'Smart chatbots that answer questions, guide visitors, and offer round-the-clock support without needing constant supervision.',
},
{
  title: 'Social Media Management',
  description: 'Complete management of social media profiles, including posting, engagement, and community growth across major platforms.',
},
{
  title: 'Brand Identity & Visual Design',
  description: 'Professional branding that stands out — logos, colors, and visual styles that give any business a clear and memorable identity.',
},
{
  title: 'Social Media & Digital Advertising',
  description: 'Targeted ad campaigns across Facebook, Instagram, LinkedIn, and Google, built to reach the right audience and deliver strong returns.',
},
{
  title: 'SEO Optimization & Growth Strategy',
  description: 'Search-engine improvements that help websites rank higher and bring in more organic traffic through technical fixes and content strategy.',
},
{
  title: 'AI Automation Agents',
  description: 'Custom automation tools powered by AI to handle repetitive tasks, speed up workflows, and improve efficiency.',
},
{
  title: 'Mobile App Design & Development',
  description: 'User-friendly mobile apps for iOS and Android, designed to look great, run fast, and support business goals.',
},
{
  title: 'Marketing Audit & Strategic Planning',
  description: 'Clear evaluation of current marketing performance, highlighting strengths, gaps, and actionable steps for better results.',
},
{
  title: 'E-Commerce Store Development',
  description: 'Online stores built for easy shopping, smooth checkout, and strong product presentation optimized for conversions.',
},
{
  title: 'Content Creation & Copywriting',
  description: 'Simple, effective content for websites, blogs, and marketing materials, written to engage readers and inspire action.',
}
];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-hidden">
      
{/* Hero Section */}
<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
  <div className="absolute inset-0">
    <WebGLParticles />
    <div className="absolute inset-0 bg-black/40"></div>
  </div>

  <div
    className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ${
      isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
    }`}
  >
    <div className="mb-8">
      <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 leading-tight">
        <span className="
          bg-gradient-to-r 
          from-[#A1D8FF] via-[#6FB7FF] to-[#3F8BFF]
          bg-clip-text text-transparent
          drop-shadow-[0_0_22px_rgba(80,150,255,0.25)]
        ">
          Explore Our Services
        </span>
      </h1>
    </div>

    <div className="mb-12">
      <p className="text-lg md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
        Digital services built to improve how customers see your brand online.
      </p>
    </div>

          <div className="flex gap-6 justify-center flex-wrap">
            <button
              onClick={handleDiscoverClick}
              className="group relative px-12 py-4 rounded-full bg-transparent border-2 border-cyan-400/50 text-white font-semibold text-lg overflow-hidden transition-all duration-500 hover:scale-105 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/25 backdrop-blur-sm"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span>Discover</span>
                <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid with Original Gradient */}
      <section 
        ref={servicesGridRef} 
        className="relative py-32 overflow-hidden"
        style={{
          background: `linear-gradient(
            180deg,
            #000005 0%,
            #040a16 12%,
            #070f1f 25%,
            #0a1528 40%,
            #0a1528 60%,
            #070f1f 75%,
            #040a16 88%,
            #000005 100%
          )`,
          position: 'relative'
        }}
      >
        {/* Subtle overlay for enhanced depth */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at top, rgba(13, 26, 48, 0.3) 0%, transparent 60%)',
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          {/* Section Header */}
          <div className="mb-24 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
              What We Offer
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
              Comprehensive solutions designed to elevate your digital presence
            </p>
          </div>

          {/* Two-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
            {servicesList.map((service, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`minimal-service-item group relative py-8 border-t border-gray-700 ${ServicesStyles.minimalServiceItem}`}
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 text-5xl font-extrabold bg-gradient-to-br from-[#67E8F9] via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent transition-all duration-500 min-w-[60px]">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-[#67E8F9] via-[#60A5FA] to-[#3B82F6] bg-clip-text text-transparent mb-3 tracking-tight">
                      {service.title}
                    </h3>
                    <div className="minimal-line w-0 h-px bg-white mb-4 transition-all duration-700 group-hover:w-16"></div>
                    <p className="text-gray-300 leading-relaxed font-light text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Showcase Section */}
      <section className="relative py-[120px] overflow-hidden" style={{ backgroundColor: '#031521' }}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          
{/* Featured Service */}
<div className={`reveal-up mb-32 ${ServicesStyles.revealUp}`}>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

    {/* LEFT: Text Area */}
    <div>
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] text-[#d7d7d7] text-xs uppercase tracking-wider mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00c2b3]"></span>
        Featured Service
      </div>

      <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 leading-tight">
        Website Development
      </h2>

      <p className="text-lg md:text-xl text-[#bdbdbd] mb-8 leading-relaxed">
        Developing digital experiences that are as beautiful as they are functional.
      </p>

      <button
        className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-white/12 text-white transition-all duration-300 hover:bg-white/95 hover:text-[#2a2a2a] hover:-translate-y-1"
        onClick={() => onNavigate('portfolio')}
      >
        <span>Explore Projects</span>
        <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
      </button>
    </div>

    {/* RIGHT: Image (appears last on mobile automatically) */}
    <div className="services-visual">
      <div className="relative">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#333333]/50 backdrop-blur-sm">
          <img
            src="/pic.png"
            alt="Website development demo"
            className="w-full h-[400px] object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
</div>

{/* Typography Hero - Hidden on mobile, shown on md and above */}
<div className={`reveal-up mb-24 md:mb-32 ${ServicesStyles.revealUp} hidden md:block`}>
  <div className="relative max-w-5xl">
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] md:leading-[0.98] tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#E6F4FF] via-[#A1D8FF] to-[#3F8BFF]
    ">
      Accelerate results,<br />
      Simplify operations,<br />
      Reclaim your time for<br />
      What truly grows your<br />
      business online from an<br />
      Idea to a custom Website.
    </h2>
  </div>
</div>

    {/* Third Row - Newly Added */}
    <div className="reveal-up showcase-row">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column - Text */}
        <div className="showcase-text">
          <div className="badge-pill inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] text-[#d7d7d7] text-xs uppercase tracking-wider mb-6 badge-pulse badge-new">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00c2b3] badge-dot-pulse"></span>
            Newly Added
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-6xl font-black text-white mb-6 leading-tight gradient-text-reveal">
            AI Agents & Chatbot Integration
          </h2>
          <p className="text-lg md:text-xl text-[#bdbdbd] mb-8 leading-relaxed text-fade-in">
            We design AI Agents for natural user interaction, paired with a reasoning agent that plans and executes tasks, making your daily work simpler and more efficient.
          </p>
          <button
            className="cta-outline group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-white/12 text-white transition-all duration-300 hover:bg-white/95 hover:text-[#2a2a2a] hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.6)] focus:outline-none focus:ring-2 focus:ring-[#00c2b3] focus:ring-offset-4 focus:ring-offset-[#2a2a2a] cta-enhanced"
            onClick={() => onNavigate('portfolio')}
          >
            <span>Explore Projects</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>

        {/* Right Column - Visual */}
        <div className="services-visual">
          <div className="relative showcase-image-wrapper">
            {/* Glow effect layers */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 image-glow"></div>

            {/* Main image container with glass effect */}
            <div className="relative overflow-hidden rounded-3xl glass-card border border-white/10 bg-[#333333]/50 backdrop-blur-sm">
              <img
                src="/ai.png"
                alt="AI Chatbot demo"
                className="w-full h-[500px] object-cover"
              />
              {/* Overlay gradient animation */}
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

              {/* Shimmer effect on hover */}
              <div className="shimmer-overlay"></div>

              {/* AI pulse indicator */}
              <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full ai-badge">
                <span className="w-2 h-2 rounded-full bg-emerald-400 ai-pulse"></span>
                <span className="text-white text-xs font-semibold">AI Powered</span>
              </div>
            </div>

            {/* Decorative corner accents */}
            <div className="corner-accent corner-accent-tl"></div>
            <div className="corner-accent corner-accent-br"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Enhanced Modern Animation Styles */}
      <style jsx>{`
        /* ============================================
           SERVICES GRADIENT SECTION - PREMIUM STYLING
           ============================================ */

        /* Premium gradient background from "What We Offer" section to page end */
        .services-gradient-section {
          background: linear-gradient(
            180deg,
    #000005 0%,
    #040a16 12%,
    #070f1f 25%,
    #0a1528 40%,
    #0a1528 60%,
    #070f1f 75%,
    #040a16 88%,
    #000005 100%
          );
          position: relative;
        }

        /* Inter font family for all "What We Offer" section text */
        .services-section-title,
        .services-section-text,
        .minimal-service-item h3,
        .minimal-service-item p,
        .minimal-service-item > div {
          font-family: 'Inter', 'DM Sans', sans-serif;
        }

        /* Enhanced text rendering for premium appearance */
        .services-gradient-section * {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Subtle overlay for enhanced depth */
        .services-gradient-section::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse at top,
            rgba(13, 26, 48, 0.3) 0%,
            transparent 60%
          );
          pointer-events: none;
          z-index: 1;
        }

        /* Ensure content is above overlay */
        .services-gradient-section > div {
          position: relative;
          z-index: 2;
        }

        /* ============================================
           MINIMALIST GALLERY ANIMATIONS
           ============================================ */

        /* Service item reveal animation */
        @keyframes service-reveal {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes number-slide {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes line-expand {
          from {
            width: 0;
          }
          to {
            width: 4rem;
          }
        }

        /* Base state - hidden */
        .minimal-service-item {
          opacity: 0;
          transform: translateY(40px);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Revealed state */
        .minimal-service-item.service-visible {
          animation: service-reveal 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* Number animation when visible */
        .minimal-service-item.service-visible > div:first-child {
          animation: number-slide 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Line expansion on reveal */
        .minimal-service-item.service-visible .minimal-line {
          animation: line-expand 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
        }

        /* Stagger delays for sequential animation */
        .minimal-service-item:nth-child(1) { animation-delay: 0s; }
        .minimal-service-item:nth-child(2) { animation-delay: 0.1s; }
        .minimal-service-item:nth-child(3) { animation-delay: 0.2s; }
        .minimal-service-item:nth-child(4) { animation-delay: 0.3s; }
        .minimal-service-item:nth-child(5) { animation-delay: 0.4s; }
        .minimal-service-item:nth-child(6) { animation-delay: 0.5s; }
        .minimal-service-item:nth-child(7) { animation-delay: 0s; }
        .minimal-service-item:nth-child(8) { animation-delay: 0.1s; }
        .minimal-service-item:nth-child(9) { animation-delay: 0.2s; }
        .minimal-service-item:nth-child(10) { animation-delay: 0.3s; }
        .minimal-service-item:nth-child(11) { animation-delay: 0.4s; }
        .minimal-service-item:nth-child(12) { animation-delay: 0.5s; }

        /* Focus state for accessibility */
        .minimal-service-item:focus-within {
          outline: 2px solid black;
          outline-offset: 8px;
        }

        /* Typography refinements */
        .minimal-service-item h3 {
          font-family: 'Space Grotesk', 'DM Sans', sans-serif;
          letter-spacing: -0.02em;
        }

        .minimal-service-item p {
          c
          line-height: 1.7;
          max-width: 90%;
        }

        /* Smooth easing for all transitions */
        .minimal-service-item * {
          transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Mobile optimizations */
        @media (max-width: 1024px) {
          .minimal-service-item {
            padding-left: 0;
          }

          .minimal-service-item > div:first-child {
            font-size: 4rem;
            left: -0.5rem;
          }

          .minimal-service-item .pl-24 {
            padding-left: 5rem;
          }

          .minimal-service-item:hover .pl-24,
          .minimal-service-item.group:hover > div:last-child {
            padding-left: 5.5rem;
          }
        }

        @media (max-width: 640px) {
          .minimal-service-item > div:first-child {
            font-size: 3rem;
            left: 0;
            top: 1rem;
          }

          .minimal-service-item .pl-24 {
            padding-left: 4rem;
          }

          .minimal-service-item:hover .pl-24,
          .minimal-service-item.group:hover > div:last-child {
            padding-left: 4rem;
          }

          .minimal-service-item p {
            max-width: 100%;
          }
        }

        /* ============================================
           KEYFRAME ANIMATIONS
           ============================================ */

        /* Reveal heading animation */
        @keyframes reveal-heading {
          from {
            opacity: 0;
            transform: translateY(30px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .reveal-heading {
          animation: reveal-heading 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        /* Hero text glow animation */
        @keyframes glow-text {
          0%, 100% {
            text-shadow:
              0 0 20px rgba(34, 211, 238, 0.5),
              0 0 40px rgba(34, 211, 238, 0.3),
              0 0 60px rgba(34, 211, 238, 0.2);
          }
          50% {
            text-shadow:
              0 0 30px rgba(34, 211, 238, 0.7),
              0 0 60px rgba(34, 211, 238, 0.5),
              0 0 80px rgba(34, 211, 238, 0.3);
          }
        }

        /* Card entrance animation */
        @keyframes card-fade-in {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        /* Floating orb animation for background */
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.25;
          }
        }

        /* Badge pulse animation */
        @keyframes badge-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 194, 179, 0.4);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(0, 194, 179, 0);
          }
        }

        /* Badge dot pulse */
        @keyframes dot-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        /* Shimmer effect for images */
        @keyframes shimmer {
          0% {
            transform: translateX(-100%) translateY(-100%) rotate(45deg);
          }
          100% {
            transform: translateX(100%) translateY(100%) rotate(45deg);
          }
        }

        /* Glow pulse for typography hero */
        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Text line reveal animation */
        @keyframes text-line-reveal {
          from {
            opacity: 0;
            transform: translateY(20px);
            filter: blur(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        /* Gradient text shimmer */
        @keyframes gradient-shift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        /* Accent line animation */
        @keyframes accent-line-draw {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 100%;
            opacity: 1;
          }
        }

        /* Floating particle animation */
        @keyframes particle-float {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          25% {
            transform: translate(20px, -20px);
            opacity: 0.6;
          }
          50% {
            transform: translate(40px, 0);
            opacity: 0.3;
          }
          75% {
            transform: translate(20px, 20px);
            opacity: 0.6;
          }
        }

        /* Image float animation */
        @keyframes image-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        /* Corner accent animation */
        @keyframes corner-accent-fade {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 0.4;
            transform: scale(1);
          }
        }

        /* AI pulse animation */
        @keyframes ai-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(52, 211, 153, 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(52, 211, 153, 0);
            transform: scale(1.1);
          }
        }

        /* CTA button enhanced animation */
        @keyframes cta-pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 194, 179, 0.4);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(0, 194, 179, 0);
          }
        }

        /* ============================================
           BASE STYLES & UTILITIES
           ============================================ */

        .animate-glow-text {
          animation: glow-text 3s ease-in-out infinite;
        }

        .service-card {
          opacity: 0;
          transform: translateY(30px) scale(0.95);
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .service-card.card-visible {
          animation: card-fade-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Reveal animations for showcase section */
        .reveal-up {
          opacity: 0;
          transform: translateY(18px);
          transition: transform 0.7s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.6s;
        }

        .reveal-up.in-view {
          opacity: 1;
          transform: translateY(0);
        }

        /* ============================================
           FLOATING BACKGROUND ORBS
           ============================================ */

        .floating-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
        }

        .floating-orb-1 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%);
          top: 10%;
          right: 10%;
          animation: float-orb 20s ease-in-out infinite;
        }

        .floating-orb-2 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 70%);
          bottom: 20%;
          left: 5%;
          animation: float-orb 25s ease-in-out infinite 5s;
        }

        .floating-orb-3 {
          width: 250px;
          height: 250px;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.2) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          animation: float-orb 18s ease-in-out infinite 10s;
        }

        /* ============================================
           SHOWCASE ROW ANIMATIONS
           ============================================ */

        .showcase-row.in-view .showcase-text {
          animation: text-line-reveal 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }

        .showcase-row.in-view .showcase-image-wrapper {
          animation: text-line-reveal 1s cubic-bezier(0.2, 0.9, 0.2, 1) 0.3s forwards;
        }

        /* ============================================
           BADGE ANIMATIONS
           ============================================ */

        .badge-pill {
          font-weight: 600;
          letter-spacing: 0.05em;
          position: relative;
        }

        .badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }

        .badge-dot-pulse {
          animation: dot-pulse 1.5s ease-in-out infinite;
        }

        .badge-new {
          background: linear-gradient(135deg, rgba(0, 194, 179, 0.2) 0%, rgba(52, 211, 153, 0.2) 100%);
          border: 1px solid rgba(0, 194, 179, 0.3);
        }

        /* ============================================
           TEXT ANIMATIONS
           ============================================ */

        .gradient-text-reveal {
          background: linear-gradient(90deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: gradient-shift 3s ease-in-out infinite;
        }

        .text-fade-in {
          opacity: 0;
          animation: text-line-reveal 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) 0.4s forwards;
        }

        /* ============================================
           TYPOGRAPHY HERO SECTION
           ============================================ */

        .typography-hero-section .glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }

        .text-hero-animated {
          position: relative;
        }

        .text-line {
          display: inline-block;
          opacity: 0;
        }

        .typography-hero-section.in-view .text-line {
          animation: text-line-reveal 0.8s cubic-bezier(0.2, 0.9, 0.2, 1) forwards;
        }

        /* Accent lines for typography section */
        .accent-line {
          position: absolute;
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(6, 182, 212, 0.6) 50%, transparent 100%);
          opacity: 0;
        }

        .accent-line-1 {
          top: 0;
          left: 0;
          width: 100%;
        }

        .accent-line-2 {
          bottom: 0;
          right: 0;
          width: 100%;
        }

        .typography-hero-section.in-view .accent-line {
          animation: accent-line-draw 1.5s cubic-bezier(0.2, 0.9, 0.2, 1) 0.5s forwards;
        }

        /* Floating particles */
        .hero-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(6, 182, 212, 0.8) 0%, transparent 70%);
          border-radius: 50%;
          opacity: 0;
        }

        .typography-hero-section.in-view .particle {
          animation: particle-float 15s ease-in-out infinite;
        }

        .particle-1 { top: 20%; left: 10%; animation-delay: 0s; }
        .particle-2 { top: 40%; right: 15%; animation-delay: 2s; }
        .particle-3 { bottom: 30%; left: 20%; animation-delay: 4s; }
        .particle-4 { top: 60%; right: 25%; animation-delay: 6s; }
        .particle-5 { bottom: 15%; right: 10%; animation-delay: 8s; }

        /* ============================================
           IMAGE & VISUAL EFFECTS
           ============================================ */

        .showcase-image-wrapper {
          position: relative;
          isolation: isolate;
        }

        /* Glass card effect with backdrop blur */
        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.05);
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transition: all 0.6s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .glass-card:hover {
          border-color: rgba(6, 182, 212, 0.3);
          box-shadow:
            0 30px 80px rgba(0, 0, 0, 0.6),
            0 0 40px rgba(6, 182, 212, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }

        /* Image floating animation */
        .image-float {
          animation: image-float 6s ease-in-out infinite;
          transition: transform 0.45s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .showcase-image-wrapper:hover .image-float {
          animation-play-state: paused;
        }

        /* Shimmer overlay effect */
        .shimmer-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            110deg,
            transparent 0%,
            transparent 40%,
            rgba(255, 255, 255, 0.15) 50%,
            transparent 60%,
            transparent 100%
          );
          transform: translateX(-100%) translateY(-100%) rotate(45deg);
          transition: opacity 0.3s;
          pointer-events: none;
        }

        .glass-card:hover .shimmer-overlay {
          animation: shimmer 2s ease-in-out;
        }

        /* Corner accent decorations */
        .corner-accent {
          position: absolute;
          width: 40px;
          height: 40px;
          opacity: 0;
          pointer-events: none;
        }

        .corner-accent-tl {
          top: -10px;
          left: -10px;
          border-top: 2px solid rgba(6, 182, 212, 0.6);
          border-left: 2px solid rgba(6, 182, 212, 0.6);
          border-radius: 8px 0 0 0;
        }

        .corner-accent-br {
          bottom: -10px;
          right: -10px;
          border-bottom: 2px solid rgba(6, 182, 212, 0.6);
          border-right: 2px solid rgba(6, 182, 212, 0.6);
          border-radius: 0 0 8px 0;
        }

        .showcase-image-wrapper:hover .corner-accent {
          animation: corner-accent-fade 0.5s ease-out forwards;
        }

        /* Image glow effect */
        .image-glow {
          transition: opacity 0.7s ease-out;
        }

        .showcase-image-wrapper:hover .image-glow {
          opacity: 1 !important;
        }

        /* ============================================
           AI BADGE EFFECTS
           ============================================ */

        .ai-badge {
          opacity: 0;
          transform: translateY(-10px);
          transition: all 0.5s cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .glass-card:hover .ai-badge {
          opacity: 1;
          transform: translateY(0);
        }

        .ai-pulse {
          animation: ai-pulse 2s ease-in-out infinite;
        }

        /* ============================================
           CTA BUTTON ENHANCEMENTS
           ============================================ */

        .cta-enhanced {
          position: relative;
          overflow: hidden;
        }

        .cta-enhanced::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .cta-enhanced:hover::before {
          opacity: 1;
        }

        .cta-enhanced:active {
          animation: cta-pulse 0.6s ease-out;
        }

        /* ============================================
           DISPLAY HERO TYPOGRAPHY
           ============================================ */

        .display-hero {
          word-break: keep-all;
        }

        /* Radial gradient utility */
        .bg-gradient-radial {
          background: radial-gradient(ellipse at center, var(--tw-gradient-stops));
        }

        /* Services visual hover effects */
        .services-visual img {
          cursor: pointer;
        }

        /* ============================================
           ACCESSIBILITY - REDUCED MOTION
           ============================================ */

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .minimal-service-item {
            opacity: 1;
            transform: none;
            animation: none !important;
          }

          .minimal-service-item.service-visible {
            animation: none !important;
          }

          .minimal-service-item.service-visible > div:first-child {
            animation: none !important;
          }

          .minimal-service-item.service-visible .minimal-line {
            animation: none !important;
            width: 4rem;
          }

          .reveal-up {
            transform: none;
            opacity: 1;
            transition: none;
          }

          .floating-orb,
          .particle,
          .image-float,
          .shimmer-overlay {
            animation: none !important;
          }
        }

        /* ============================================
           RESPONSIVE BREAKPOINTS
           ============================================ */

        @media (max-width: 1024px) {
          .grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .display-hero {
            font-size: 3rem;
            line-height: 1.1;
          }

          .floating-orb {
            opacity: 0.5;
          }

          .floating-orb-1 { width: 200px; height: 200px; }
          .floating-orb-2 { width: 250px; height: 250px; }
          .floating-orb-3 { width: 150px; height: 150px; }
        }

        @media (max-width: 640px) {
          .grid {
            grid-template-columns: repeat(1, 1fr);
          }

          .display-hero {
            font-size: 2rem;
            line-height: 1.15;
            text-align: center;
          }

          #services-showcase-2 {
            padding: 60px 0;
          }

          .reveal-up {
            margin-bottom: 60px !important;
          }

          .floating-orb {
            display: none;
          }

          .hero-particles {
            display: none;
          }

          .glass-card {
            backdrop-filter: blur(5px);
          }

          .corner-accent {
            display: none;
          }
        }

        /* Mobile order fixes */
        @media (max-width: 1023px) {
          .services-visual {
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </div>
  );
}