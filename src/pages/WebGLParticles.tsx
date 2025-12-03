'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const WebGLParticles = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number>();

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Performance-optimized renderer settings
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false, // Disabled for performance
      powerPreference: 'default',
      precision: 'mediump', // Balanced precision
      failIfMajorPerformanceCaveat: true // Don't render if performance is bad
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Use device pixel ratio but cap at 2 for performance
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    mountRef.current.appendChild(renderer.domElement);

    // Fixed particle count: 3000
    const particleCount = 3000;
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

    // Pre-calculate all random values to avoid Math.random in animation loop
    const randoms = new Float32Array(particleCount * 4);
    for (let i = 0; i < randoms.length; i++) {
      randoms[i] = Math.random();
    }

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      const rIdx = i * 4;
      
      // Spherical distribution with optimized math
      const radius = 8 + randoms[rIdx] * 10; // Smaller radius for performance
      const theta = randoms[rIdx + 1] * Math.PI * 2;
      const phi = Math.acos(2 * randoms[rIdx + 2] - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Random color from palette using pre-calculated random
      const colorIdx = Math.floor(randoms[rIdx + 3] * colorPalette.length);
      const color = colorPalette[colorIdx];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = randoms[rIdx] * 1.2 + 0.5; // Smaller sizes

      // Reduced velocities for calmer animation
      velocities[i3] = (randoms[rIdx] - 0.5) * 0.015;
      velocities[i3 + 1] = (randoms[rIdx + 1] - 0.5) * 0.015;
      velocities[i3 + 2] = (randoms[rIdx + 2] - 0.5) * 0.015;
    }

    // Geometry setup
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Optimized material settings
    const material = new THREE.PointsMaterial({
      size: 0.04, // Slightly smaller
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false,
      depthTest: true,
      fog: false // Disable fog for performance
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Simplified mouse interaction
    const mouse = new THREE.Vector2(0, 0);
    let mouseActive = false;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseActive = true;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation setup
    camera.position.z = 22;
    const clock = new THREE.Clock();
    
    // Frame rate limiting for consistent performance
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    // Pre-allocate vectors for reuse
    const tempVector = new THREE.Vector3();
    const mouseVector = new THREE.Vector3();

    const animate = (currentTime: DOMHighResTimeStamp) => {
      frameRef.current = requestAnimationFrame(animate);

      // Basic frame rate limiting
      const deltaTime = currentTime - lastTime;
      if (deltaTime < frameInterval) {
        return;
      }
      lastTime = currentTime - (deltaTime % frameInterval);

      const elapsedTime = clock.getElapsedTime();
      const positionsArray = geometry.attributes.position.array as Float32Array;

      // Optimized wave calculation (single frequency for all particles)
      const baseWaveTime = elapsedTime * 0.25;

      // Update particles
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Simple wave motion (much cheaper to compute)
        const wave = Math.sin(baseWaveTime + positionsArray[i3] * 0.05) * 0.005;
        
        positionsArray[i3] += velocities[i3] + wave;
        positionsArray[i3 + 1] += velocities[i3 + 1] + wave;
        positionsArray[i3 + 2] += velocities[i3 + 2] + wave * 0.5;

        // Mouse interaction (only when mouse has moved recently)
        if (mouseActive) {
          tempVector.set(positionsArray[i3], positionsArray[i3 + 1], positionsArray[i3 + 2]);
          mouseVector.set(mouse.x * 20, mouse.y * 20, 0);
          const distanceToMouse = tempVector.distanceTo(mouseVector);

          if (distanceToMouse < 10) {
            const force = (10 - distanceToMouse) / 10 * 0.06;
            tempVector.sub(mouseVector).normalize().multiplyScalar(-force);
            positionsArray[i3] += tempVector.x;
            positionsArray[i3 + 1] += tempVector.y;
            positionsArray[i3 + 2] += tempVector.z;
          }
        }

        // Optimized boundary check with damping
        const boundary = 20;
        if (Math.abs(positionsArray[i3]) > boundary) {
          velocities[i3] *= -0.95;
          positionsArray[i3] = Math.sign(positionsArray[i3]) * boundary * 0.98;
        }
        if (Math.abs(positionsArray[i3 + 1]) > boundary) {
          velocities[i3 + 1] *= -0.95;
          positionsArray[i3 + 1] = Math.sign(positionsArray[i3 + 1]) * boundary * 0.98;
        }
        if (Math.abs(positionsArray[i3 + 2]) > boundary) {
          velocities[i3 + 2] *= -0.95;
          positionsArray[i3 + 2] = Math.sign(positionsArray[i3 + 2]) * boundary * 0.98;
        }
      }

      geometry.attributes.position.needsUpdate = true;

      // Slower, smoother rotation
      particles.rotation.x = elapsedTime * 0.02;
      particles.rotation.y = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate(0);

    // Debounced resize handler
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

export default WebGLParticles;