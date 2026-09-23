import React, { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

export default function ShieldCore3D() {
  const canvasRef = useRef(null);
  const { isDark } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    const width = (canvas.width = 400);
    const height = (canvas.height = 400);
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;

    // Generate stable nodes representing security telemetry and firewalls
    const shieldNodes = [];
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
      const theta = (i / nodeCount) * Math.PI * 2;
      shieldNodes.push({
        theta,
        radius: 110 + (i % 2 === 0 ? 20 : -15),
        speed: 0.01 + (i * 0.002),
        size: i % 3 === 0 ? 4 : 2.5
      });
    }

    const render = () => {
      angle += 0.015;
      ctx.clearRect(0, 0, width, height);

      // 1. Outer Scanning Radar Rings
      ctx.save();
      ctx.lineWidth = 1.5;
      for (let r = 1; r <= 3; r++) {
        const ringRadius = 60 + r * 35;
        ctx.strokeStyle = isDark 
          ? `rgba(139, 92, 246, ${0.15 * r})` 
          : `rgba(139, 92, 246, ${0.1 * r})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rotating Radar Sweeper Beam
      const sweepAngle = angle * 1.5;
      const gradient = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 160);
      gradient.addColorStop(0, isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.2)');
      gradient.addColorStop(1, 'transparent');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 160, sweepAngle, sweepAngle + 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Core Security Shield Wireframe Polygon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.5);

      ctx.beginPath();
      const polygonSides = 6; // Hexagonal cryptographic core
      const coreRadius = 75;
      for (let i = 0; i < polygonSides; i++) {
        const a = (i / polygonSides) * Math.PI * 2;
        const x = Math.cos(a) * coreRadius;
        const y = Math.sin(a) * coreRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = isDark ? '#8B5CF6' : '#7C3AED';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 15;
      ctx.stroke();
      ctx.restore();

      // 3. Floating Telemetry Node Particles
      shieldNodes.forEach((node, idx) => {
        const currentTheta = node.theta + angle * node.speed * (idx % 2 === 0 ? 1 : -1);
        const x = centerX + Math.cos(currentTheta) * node.radius;
        const y = centerY + Math.sin(currentTheta) * node.radius;

        // Draw connection beam to center
        ctx.save();
        ctx.strokeStyle = isDark ? 'rgba(236, 72, 153, 0.2)' : 'rgba(236, 72, 153, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.stroke();

        // Draw Node Orb
        ctx.fillStyle = idx % 2 === 0 ? '#EC4899' : '#8B5CF6';
        ctx.shadowColor = idx % 2 === 0 ? '#EC4899' : '#8B5CF6';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(x, y, node.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 4. Inner Glowing Security Emblem Pulse
      const pulseSize = 25 + Math.sin(angle * 3) * 4;
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.15)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FAFAFA';
      ctx.font = 'bold 12px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI SHIELD', centerX, centerY);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] flex items-center justify-center mx-auto select-none pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}