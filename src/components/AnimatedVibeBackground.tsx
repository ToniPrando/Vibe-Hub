import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

export const AnimatedVibeBackground: React.FC = () => {
  const { theme, backgroundConfig } = useApp();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isDark = theme === 'dark';
  const hasVideoUrl = !!backgroundConfig?.videoUrl;
  const isVideoMode = backgroundConfig?.mode === 'video' && hasVideoUrl;

  useEffect(() => {
    // If video mode is active, canvas doesn't need to render heavy frames
    if (isVideoMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Orbiting 3D icons from the video: Camera, @, #, Chat, Video, Instagram, Facebook, Broadcast
    interface OrbitItem {
      label: string;
      iconType: 'camera' | 'at' | 'hash' | 'chat' | 'play' | 'photo' | 'rss' | 'star';
      color: string;
      bg: string;
      orbitRadiusX: number;
      orbitRadiusY: number;
      speed: number;
      angle: number;
      tilt: number;
      size: number;
    }

    const items: OrbitItem[] = [
      { label: 'Camera', iconType: 'camera', color: '#38bdf8', bg: '#0369a1', orbitRadiusX: 240, orbitRadiusY: 85, speed: 0.012, angle: 0, tilt: -0.32, size: 32 },
      { label: '@', iconType: 'at', color: '#facc15', bg: '#ca8a04', orbitRadiusX: 280, orbitRadiusY: 100, speed: -0.010, angle: 1.2, tilt: 0.38, size: 28 },
      { label: '#', iconType: 'hash', color: '#f97316', bg: '#c2410c', orbitRadiusX: 320, orbitRadiusY: 110, speed: 0.009, angle: 2.4, tilt: -0.22, size: 30 },
      { label: 'Chat', iconType: 'chat', color: '#22c55e', bg: '#15803d', orbitRadiusX: 260, orbitRadiusY: 90, speed: -0.014, angle: 3.6, tilt: 0.28, size: 28 },
      { label: 'Play', iconType: 'play', color: '#ef4444', bg: '#b91c1c', orbitRadiusX: 310, orbitRadiusY: 105, speed: 0.011, angle: 4.8, tilt: -0.35, size: 30 },
      { label: 'Photo', iconType: 'photo', color: '#a855f7', bg: '#7e22ce', orbitRadiusX: 230, orbitRadiusY: 80, speed: -0.013, angle: 5.5, tilt: 0.25, size: 26 },
      { label: 'RSS', iconType: 'rss', color: '#0ea5e9', bg: '#0284c7', orbitRadiusX: 350, orbitRadiusY: 125, speed: 0.008, angle: 0.8, tilt: -0.18, size: 26 },
      { label: 'Star', iconType: 'star', color: '#fbbf24', bg: '#d97706', orbitRadiusX: 290, orbitRadiusY: 95, speed: -0.011, angle: 3.1, tilt: 0.42, size: 24 }
    ];

    // Background ambient particles
    interface Particle {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
    }

    const particleCount = 40;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#38bdf8' : '#f59e0b'
    }));

    let globeRotation = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Center position for animation (slightly offset to upper-center for hero backdrop)
      const centerX = width * 0.5;
      const centerY = height * 0.38;

      // 1. Draw floating ambient space particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha * (isDark ? 0.35 : 0.18);
        ctx.fill();
      });

      // 2. Volumetric Glow Behind Central Globe
      const glowRadius = Math.min(width, height) * 0.32;
      const radialGlow = ctx.createRadialGradient(centerX, centerY, 40, centerX, centerY, glowRadius);
      if (isDark) {
        radialGlow.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
        radialGlow.addColorStop(0.45, 'rgba(249, 115, 22, 0.12)');
        radialGlow.addColorStop(1, 'rgba(7, 11, 20, 0)');
      } else {
        radialGlow.addColorStop(0, 'rgba(14, 165, 233, 0.14)');
        radialGlow.addColorStop(0.5, 'rgba(249, 115, 22, 0.08)');
        radialGlow.addColorStop(1, 'rgba(248, 250, 252, 0)');
      }

      ctx.globalAlpha = 1;
      ctx.fillStyle = radialGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Central 3D Globe Representation from the video
      globeRotation += 0.006;
      const globeRadius = Math.min(130, width * 0.13);

      // Globe Base Sphere
      ctx.save();
      ctx.translate(centerX, centerY);

      // Globe Shadow
      ctx.beginPath();
      ctx.arc(0, 0, globeRadius, 0, Math.PI * 2);
      const oceanGrad = ctx.createRadialGradient(
        -globeRadius * 0.3,
        -globeRadius * 0.3,
        globeRadius * 0.1,
        0,
        0,
        globeRadius
      );
      oceanGrad.addColorStop(0, isDark ? '#38bdf8' : '#60a5fa');
      oceanGrad.addColorStop(0.35, isDark ? '#0284c7' : '#3b82f6');
      oceanGrad.addColorStop(0.85, isDark ? '#0369a1' : '#1d4ed8');
      oceanGrad.addColorStop(1, isDark ? '#082f49' : '#1e3a8a');
      ctx.fillStyle = oceanGrad;
      ctx.globalAlpha = isDark ? 0.32 : 0.18;
      ctx.fill();

      // Atmosphere outer rim
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#38bdf8';
      ctx.globalAlpha = isDark ? 0.45 : 0.25;
      ctx.stroke();

      // Continents / green patches (animated subtle rotation)
      ctx.fillStyle = '#22c55e';
      ctx.globalAlpha = isDark ? 0.28 : 0.16;
      for (let i = 0; i < 3; i++) {
        const patchAngle = globeRotation + (i * Math.PI * 2) / 3;
        const px = Math.cos(patchAngle) * globeRadius * 0.45;
        const py = Math.sin(patchAngle * 0.8) * globeRadius * 0.35;
        ctx.beginPath();
        ctx.ellipse(px, py, globeRadius * 0.32, globeRadius * 0.22, patchAngle, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Glowing 3D Orbit Rings from video (Cyan & Amber)
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#f59e0b';
      ctx.globalAlpha = isDark ? 0.45 : 0.25;
      ctx.beginPath();
      ctx.ellipse(0, 0, globeRadius * 1.5, globeRadius * 0.65, -0.32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.lineWidth = 4;
      ctx.strokeStyle = '#0ea5e9';
      ctx.globalAlpha = isDark ? 0.5 : 0.3;
      ctx.beginPath();
      ctx.ellipse(0, 0, globeRadius * 1.65, globeRadius * 0.72, 0.45, 0, Math.PI * 2);
      ctx.stroke();

      // Glowing orbit head/comet tip
      const cometAngle = globeRotation * 2.5;
      const cx = Math.cos(cometAngle) * globeRadius * 1.65;
      const cy = Math.sin(cometAngle) * globeRadius * 0.72;
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 12;
      ctx.globalAlpha = isDark ? 0.9 : 0.6;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.restore();

      // 5. Orbiting Social & Media 3D Badges from Video
      // We sort items by their projected depth (z-index) so foreground items draw over background items
      const projectedItems = items.map((item) => {
        item.angle += item.speed;
        // 3D parametric coordinate along tilted plane
        const baseCos = Math.cos(item.angle);
        const baseSin = Math.sin(item.angle);

        // Apply tilt rotation
        const x = centerX + baseCos * item.orbitRadiusX;
        const y = centerY + (baseSin * item.orbitRadiusY + baseCos * item.orbitRadiusX * item.tilt);
        const z = baseSin; // Z-depth: -1 (behind) to +1 (in front)

        // Scale based on distance perspective
        const scale = 0.75 + (z + 1) * 0.25; // 0.75 to 1.25
        const alpha = 0.35 + (z + 1) * 0.35; // dimmer when behind

        return { item, x, y, z, scale, alpha };
      });

      // Sort back-to-front
      projectedItems.sort((a, b) => a.z - b.z);

      projectedItems.forEach(({ item, x, y, scale, alpha }) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha * (isDark ? 0.8 : 0.45);

        const r = item.size / 2;

        // Badge Box with rounded corners and drop shadow
        ctx.shadowColor = item.color;
        ctx.shadowBlur = isDark ? 8 : 4;

        // Rounded badge background
        ctx.beginPath();
        ctx.roundRect(-r, -r, item.size, item.size, 8);
        ctx.fillStyle = isDark ? '#0f172a' : '#ffffff';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = item.color;
        ctx.stroke();

        ctx.shadowBlur = 0;

        // Draw icon symbol inside badge
        ctx.fillStyle = item.color;
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        switch (item.iconType) {
          case 'camera':
            ctx.fillText('📷', 0, 0);
            break;
          case 'at':
            ctx.fillText('@', 0, 0);
            break;
          case 'hash':
            ctx.fillText('#', 0, 0);
            break;
          case 'chat':
            ctx.fillText('💬', 0, 0);
            break;
          case 'play':
            ctx.fillText('▶', 1, 0);
            break;
          case 'photo':
            ctx.fillText('🖼️', 0, 0);
            break;
          case 'rss':
            ctx.fillText('📡', 0, 0);
            break;
          case 'star':
            ctx.fillText('✨', 0, 0);
            break;
          default:
            ctx.fillText('•', 0, 0);
        }

        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark, isVideoMode]);

  // If the user has uploaded an actual video file or provided a video URL
  if (isVideoMode && backgroundConfig?.videoUrl) {
    return (
      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-opacity duration-700"
        style={{ opacity: backgroundConfig.opacity || (isDark ? 0.22 : 0.14) }}
      >
        <video
          ref={videoRef}
          src={backgroundConfig.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
        {/* Soft gradient mask to preserve text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-[#070b14] via-transparent to-slate-50/60 dark:to-[#070b14]/60" />
      </div>
    );
  }

  // Canvas 3D Animated Background representing the exact video animation
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full block transition-opacity duration-500"
      />
      {/* Vignette scrim for reading legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/20 dark:via-[#070b14]/20 to-slate-50 dark:to-[#070b14] pointer-events-none" />
    </div>
  );
};
