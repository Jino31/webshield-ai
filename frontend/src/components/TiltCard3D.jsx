import React, { useState, useRef, useEffect } from 'react';

/**
 * TiltCard3D
 * Wraps any card or section in an interactive 3D physics container.
 * Features:
 * - Dynamic cursor 3D tilt (rotateX, rotateY)
 * - Scroll-velocity pitch response (reacts while scrolling)
 * - Holographic specular glare highlight
 * - Nested 3D depth preserve-3d
 */
export default function TiltCard3D({ 
  children, 
  className = '', 
  maxTilt = 10, 
  glare = true,
  scale = 1.02,
  depth = 30,
  ...props 
}) {
  const cardRef = useRef(null);
  const [transformStyle, setTransformStyle] = useState('');
  const [glareStyle, setGlareStyle] = useState({ opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Scroll reaction
  useEffect(() => {
    let lastY = window.scrollY || window.pageYOffset || 0;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY || window.pageYOffset || 0;
          const deltaY = currentY - lastY;
          lastY = currentY;

          // If not actively hovered, apply subtle scroll pitch
          if (!isHovered && cardRef.current) {
            const scrollPitch = Math.max(-5, Math.min(5, deltaY * 0.12));
            setTransformStyle(`perspective(1000px) rotateX(${-scrollPitch}deg) translateZ(0)`);
            
            // Auto return to level after scroll settles
            clearTimeout(cardRef.current._scrollTimer);
            cardRef.current._scrollTimer = setTimeout(() => {
              if (!isHovered) {
                setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)');
              }
            }, 180);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isHovered]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const percentX = (x - centerX) / centerX;
    const percentY = (y - centerY) / centerY;

    const rotX = -percentY * maxTilt;
    const rotY = percentX * maxTilt;

    setTransformStyle(
      `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) scale3d(${scale}, ${scale}, ${scale}) translateZ(${depth}px)`
    );

    if (glare) {
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      setGlareStyle({
        opacity: 0.22,
        background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.45) 0%, rgba(139, 92, 246, 0.15) 45%, transparent 70%)`
      });
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1) translateZ(0)');
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
        transition: isHovered 
          ? 'transform 0.1s ease-out' 
          : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
        willChange: 'transform'
      }}
      className={`relative group ${className}`}
      {...props}
    >
      {/* 3D Specular Light Glare Overlay */}
      {glare && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300 z-30"
          style={{
            ...glareStyle,
            mixBlendMode: 'overlay'
          }}
        />
      )}

      {/* Content Container with 3D Depth support */}
      <div className="relative z-10 w-full h-full [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}