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

    let rotation = 0;

    // Generate fixed 3D sphere points (Latitude & Longitude grid)
    const globeRadius = 110;
    const points = [];
    
    // Latitudes
    for (let lat = -60; lat <= 60; lat += 30) {
      const radLat = (lat * Math.PI) / 180;
      const r = globeRadius * Math.cos(radLat);
      const y = globeRadius * Math.sin(radLat);
      
      for (let lon = 0; lon < 360; lon += 36) {
        const radLon = (lon * Math.PI) / 180;
        points.push({
          x: r * Math.cos(radLon),
          y: y,
          z: r * Math.sin(radLon),
          isThreat: Math.sin(lat * lon) > 0.6
        });
      }
    }

    const render = () => {
      rotation += 0.012;
      ctx.clearRect(0, 0, width, height);

      // 1. Outer Glow Atmosphere
      const atmosphere = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, 150);
      atmosphere.addColorStop(0, isDark ? 'rgba(139, 92, 246, 0.25)' : 'rgba(139, 92, 246, 0.15)');
      atmosphere.addColorStop(1, 'transparent');
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 150, 0, Math.PI * 2);
      ctx.fill();

      // 2. Rotating 3D Globe Wireframe & Nodes
      const cosR = Math.cos(rotation);
      const sinR = Math.sin(rotation);

      // Sort points by Z-depth for correct rendering order
      const projectedPoints = points.map(p => {
        // Rotate around Y axis
        const x3d = p.x * cosR - p.z * sinR;
        const z3d = p.x * sinR + p.z * cosR;
        const scale = 220 / (220 + z3d); // Perspective scale
        
        return {
          x: centerX + x3d * scale,
          y: centerY + p.y * scale,
          z: z3d,
          scale,
          isThreat: p.isThreat
        };
      }).sort((a, b) => a.z - b.z);

      // Draw Globe Grid Lines & Nodes
      projectedPoints.forEach(p => {
        if (p.z > -100) {
          const alpha = Math.max(0.1, (p.z + 110) / 220);
          
          ctx.save();
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.isThreat ? 3.5 : 2, 0, Math.PI * 2);
          
          if (p.isThreat) {
            ctx.fillStyle = `rgba(236, 72, 153, ${alpha})`; // Pink threat node
            ctx.shadowColor = '#EC4899';
            ctx.shadowBlur = 8;
          } else {
            ctx.fillStyle = `rgba(139, 92, 246, ${alpha})`; // Purple grid node
          }
          
          ctx.fill();
          ctx.restore();
        }
      });

      // 3. Radar Scanning Ring Sweep Overlay
      ctx.save();
      ctx.strokeStyle = isDark ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX, centerY, globeRadius + 15, 0, Math.PI * 2);
      ctx.stroke();

      const sweepAngle = rotation * 2;
      const scanGrad = ctx.createRadialGradient(centerX, centerY, 5, centerX, centerY, globeRadius + 20);
      scanGrad.addColorStop(0, isDark ? 'rgba(236, 72, 153, 0.35)' : 'rgba(139, 92, 246, 0.2)');
      scanGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = scanGrad;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, globeRadius + 20, sweepAngle, sweepAngle + 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 4. Central Core Shield Emblem
      ctx.save();
      ctx.fillStyle = isDark ? 'rgba(19, 17, 28, 0.9)' : 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#8B5CF6';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#8B5CF6';
      ctx.shadowBlur = 15;

      ctx.beginPath();
      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = isDark ? '#FAFAFA' : '#0F172A';
      ctx.font = 'bold 9px monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SECURE', centerX, centerY - 5);
      ctx.fillStyle = '#8B5CF6';
      ctx.fillText('GLOBE', centerX, centerY + 6);
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