'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WebGLParticles = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      // More accurate mobile detection including tablets
      const isMobileDevice = window.innerWidth < 768 || 
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return;

    // Detect mobile/tablet devices
    const isSmallDevice = window.innerWidth < 1024; // Includes tablets
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isMobileDevice = isSmallDevice || isTouchDevice;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Adjust camera FOV for mobile
    const camera = new THREE.PerspectiveCamera(
      isMobileDevice ? 60 : 75, // Smaller FOV on mobile
      window.innerWidth / window.innerHeight, 
      0.1, 
      isMobileDevice ? 500 : 1000 // Shorter far plane on mobile
    );

    // Enhanced mobile optimizations
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobileDevice,
      powerPreference: isMobileDevice ? 'low-power' : 'default',
      precision: isMobileDevice ? 'lowp' : 'highp', // Lower precision on mobile
      failIfMajorPerformanceCaveat: true, // Don't render if performance is bad
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // More aggressive pixel ratio reduction on mobile
    const pixelRatio = isMobileDevice ? 
      Math.min(window.devicePixelRatio, 1.0) : // Max 1x on mobile
      window.devicePixelRatio;
    renderer.setPixelRatio(pixelRatio);

    mountRef.current.appendChild(renderer.domElement);

    // Optimized particle counts: 3000 for desktop, 300 for mobile
    const particleCount = isMobileDevice ? 300 : 3000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    const colorPalette = [
      new THREE.Color(0x3b82f6), // blue-500
      new THREE.Color(0x60a5fa), // blue-400
      new THREE.Color(0x93c5fd), // blue-300
      new THREE.Color(0x8b5cf6), // violet-500
      new THREE.Color(0xa855f7), // violet-400
      new THREE.Color(0xc084fc), // violet-300
    ];

    // Pre-calculate random values for better performance
    const randoms = new Float32Array(particleCount * 6);
    for (let i = 0; i < particleCount * 6; i++) {
      randoms[i] = Math.random();
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const rIdx = i * 6;
      
      // Optimized spherical distribution
      const radius = isMobileDevice ? 
        (5 + randoms[rIdx] * 8) : // Smaller radius on mobile
        (8 + randoms[rIdx] * 12);
      
      const theta = randoms[rIdx + 1] * Math.PI * 2;
      const phi = Math.acos(2 * randoms[rIdx + 2] - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random color from palette (using pre-calculated random)
      const colorIdx = Math.floor(randoms[rIdx + 3] * colorPalette.length);
      const color = colorPalette[colorIdx];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = randoms[rIdx + 4] * 1.5 + 0.5; // Slightly smaller particles

      // Random velocities (slower on mobile)
      const velocityScale = isMobileDevice ? 0.01 : 0.02;
      velocities[i3] = (randoms[rIdx + 5] - 0.5) * velocityScale;
      velocities[i3 + 1] = (randoms[rIdx] - 0.5) * velocityScale;
      velocities[i3 + 2] = (randoms[rIdx + 1] - 0.5) * velocityScale;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // More optimized material for mobile
    const material = new THREE.PointsMaterial({
      size: isMobileDevice ? 0.04 : 0.05, // Smaller on mobile
      vertexColors: true,
      transparent: true,
      opacity: isMobileDevice ? 0.6 : 0.8, // Lower opacity on mobile
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      depthTest: !isMobileDevice,
      fog: false, // Disable fog for performance
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction (disabled on mobile for performance)
    const mouse = new THREE.Vector2(0, 0);
    let mouseMoved = false;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!isMobileDevice) {
        mouseMoved = true;
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      }
    };

    if (!isMobileDevice) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Animation setup
    camera.position.z = isMobileDevice ? 20 : 25; // Closer on mobile
    
    // Use requestAnimationFrame timing for better performance
    let lastTime = 0;
    const clock = new THREE.Clock();
    
    // More aggressive frame rate limiting on mobile
    const targetFPS = isMobileDevice ? 24 : 60; // 24 FPS on mobile
    const frameInterval = 1000 / targetFPS;

    // Pre-allocate vectors for reuse (prevents garbage collection)
    const tempVector = new THREE.Vector3();
    const mouseVector = new THREE.Vector3();

    const animate = (currentTime: DOMHighResTimeStamp) => {
      frameRef.current = requestAnimationFrame(animate);

      // Frame rate limiting
      const deltaTime = currentTime - lastTime;
      if (isMobileDevice && deltaTime < frameInterval) {
        return;
      }
      lastTime = currentTime - (deltaTime % frameInterval);

      const elapsedTime = clock.getElapsedTime();
      const positionsArray = geometry.attributes.position.array as Float32Array;

      // Calculate wave once and reuse for all particles on mobile
      let baseWave = 0;
      if (isMobileDevice) {
        baseWave = Math.sin(elapsedTime * 0.3) * 0.005;
      }

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        if (isMobileDevice) {
          // Ultra-simple motion for mobile
          positionsArray[i3] += velocities[i3] + baseWave;
          positionsArray[i3 + 1] += velocities[i3 + 1] + baseWave;
          positionsArray[i3 + 2] += velocities[i3 + 2] + baseWave * 0.5;
        } else {
          // Desktop: Full wave motion
          const wave1 = Math.sin(elapsedTime * 0.3 + positionsArray[i3] * 0.08);
          const wave2 = Math.cos(elapsedTime * 0.4 + positionsArray[i3 + 1] * 0.08);
          const wave3 = Math.sin(elapsedTime * 0.5 + positionsArray[i3 + 2] * 0.08);

          positionsArray[i3] += velocities[i3] + wave1 * 0.008;
          positionsArray[i3 + 1] += velocities[i3 + 1] + wave2 * 0.008;
          positionsArray[i3 + 2] += velocities[i3 + 2] + wave3 * 0.004;
        }

        // Mouse interaction - only on desktop after mouse has moved
        if (!isMobileDevice && mouseMoved) {
          tempVector.set(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
          mouseVector.set(mouse.x * 25, mouse.y * 25, 0);
          const distanceToMouse = tempVector.distanceTo(mouseVector);

          if (distanceToMouse < 12) {
            const force = (12 - distanceToMouse) / 12 * 0.08;
            tempVector.sub(mouseVector).normalize().multiplyScalar(-force);
            positionsArray[i3] += tempVector.x;
            positionsArray[i3 + 1] += tempVector.y;
            positionsArray[i3 + 2] += tempVector.z;
          }
        }

        // Optimized boundary check
        const boundary = 22;
        if (Math.abs(positionsArray[i3]) > boundary) {
          velocities[i3] *= -0.9; // Add damping
          positionsArray[i3] = Math.sign(positionsArray[i3]) * boundary * 0.95;
        }
        if (Math.abs(positionsArray[i3 + 1]) > boundary) {
          velocities[i3 + 1] *= -0.9;
          positionsArray[i3 + 1] = Math.sign(positionsArray[i3 + 1]) * boundary * 0.95;
        }
        if (Math.abs(positionsArray[i3 + 2]) > boundary) {
          velocities[i3 + 2] *= -0.9;
          positionsArray[i3 + 2] = Math.sign(positionsArray[i3 + 2]) * boundary * 0.95;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Smoother, slower rotation
      const rotationSpeed = isMobileDevice ? 0.3 : 0.7;
      particles.rotation.x = elapsedTime * 0.02 * rotationSpeed;
      particles.rotation.y = elapsedTime * 0.015 * rotationSpeed;

      renderer.render(scene, camera);
    };

    animate(0);

    // Handle resize with debouncing
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 100);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (!isMobileDevice) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
      
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose everything
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      
      // Clear Three.js cache
      if (typeof THREE !== 'undefined') {
        THREE.Cache.clear();
      }
    };
  }, [isMobile]);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default WebGLParticles;