'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import WebGLParticles from './WebGLParticles';
import ServicesStyles from './Services.module.css'; // We'll move CSS to separate file

interface ServicesProps {
  onNavigate: (section: string) => void;
}

export default function Services({ onNavigate }: ServicesProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const servicesGridRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const imageTiltRef = useRef<boolean>(false);
  
  const handleDiscoverClick = useCallback(() => {
    servicesGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // **FIXED: SINGLE Intersection Observer for ALL reveal animations**
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

    // Observe all reveal elements at once
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

  // **FIXED: Optimized image tilt effect with event delegation**
  useEffect(() => {
    // Only run on non-mobile devices
    if (window.innerWidth < 768) return;
    
    let animationFrameId: number;
    
    const handleMouseMove = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement;
      if (!target.closest('.services-visual img')) return;
      
      // Throttle with requestAnimationFrame
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

    // Use event delegation on the document instead of adding to each image
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
      description: 'Crafted pixel-perfect designs that reflect your brand identity.',
    },
    {
      title: 'Full-Stack Web Development',
      description: 'Building robust, scalable web apps with cutting-edge technologies.',
    },
    {
      title: 'AI-Powered Chatbots',
      description: 'Intelligent conversational AI that engages customers 24/7.',
    },
    {
      title: 'Social Media Management',
      description: 'Strategic social media campaigns that build communities.',
    },
    {
      title: 'Brand Identity & Visual Design',
      description: 'Comprehensive brand development from concept to execution.',
    },
    {
      title: 'Social Media & Digital Advertising',
      description: 'High-converting ad campaigns across social platforms.',
    },
    {
      title: 'SEO Optimization & Growth Strategy',
      description: 'Comprehensive SEO solutions that boost your search rankings.',
    },
    {
      title: 'AI Automation Agents',
      description: 'Custom AI-powered automation that streamlines workflows.',
    },
    {
      title: 'Mobile App Design & Development',
      description: 'Native and cross-platform mobile applications.',
    },
    {
      title: 'Marketing Audit & Strategic Planning',
      description: 'In-depth analysis of your marketing performance.',
    },
    {
      title: 'E-Commerce Store Development',
      description: 'Complete e-commerce solutions built for conversions.',
    },
    {
      title: 'Content Creation & Copywriting',
      description: 'Compelling content that resonates with your audience.',
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

        <div className={`relative z-10 max-w-6xl mx-auto px-6 text-center transition-all duration-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                Explore Our Services
              </span>
            </h1>
          </div>

          <div className="mb-12">
            <p className="text-xl md:text-2xl text-gray-300 font-light max-w-3xl mx-auto leading-relaxed">
              Crafting digital excellence through innovative solutions
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

      {/* Services Grid - SIMPLIFIED */}
      <section ref={servicesGridRef} className="relative py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="mb-24 text-center">
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight">
              What We Offer
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto font-light">
              Comprehensive solutions designed to elevate your digital presence
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8">
            {servicesList.map((service, index) => (
              <div
                key={index}
                ref={(el) => {
                  cardsRef.current[index] = el;
                }}
                className="minimal-service-item group relative py-8 border-t border-gray-700"
              >
                <div className="flex gap-6 items-start">
                  <div className="flex-shrink-0 text-5xl font-bold text-gray-400 transition-all duration-500 group-hover:text-gray-300 min-w-[60px]">
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
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

      {/* Services Showcase Section - SIMPLIFIED */}
      <section className="relative py-[120px] overflow-hidden bg-[#031521]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 relative z-10">
          
          {/* Featured Service */}
          <div className="reveal-up mb-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div className="order-2 lg:order-1">
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

              <div className="services-visual order-1 lg:order-2">
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

          {/* Typography Hero - SIMPLIFIED */}
          <div className="reveal-up mb-32">
            <div className="relative max-w-5xl">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.98] tracking-tight text-white">
                Accelerate results,<br />
                Simplify operations,<br />
                Reclaim your time for<br />
                What truly grows your<br />
                business online from an<br />
                Idea to a custom Website.
              </h2>
            </div>
          </div>

          {/* AI Section */}
          <div className="reveal-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#333333] text-[#d7d7d7] text-xs uppercase tracking-wider mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00c2b3]"></span>
                  Newly Added
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-6xl font-black text-white mb-6 leading-tight">
                  AI Agents & Chatbot Integration
                </h2>
                <p className="text-lg md:text-xl text-[#bdbdbd] mb-8 leading-relaxed">
                  We design AI Agents for natural user interaction, paired with a reasoning agent that plans and executes tasks.
                </p>
                <button
                  className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full border-[1.5px] border-white/12 text-white transition-all duration-300 hover:bg-white/95 hover:text-[#2a2a2a] hover:-translate-y-1"
                  onClick={() => onNavigate('portfolio')}
                >
                  <span>Explore Projects</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>

              <div className="services-visual">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#333333]/50 backdrop-blur-sm">
                    <img
                      src="/ai.png"
                      alt="AI Chatbot demo"
                      className="w-full h-[400px] object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}