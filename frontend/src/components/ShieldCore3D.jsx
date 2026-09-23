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
    const width = (canvas.width = 440);
    const height = (canvas.height = 440);
    const centerX = width / 2;
    const centerY = height / 2;

    let angle = 0;

    // Neural Threat Matrix Nodes
    const telemetryNodes = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      const theta = (i / count) * Math.PI * 2;
      telemetryNodes.push({
        theta,
        distance: 110 + (i % 3) * 25,
        speed: 0.012 + (i * 0.001),
        type: i % 4 === 0 ? 'malicious' : i % 3 === 0 ? 'suspicious' : 'secure',
        pulseOffset: Math.random() * Math.PI
      });
    }

    const render = () => {
      angle += 0.018;
      ctx.clearRect(0, 0, width, height);

      // 1. Quantum Shield Grid Horizon Rings
      ctx.save();
      for (let i = 1; i <= 3; i++) {
        const ringRadius = 50 + i * 45;
        ctx.strokeStyle = isDark 
          ? `rgba(139, 92, 246, ${0.1 * i})` 
          : `rgba(139, 92, 246, ${0.07 * i})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. High-Speed AI Radar Sweeper Cone
      const sweepAngle = angle * 1.4;
      const coneGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, 190);
      coneGrad.addColorStop(0, isDark ? 'rgba(139, 92, 246, 0.45)' : 'rgba(139, 92, 246, 0.25)');
      coneGrad.addColorStop(0.7, isDark ? 'rgba(236, 72, 153, 0.15)' : 'rgba(236, 72, 153, 0.08)');
      coneGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, 190, sweepAngle, sweepAngle + 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Central Encrypted Core Pentagon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle * 0.4);

      ctx.beginPath();
      const polygonSides = 5;
      const coreRadius = 70;
      for (let i = 0; i < polygonSides; i++) {
        const a = (i / polygonSides) * Math.PI * 2;
        const x = Math.cos(a) * coreRadius;
        const y = Math.sin(a) * coreRadius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#EC4899';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#EC4899';
      ctx.shadowBlur = 18;
      ctx.stroke();
      ctx.restore();

      // 4. Autonomous Threat Telemetry Nodes & Interceptor Lasers
      telemetryNodes.forEach((node) => {
        const currentTheta = node.theta + (angle * node.speed * (node.type === 'malicious' ? -1.5 : 1));
        const nx = centerX + Math.cos(currentTheta) * node.distance;
        const ny = centerY + Math.sin(currentTheta) * node.distance;

        // Draw laser telemetry connection to center
        ctx.save();
        ctx.strokeStyle = node.type === 'malicious' 
          ? 'rgba(236, 72, 153, 0.35)' 
          : node.type === 'suspicious' 
          ? 'rgba(245, 158, 11, 0.3)' 
          : 'rgba(16, 185, 129, 0.25)';
        ctx.lineWidth = node.type === 'malicious' ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // Draw node pulse orb
        const pulseSize = (Math.sin(angle * 4 + node.pulseOffset) + 1) * 1.5;
        ctx.fillStyle = node.type === 'malicious' 
          ? '#EC4899' 
          : node.type === 'suspicious' 
          ? '#F59E0B' 
          : '#10B981';
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.arc(nx, ny, 3 + pulseSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 5. Core AI Status Badge
      const innerPulse = 26 + Math.sin(angle * 3) * 4;
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(139, 92, 246, 0.35)' : 'rgba(139, 92, 246, 0.2)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerPulse, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#FAFAFA';
      ctx.font = 'bold 10px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('NEURAL AI', centerX, centerY);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDark]);

  return (
    <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] flex items-center justify-center mx-auto select-none pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}