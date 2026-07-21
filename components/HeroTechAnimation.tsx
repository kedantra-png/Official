"use client";

import React, { useEffect, useRef } from "react";

/*
 * Full-Bleed Vertical Flowing Energy Stream
 *
 * Immersive background canvas filling the entire screen height,
 * with the flowing wave centered prominently on the right side (~73% width).
 */

export function HeroTechAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    // Particle representation for floating sparks
    class Spark {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      color: string;

      constructor() {
        // Dynamically compute placement near the right-side flow column
        const currentCenterX = width > 1024 ? width * 0.73 : width / 2;
        this.x = currentCenterX + (Math.random() - 0.5) * 160;
        this.y = height + 10;
        this.size = Math.random() * 3.5 + 1.2;
        this.speedY = Math.random() * 2.2 + 1.6;
        this.speedX = (Math.random() - 0.5) * 0.9;
        this.opacity = Math.random() * 0.6 + 0.45;
        this.color = Math.random() > 0.5 ? "rgba(6, 182, 212, " : "rgba(139, 92, 246, ";
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -15) {
          const currentCenterX = width > 1024 ? width * 0.73 : width / 2;
          this.x = currentCenterX + (Math.random() - 0.5) * 160;
          this.y = height + 10;
          this.opacity = Math.random() * 0.6 + 0.45;
        }
      }

      draw(c: CanvasRenderingContext2D) {
        c.fillStyle = this.color + this.opacity + ")";
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
      }
    }

    let sparks: Spark[] = Array.from({ length: 60 }, () => new Spark());

    // Resize handler
    const handleResize = () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      sparks = Array.from({ length: 60 }, () => new Spark());
    };
    window.addEventListener("resize", handleResize);

    // Mouse handlers
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener("mousemove", handleMouseMove);
      parent.addEventListener("mouseleave", handleMouseLeave);
    }

    let time = 0;

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      time += 0.012;
      
      // Center flow on the right (73% width) for desktop, centered for mobile
      const cX = width > 1024 ? width * 0.73 : width / 2;
      const { x: mx, y: my } = mouseRef.current;

      // Interwoven ribbons
      const strands = [
        { frequency: 0.0035, amplitude: 105, speed: 1.1, color: "rgba(6, 182, 212, 0.55)", phase: 0 },
        { frequency: 0.005, amplitude: 80, speed: -0.85, color: "rgba(59, 130, 246, 0.48)", phase: Math.PI / 2 },
        { frequency: 0.003, amplitude: 95, speed: 1.3, color: "rgba(139, 92, 246, 0.45)", phase: Math.PI },
        { frequency: 0.0045, amplitude: 70, speed: -0.95, color: "rgba(217, 70, 239, 0.38)", phase: (3 * Math.PI) / 2 }
      ];

      strands.forEach((s) => {
        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 5.5; // thicker lines for full-bleed prominence
        ctx.lineCap = "round";

        // Intensive neon glow
        ctx.shadowBlur = 24;
        ctx.shadowColor = s.color;

        for (let y = 0; y <= height; y += 4) {
          let xOffset = Math.sin(y * s.frequency + time * s.speed + s.phase) * s.amplitude;

          // Mouse warp interaction with larger radius
          if (mx > -500) {
            const distY = Math.abs(y - my);
            if (distY < 200) {
              const force = (200 - distY) / 200;
              const pullDir = mx < cX + xOffset ? 1 : -1;
              xOffset += pullDir * force * 70;
            }
          }

          if (y === 0) {
            ctx.moveTo(cX + xOffset, y);
          } else {
            ctx.lineTo(cX + xOffset, y);
          }
        }
        ctx.stroke();
      });

      // Reset shadows
      ctx.shadowBlur = 0;

      // Draw sparks
      sparks.forEach((spark) => {
        spark.update();
        spark.draw(ctx);
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
      if (parent) {
        parent.removeEventListener("mousemove", handleMouseMove);
        parent.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-85 pointer-events-auto"
      />
    </div>
  );
}
