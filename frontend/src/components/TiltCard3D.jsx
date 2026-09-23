import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * TiltCard3D v2.0 - Enterprise Edition
 * Features:
 * - Damped Spring Physics & Mouse Parallax Interpolation (Lerp)
 * - Dynamic Mobile Gyroscope / DeviceOrientation Support
 * - Holographic Specular Glare & Multi-layer Depth Projection
 */
export default function TiltCard3D({ 
  children, 
  className = '', 
  maxTilt = 12, 
  glare = true,
  scale = 1.03,
  depth = 40,
  enableGyro = true,
  ...props 
}) {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  
  // Physics & Animation Refs for high-performance 60fps interpolation
  const mousePos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });
  const animFrameId = useRef(null);

  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [transformStyle, setTransformStyle] = useState('');

  // Smooth interpolation loop (Lerp) for buttery 60fps physics
  const updatePhysics = useCallback(() => {
    // Lerp factor (0.1 = smooth & responsive damping)
    mousePos.current.x += (targetPos.current.x - mousePos.current.x) * 0.12;
    mousePos.current.y += (targetPos.current.y - mousePos.current.y) * 0.12;

    const rotX = -mousePos.current.y * maxTilt;
    const rotY = mousePos.current.x * maxTilt;

    currentRot.current.x += (rotX - currentRot.current.x) * 0.2;
    currentRot.current.y += (rotY - currentRot.current.y) * 0.2;

    if (cardRef.current) {
      const activeScale = isHovered ? scale : 1;
      const activeDepth = isHovered ? depth : 0;
      setTransformStyle(
        `perspective(1000px) rotateX(${currentRot.current.x.toFixed(2)}deg) rotateY(${currentRot.current.y.toFixed(2)}deg) scale3d(${activeScale}, ${activeScale}, ${activeScale}) translateZ(${activeDepth}px)`
      );
    }

    animFrameId.current = requestAnimationFrame(updatePhysics);
  }, [isHovered, maxTilt, scale, depth]);

  useEffect(() => {
    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [updatePhysics]);

  // Mobile Gyroscope Integration
  useEffect(() => {
    if (!enableGyro || !window.DeviceOrientationEvent) return;

    const handleOrientation = (e) => {
      if (isHovered) return;
      const tiltX = (e.beta || 0) / 45; // -1 to 1 range approx
      const tiltY = (e.gamma || 0) / 45;
      targetPos.current = {
        x: Math.max(-1, Math.min(1, tiltY)),
        y: Math.max(-1, Math.min(1, tiltX))
      };
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [enableGyro, isHovered]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    targetPos.current = {
      x: (x - centerX) / centerX,
      y: (y - centerY) / centerY
    };

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.28,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.5) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 75%)`
      });
    }
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    targetPos.current = { x: 0, y: 0 };
    setGlareStyle({ opacity: 0 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle || 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)',
        transformStyle: 'preserve-3d',
        willChange: 'transform'
      }}
      className={`relative group cursor-pointer ${className}`}
      {...props}
    >
      {/* Holographic Specular Glare Layer */}
      {glare && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
          style={{ ...glareStyle, mixBlendMode: 'overlay' }}
        />
      )}

      {/* 3D Depth Isolation Layer */}
      <div className="relative z-10 w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}