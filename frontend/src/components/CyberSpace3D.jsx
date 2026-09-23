import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function CyberSpace3D() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Physics & Interaction States for Scroll & Swipe
    let targetScrollY = window.scrollY || window.pageYOffset || 0;
    let currentScrollY = targetScrollY;
    let scrollVelocity = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    let touchStartY = 0;
    let touchVelocity = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const deltaY = e.touches[0].clientY - touchStartY;
        touchVelocity = deltaY * 0.05;
        targetScrollY -= touchVelocity;
        touchStartY = e.touches[0].clientY;
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // Upgraded 3D Threat-Node Matrix Particles
    const NODE_COUNT = 75;
    const nodes = [];
    const WORLD_DEPTH = 1800;

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * width * 2.5,
        y: (Math.random() - 0.5) * height * 2.5,
        z: Math.random() * WORLD_DEPTH,
        size: Math.random() * 2.5 + 1,
        type: i % 4 === 0 ? 'threat' : i % 3 === 0 ? 'shield' : 'data',
        speed: Math.random() * 0.5 + 0.4
      });
    }

    let tick = 0;

    const render = () => {
      tick++;
      mouseX += (targetMouseX - mouseX) * 0.07;
      mouseY += (targetMouseY - mouseY) * 0.07;

      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      scrollVelocity = currentScrollY - prevScrollY;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouseX * 40;
      const cy = height / 2 + mouseY * 30;

      // Render Dynamic Depth Nodes
      nodes.forEach((node) => {
        node.z -= (scrollVelocity * 0.6 + node.speed + 0.3);
        if (node.z < 20) node.z += WORLD_DEPTH;
        if (node.z > WORLD_DEPTH) node.z -= WORLD_DEPTH;

        const scale = 500 / node.z;
        const px = cx + node.x * scale;
        const py = cy + (node.y + Math.sin(tick * 0.02 + node.z) * 20) * scale;

        if (node.z > 10 && node.z < WORLD_DEPTH && px >= 0 && px <= width && py >= 0 && py <= height) {
          const depthRatio = 1 - node.z / WORLD_DEPTH;
          const radius = Math.max(1, node.size * scale * 1.4);
          const alpha = depthRatio * (isDark ? 0.8 : 0.5);

          ctx.save();
          if (node.type === 'threat') {
            ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`;
            ctx.shadowColor = '#EC4899';
          } else if (node.type === 'shield') {
            ctx.fillStyle = `rgba(16, 185, 129, ${alpha})`;
            ctx.shadowColor = '#10B981';
          } else {
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`;
            ctx.shadowColor = '#8B5CF6';
          }

          ctx.shadowBlur = 6;
          ctx.beginPath();
          ctx.arc(px, py, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block opacity-95 transition-opacity duration-700" />
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        isDark ? 'bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0F_95%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,#F8FAFC_95%)]'
      }`} />
    </div>
  );
}