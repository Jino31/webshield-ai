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

    // Scroll tracking with smooth damping (lerp)
    let targetScrollY = window.scrollY || window.pageYOffset || 0;
    let currentScrollY = targetScrollY;
    let scrollVelocity = 0;
    let lastScrollY = targetScrollY;

    // Mouse parallax tracking
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleScroll = () => {
      targetScrollY = window.scrollY || window.pageYOffset || 0;
    };

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX - width / 2) / (width / 2);
      targetMouseY = (e.clientY - height / 2) / (height / 2);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize);

    // 3D Particles Definition
    const PARTICLE_COUNT = 90;
    const particles = [];
    const WORLD_DEPTH = 2000;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: (Math.random() - 0.5) * width * 2,
        y: (Math.random() - 0.5) * height * 2,
        z: Math.random() * WORLD_DEPTH,
        size: Math.random() * 2.2 + 0.8,
        colorType: Math.random() > 0.4 ? 'purple' : Math.random() > 0.5 ? 'pink' : 'cyan',
        speedOffset: Math.random() * 0.4 + 0.8
      });
    }

    // 3D Geometric Objects (Wireframe Polyhedra)
    // 1. Octahedron vertices
    const octahedronVertices = [
      [0, 1, 0],
      [0, -1, 0],
      [1, 0, 0],
      [-1, 0, 0],
      [0, 0, 1],
      [0, 0, -1]
    ];
    const octahedronEdges = [
      [0, 2], [0, 3], [0, 4], [0, 5],
      [1, 2], [1, 3], [1, 4], [1, 5],
      [2, 4], [4, 3], [3, 5], [5, 2]
    ];

    // 2. Cube vertices
    const cubeVertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1],  [1, -1, 1],  [1, 1, 1],  [-1, 1, 1]
    ];
    const cubeEdges = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7]
    ];

    // Floating 3D objects placed in space along the scroll track
    const floatingObjects = [
      {
        type: 'octa',
        vertices: octahedronVertices,
        edges: octahedronEdges,
        x: -width * 0.35,
        y: -100,
        z: 400,
        scale: 65,
        rotX: 0.2,
        rotY: 0.3,
        rotZ: 0,
        speedRotX: 0.008,
        speedRotY: 0.012,
        color: '#8B5CF6'
      },
      {
        type: 'cube',
        vertices: cubeVertices,
        edges: cubeEdges,
        x: width * 0.36,
        y: 120,
        z: 750,
        scale: 55,
        rotX: 0.4,
        rotY: 0.1,
        rotZ: 0.2,
        speedRotX: -0.007,
        speedRotY: 0.01,
        color: '#EC4899'
      },
      {
        type: 'octa',
        vertices: octahedronVertices,
        edges: octahedronEdges,
        x: width * 0.28,
        y: -240,
        z: 1100,
        scale: 80,
        rotX: 0.1,
        rotY: 0.5,
        rotZ: 0.3,
        speedRotX: 0.01,
        speedRotY: -0.009,
        color: '#06B6D4'
      },
      {
        type: 'cube',
        vertices: cubeVertices,
        edges: cubeEdges,
        x: -width * 0.38,
        y: 280,
        z: 1450,
        scale: 70,
        rotX: 0.5,
        rotY: 0.2,
        rotZ: 0.1,
        speedRotX: 0.006,
        speedRotY: 0.011,
        color: '#8B5CF6'
      }
    ];

    // 3D rotation helper
    function rotate3D(vertex, rx, ry, rz) {
      let [x, y, z] = vertex;
      // Rotate around X
      let y1 = y * Math.cos(rx) - z * Math.sin(rx);
      let z1 = y * Math.sin(rx) + z * Math.cos(rx);
      // Rotate around Y
      let x2 = x * Math.cos(ry) + z1 * Math.sin(ry);
      let z2 = -x * Math.sin(ry) + z1 * Math.cos(ry);
      // Rotate around Z
      let x3 = x2 * Math.cos(rz) - y1 * Math.sin(rz);
      let y3 = x2 * Math.sin(rz) + y1 * Math.cos(rz);
      return [x3, y3, z2];
    }

    // Perspective projection helper
    const FOCAL_LENGTH = 550;

    function project3D(x, y, z, cx, cy) {
      if (z <= 10) return null;
      const scale = FOCAL_LENGTH / z;
      return {
        px: cx + x * scale,
        py: cy + y * scale,
        scale: scale,
        visible: z > 10 && z < 2500
      };
    }

    // Render loop
    let tick = 0;

    const render = () => {
      tick++;

      // Lerp mouse
      mouseX += (targetMouseX - mouseX) * 0.06;
      mouseY += (targetMouseY - mouseY) * 0.06;

      // Lerp scroll
      const prevScrollY = currentScrollY;
      currentScrollY += (targetScrollY - currentScrollY) * 0.09;
      scrollVelocity = currentScrollY - prevScrollY;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Camera center with mouse gyro tilt
      const cx = width / 2 + mouseX * 40;
      const cy = height / 2 + mouseY * 30;

      // ==========================================
      // 1. ENDLESS 3D CYBER FLOOR PERSPECTIVE GRID
      // ==========================================
      const gridFloorY = 320;
      const gridZStart = 120;
      const gridZEnd = 1600;
      const gridSpacingX = 140;
      const gridCrossInterval = 120;
      
      // Moving scroll offset for endless streaming grid effect
      const streamOffset = (currentScrollY * 0.85 + tick * 0.8) % gridCrossInterval;

      ctx.save();
      ctx.lineWidth = 1;

      // Grid color styles based on theme
      const primaryGridColor = isDark
        ? 'rgba(139, 92, 246, ' // Purple
        : 'rgba(124, 58, 237, ';
      const accentGridColor = isDark
        ? 'rgba(236, 72, 153, ' // Pink
        : 'rgba(219, 39, 119, ';

      // Longitudinal lines (perspective rays to vanishing horizon)
      const lineSpread = 16;
      for (let i = -lineSpread; i <= lineSpread; i++) {
        const lx = i * gridSpacingX;
        const pNear = project3D(lx, gridFloorY, gridZStart, cx, cy);
        const pFar = project3D(lx * 2.2, gridFloorY, gridZEnd, cx, cy);

        if (pNear && pFar) {
          const distFromCenter = Math.abs(i) / lineSpread;
          const alpha = Math.max(0, (1 - distFromCenter) * (isDark ? 0.22 : 0.14));

          ctx.beginPath();
          ctx.strokeStyle = (i % 4 === 0) 
            ? `${accentGridColor}${alpha * 1.5})` 
            : `${primaryGridColor}${alpha})`;
          ctx.moveTo(pNear.px, pNear.py);
          ctx.lineTo(pFar.px, pFar.py);
          ctx.stroke();
        }
      }

      // Transverse lines (cross lines traveling with scroll)
      for (let z = gridZStart; z < gridZEnd; z += gridCrossInterval) {
        let actualZ = z - streamOffset;
        if (actualZ < gridZStart) actualZ += (gridZEnd - gridZStart);

        const leftX = -lineSpread * gridSpacingX;
        const rightX = lineSpread * gridSpacingX;

        const pL = project3D(leftX, gridFloorY, actualZ, cx, cy);
        const pR = project3D(rightX, gridFloorY, actualZ, cx, cy);

        if (pL && pR) {
          const depthRatio = 1 - (actualZ - gridZStart) / (gridZEnd - gridZStart);
          const alpha = Math.max(0, depthRatio * (isDark ? 0.25 : 0.16));

          ctx.beginPath();
          ctx.strokeStyle = `${primaryGridColor}${alpha})`;
          ctx.moveTo(pL.px, pL.py);
          ctx.lineTo(pR.px, pR.py);
          ctx.stroke();
        }
      }
      ctx.restore();

      // ==========================================
      // 2. 3D FLOATING CYBER WIREFRAME POLYHEDRA
      // ==========================================
      floatingObjects.forEach((obj) => {
        // Continuous rotation + scroll tumble
        obj.rotX += obj.speedRotX + scrollVelocity * 0.002;
        obj.rotY += obj.speedRotY + scrollVelocity * 0.0015;
        obj.rotZ += 0.003;

        // Position shifts with camera & scroll travel
        const cameraScrollRel = (currentScrollY * 0.45) % WORLD_DEPTH;
        let relativeZ = obj.z - cameraScrollRel;
        if (relativeZ < 50) relativeZ += WORLD_DEPTH;
        if (relativeZ > WORLD_DEPTH) relativeZ -= WORLD_DEPTH;

        // Dynamic slight bobbing
        const currentY = obj.y + Math.sin(tick * 0.02 + obj.z) * 18;
        const currentX = obj.x + Math.cos(tick * 0.015 + obj.z) * 15;

        // Project vertices
        const projectedVertices = obj.vertices.map((v) => {
          const rot = rotate3D(v, obj.rotX, obj.rotY, obj.rotZ);
          const worldX = currentX + rot[0] * obj.scale;
          const worldY = currentY + rot[1] * obj.scale;
          const worldZ = relativeZ + rot[2] * obj.scale;
          return project3D(worldX, worldY, worldZ, cx, cy);
        });

        // Depth-based opacity & glow
        const depthRatio = Math.max(0, Math.min(1, 1 - relativeZ / WORLD_DEPTH));
        const alpha = depthRatio * (isDark ? 0.65 : 0.45);

        ctx.save();
        ctx.strokeStyle = obj.color;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = Math.max(1, depthRatio * 2.2);

        // Draw edges
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

        // Glowing core vertex points
        projectedVertices.forEach((p) => {
          if (p && p.visible) {
            ctx.fillStyle = obj.color;
            ctx.beginPath();
            ctx.arc(p.px, p.py, Math.max(1.2, p.scale * 3.5), 0, Math.PI * 2);
            ctx.fill();
          }
        });

        ctx.restore();
      });

      // ==========================================
      // 3. 3D PARTICLE FIELD WITH SCROLL WARP
      // ==========================================
      ctx.save();
      const velocityStretch = Math.min(Math.abs(scrollVelocity) * 1.5, 30);

      particles.forEach((pt) => {
        // Move particle towards/away from camera based on scroll
        pt.z -= scrollVelocity * 0.85 * pt.speedOffset + 0.3;

        // Wrap around boundary
        if (pt.z < 20) pt.z += WORLD_DEPTH;
        if (pt.z > WORLD_DEPTH) pt.z -= WORLD_DEPTH;

        const proj = project3D(pt.x, pt.y, pt.z, cx, cy);
        if (proj && proj.visible) {
          const depthRatio = 1 - pt.z / WORLD_DEPTH;
          const radius = Math.max(0.6, pt.size * proj.scale * 1.6);
          const alpha = depthRatio * (isDark ? 0.75 : 0.5);

          ctx.fillStyle =
            pt.colorType === 'purple'
              ? isDark ? `rgba(139, 92, 246, ${alpha})` : `rgba(124, 58, 237, ${alpha})`
              : pt.colorType === 'pink'
              ? isDark ? `rgba(236, 72, 153, ${alpha})` : `rgba(219, 39, 119, ${alpha})`
              : isDark ? `rgba(6, 182, 212, ${alpha})` : `rgba(14, 165, 233, ${alpha})`;

          if (velocityStretch > 2) {
            // Draw warp velocity line along camera motion
            const prevZ = pt.z + (scrollVelocity > 0 ? velocityStretch * 12 : -velocityStretch * 12);
            const prevProj = project3D(pt.x, pt.y, prevZ, cx, cy);
            if (prevProj) {
              ctx.beginPath();
              ctx.lineWidth = radius * 1.2;
              ctx.strokeStyle = ctx.fillStyle;
              ctx.moveTo(proj.px, proj.py);
              ctx.lineTo(prevProj.px, prevProj.py);
              ctx.stroke();
            }
          } else {
            // Normal 3D particle orb
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
      window.removeEventListener('resize', handleResize);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90 transition-opacity duration-700"
      />
      {/* 3D Horizon Vignette / Depth Mask */}
      <div 
        className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
          isDark
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_30%,#0A0A0F_95%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_35%,#F8FAFC_95%)]'
        }`}
      />
    </div>
  );
}
