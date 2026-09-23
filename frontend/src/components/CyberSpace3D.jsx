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

    // Smooth physics variables
    let targetScrollY = window.scrollY || window.pageYOffset || 0;
    let currentScrollY = targetScrollY;
    let scrollVelocity = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    // Interactive Shockwave Ripples (Fired on click)
    const ripples = [];

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleClick = (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.max(width, height) * 0.6,
        alpha: 0.8
      });
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);

    // Particle Matrix Setup
    const PARTICLE_COUNT = 110;
    const particles = [];
    const WORLD_DEPTH = 2200;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2.2,
        y: (Math.random() - 0.5) * height * 2.2,
        z: Math.random() * WORLD_DEPTH,
        size: Math.random() * 2.5 + 0.6,
        colorType: Math.random() > 0.5 ? 'primary' : 'secondary',
        speedOffset: Math.random() * 0.5 + 0.8
      });
    }

    // Wireframe Octahedron & Cube Geometries
    const octaVertices = [[0,1,0],[0,-1,0],[1,0,0],[-1,0,0],[0,0,1],[0,0,-1]];
    const octaEdges = [[0,2],[0,3],[0,4],[0,5],[1,2],[1,3],[1,4],[1,5],[2,4],[4,3],[3,5],[5,2]];

    const cubeVertices = [[-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],[-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]];
    const cubeEdges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];

    const floatingObjects = [
      { vertices: octaVertices, edges: octaEdges, x: -width * 0.38, y: -120, z: 450, scale: 70, rotX: 0.2, rotY: 0.3, speedRotX: 0.007, speedRotY: 0.01, color: '#8B5CF6' },
      { vertices: cubeVertices, edges: cubeEdges, x: width * 0.38, y: 140, z: 800, scale: 60, rotX: 0.4, rotY: 0.1, speedRotX: -0.006, speedRotY: 0.009, color: '#EC4899' },
      { vertices: octaVertices, edges: octaEdges, x: width * 0.3, y: -260, z: 1200, scale: 85, rotX: 0.1, rotY: 0.5, speedRotX: 0.009, speedRotY: -0.008, color: '#A78BFA' }
    ];

    function rotate3D(vertex, rx, ry, rz) {
      let [x, y, z] = vertex;
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      return [x2 * Math.cos(rz) - y1 * Math.sin(rz), x2 * Math.sin(rz) + y1 * Math.cos(rz), z2];
    }

    const FOCAL_LENGTH = 580;
    function project3D(x, y, z, cx, cy) {
      if (z <= 10) return null;
      const scale = FOCAL_LENGTH / z;
      return { px: cx + x * scale, py: cy + y * scale, scale, visible: z > 10 && z < 2600 };
    }

    let tick = 0;

    const render = () => {
      tick++;
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.08;
      scrollVelocity = currentScrollY - prevScrollY;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + mouseX * 45;
      const cy = height / 2 + mouseY * 35;

      // 1. RENDER INTERACTIVE SHOCKWAVE RIPPLES
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 8;
        r.alpha *= 0.95;

        ctx.save();
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDark ? `rgba(139, 92, 246, ${r.alpha})` : `rgba(139, 92, 246, ${r.alpha * 0.7})`;
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        if (r.alpha < 0.02 || r.radius > r.maxRadius) {
          ripples.splice(i, 1);
        }
      }

      // 2. CYBER FLOOR PERSPECTIVE GRID
      const gridFloorY = 340;
      const gridZStart = 100;
      const gridZEnd = 1700;
      const gridSpacingX = 150;
      const gridCrossInterval = 130;
      const streamOffset = (currentScrollY * 0.9 + tick * 0.9) % gridCrossInterval;

      ctx.save();
      const primaryColor = isDark ? 'rgba(139, 92, 246, ' : 'rgba(139, 92, 246, ';
      const accentColor = isDark ? 'rgba(236, 72, 153, ' : 'rgba(236, 72, 153, ';

      for (let i = -14; i <= 14; i++) {
        const lx = i * gridSpacingX;
        const pNear = project3D(lx, gridFloorY, gridZStart, cx, cy);
        const pFar = project3D(lx * 2.4, gridFloorY, gridZEnd, cx, cy);

        if (pNear && pFar) {
          const alpha = Math.max(0, (1 - Math.abs(i) / 14) * (isDark ? 0.24 : 0.16));
          ctx.beginPath();
          ctx.strokeStyle = (i % 4 === 0) ? `${accentColor}${alpha * 1.4})` : `${primaryColor}${alpha})`;
          ctx.moveTo(pNear.px, pNear.py);
          ctx.lineTo(pFar.px, pFar.py);
          ctx.stroke();
        }
      }

      for (let z = gridZStart; z < gridZEnd; z += gridCrossInterval) {
        let actualZ = z - streamOffset;
        if (actualZ < gridZStart) actualZ += (gridZEnd - gridZStart);

        const pL = project3D(-14 * gridSpacingX, gridFloorY, actualZ, cx, cy);
        const pR = project3D(14 * gridSpacingX, gridFloorY, actualZ, cx, cy);

        if (pL && pR) {
          const depthRatio = 1 - (actualZ - gridZStart) / (gridZEnd - gridZStart);
          ctx.beginPath();
          ctx.strokeStyle = `${primaryColor}${depthRatio * (isDark ? 0.28 : 0.18)})`;
          ctx.moveTo(pL.px, pL.py);
          ctx.lineTo(pR.px, pR.py);
          ctx.stroke();
        }
      }
      ctx.restore();

      // 3. FLOATING WIREFRAME POLYHEDRA
      floatingObjects.forEach((obj) => {
        obj.rotX += obj.speedRotX + scrollVelocity * 0.0018;
        obj.rotY += obj.speedRotY + scrollVelocity * 0.0012;

        const cameraScrollRel = (currentScrollY * 0.5) % WORLD_DEPTH;
        let relativeZ = obj.z - cameraScrollRel;
        if (relativeZ < 50) relativeZ += WORLD_DEPTH;
        if (relativeZ > WORLD_DEPTH) relativeZ -= WORLD_DEPTH;

        const currentY = obj.y + Math.sin(tick * 0.02 + obj.z) * 20;
        const projectedVertices = obj.vertices.map((v) => {
          const rot = rotate3D(v, obj.rotX, obj.rotY, 0);
          return project3D(obj.x + rot[0] * obj.scale, currentY + rot[1] * obj.scale, relativeZ + rot[2] * obj.scale, cx, cy);
        });

        const depthRatio = Math.max(0, Math.min(1, 1 - relativeZ / WORLD_DEPTH));
        ctx.save();
        ctx.strokeStyle = obj.color;
        ctx.globalAlpha = depthRatio * (isDark ? 0.7 : 0.5);
        ctx.lineWidth = Math.max(1, depthRatio * 2.5);

        obj.edges.forEach(([i, j]) => {
          const p1 = projectedVertices[i];
          const p2 = projectedVertices[j];
          if (p1 && p2 && p1.visible && p2.visible) {
            ctx.beginPath();
            ctx.moveTo(p1.px, p1.py);
            ctx.lineTo(p2.px, p2.py);
            ctx.stroke();
          }
        });
        ctx.restore();
      });

      // 4. PARTICLE FIELD WARP
      ctx.save();
      const velocityStretch = Math.min(Math.abs(scrollVelocity) * 1.5, 35);

      particles.forEach((pt) => {
        pt.z -= scrollVelocity * 0.9 * pt.speedOffset + 0.35;
        if (pt.z < 20) pt.z += WORLD_DEPTH;
        if (pt.z > WORLD_DEPTH) pt.z -= WORLD_DEPTH;

        const proj = project3D(pt.x, pt.y, pt.z, cx, cy);
        if (proj && proj.visible) {
          const depthRatio = 1 - pt.z / WORLD_DEPTH;
          const radius = Math.max(0.6, pt.size * proj.scale * 1.8);
          const alpha = depthRatio * (isDark ? 0.8 : 0.55);

          ctx.fillStyle = pt.colorType === 'primary' 
            ? (isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(139, 92, 246, ${alpha})`)
            : (isDark ? `rgba(236, 72, 153, ${alpha})` : `rgba(236, 72, 153, ${alpha})`);

          if (velocityStretch > 2) {
            const prevProj = project3D(pt.x, pt.y, pt.z + velocityStretch * 10, cx, cy);
            if (prevProj) {
              ctx.beginPath();
              ctx.lineWidth = radius * 1.4;
              ctx.strokeStyle = ctx.fillStyle;
              ctx.moveTo(proj.px, proj.py);
              ctx.lineTo(prevProj.px, prevProj.py);
              ctx.stroke();
            }
          } else {
            ctx.beginPath();
            ctx.arc(proj.px, proj.py, radius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      });
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-auto z-0 overflow-hidden cursor-crosshair">
      <canvas ref={canvasRef} className="w-full h-full block opacity-95 transition-opacity duration-700" />
      <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
        isDark ? 'bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0F_95%)]' : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,#F8FAFC_95%)]'
      }`} />
    </div>
  );
}