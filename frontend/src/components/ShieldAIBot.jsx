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
    const width = (canvas.width = 420);
    const height = (canvas.height = 420);
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;

    const render = () => {
      angle += 0.02;
      ctx.clearRect(0, 0, width, height);

      // 1. Outer Threat Radar Pulse Rings
      ctx.save();
      for (let i = 1; i <= 3; i++) {
        const radius = 60 + i * 42;
        ctx.strokeStyle = isDark 
          ? `rgba(139, 92, 246, ${0.12 * i})` 
          : `rgba(139, 92, 246, ${0.08 * i})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Rotating Threat Scanner Beam
      const sweep = angle * 1.2;
      const grad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, 180);
      grad.addColorStop(0, isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(139, 92, 246, 0.2)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 180, sweep, sweep + 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Central Cryptographic Hex Shield Core
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(-angle * 0.6);

      ctx.beginPath();
      const sides = 6;
      const r = 85;
      for (let i = 0; i < sides; i++) {
        const a = (i / sides) * Math.PI * 2;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 20;
      ctx.stroke();
      ctx.restore();

      // 3. Orbiting Threat / Safe Indicator Nodes
      const orbitNodes = 8;
      for (let i = 0; i < orbitNodes; i++) {
        const theta = (i / orbitNodes) * Math.PI * 2 + (angle * (i % 2 === 0 ? 1 : -1));
        const dist = 125 + Math.sin(angle * 2 + i) * 12;
        const nx = centerX + Math.cos(theta) * dist;
        const ny = centerY + Math.sin(theta) * dist;

        ctx.save();
        ctx.fillStyle = i % 3 === 0 ? '#EC4899' : '#10B981'; // Mix of threat pink & safe green
        ctx.shadowColor = i % 3 === 0 ? '#EC4899' : '#10B981';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(nx, ny, i % 3 === 0 ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Core Security Badge Pulse
      const pulse = 28 + Math.sin(angle * 3.5) * 5;
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FAFAFA';
      ctx.font = 'bold 11px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI DEFENSE', centerX, centerY);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDark]);

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[400px] sm:h-[400px] flex items-center justify-center mx-auto select-none pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}