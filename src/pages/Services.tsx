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
      description: 'Crafted pixel-perfect designs that reflect your brand identity. We create stunning, user-friendly websites that captivate visitors and convert them into loyal customers through strategic visual storytelling.',
    },
    {
      title: 'Full-Stack Web Development',
      description: 'Building robust, scalable web apps with cutting-edge technologies. From front-end interfaces to back-end architecture, we deliver high-performance solutions that grow with your business needs.',
    },
    {
      title: 'AI-Powered Chatbots',
      description: 'Intelligent conversational AI that engages customers 24/7. Our chatbots provide instant support, answer queries, and guide users through seamless experiences while learning from every interaction.',
    },
    {
      title: 'Social Media Management',
      description: 'Strategic social media campaigns that build communities and drive engagement. We manage your presence across platforms, create compelling content, and grow your audience organically.',
    },
    {
      title: 'Brand Identity & Visual Design',
      description: 'Comprehensive brand development from concept to execution. We craft memorable logos, color palettes, and visual systems that establish strong brand recognition and communicate your unique value proposition.',
    },
    {
      title: 'Social Media & Digital Advertising',
      description: 'High-converting ad campaigns across Facebook, Instagram, LinkedIn, and Google. We optimize targeting, creative, and messaging to maximize ROI and deliver measurable results for your marketing investment.',
    },
    {
      title: 'SEO Optimization & Growth Strategy',
      description: 'Comprehensive SEO solutions that boost your search rankings and organic traffic. We implement technical optimizations, content strategies, and link-building campaigns that deliver sustainable growth and visibility.',
    },
    {
      title: 'AI Automation Agents',
      description: 'Custom AI-powered automation that streamlines workflows and increases efficiency. From data processing to customer service, we build intelligent agents that handle repetitive tasks and free up your team.',
    },
    {
      title: 'Mobile App Design & Development',
      description: 'Native and cross-platform mobile applications that deliver exceptional user experiences. We design and develop iOS and Android apps that are intuitive, fast, and aligned with your business objectives.',
    },
    {
      title: 'Marketing Audit & Strategic Planning',
      description: 'In-depth analysis of your marketing performance with actionable recommendations. We identify opportunities, optimize spending, and create comprehensive strategies that align with your business goals and budget.',
    },
    {
      title: 'E-Commerce Store Development',
      description: 'Complete e-commerce solutions built for conversions and scalability. From product catalogs to secure checkout systems, we create online stores that provide seamless shopping experiences and drive revenue.',
    },
    {
      title: 'Content Creation & Copywriting',
      description: 'Compelling content that resonates with your audience and drives action. Our expert writers craft SEO-optimized blog posts, website copy, and marketing materials that establish authority and generate leads.',
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
    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.1] md:leading-[0.98] tracking-tight 
      bg-gradient-to-r from-white via-[#DFF6FF] to-[#AEE5FF] 
      bg-clip-text text-transparent
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

          {/* AI Section */}
          <div className={`reveal-up ${ServicesStyles.revealUp}`}>
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
                  We design AI Agents for natural user interaction, paired with a reasoning agent that plans and executes tasks, making your daily work simpler and more efficient.
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