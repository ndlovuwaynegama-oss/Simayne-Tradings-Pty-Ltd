import React, { useEffect, useRef } from 'react';

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', resize);
    resize();

    // Mouse Move Handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // --- Configuration ---
    const starCount = 500; // Increased count for better density
    const speedFactor = 0.05; // Base vertical drift speed
    
    // --- Stars ---
    const stars: {
      x: number, 
      y: number, 
      z: number, 
      opacity: number, 
      size: number,
      baseX: number,
      baseY: number
    }[] = [];
    
    for (let i = 0; i < starCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      // Depth calculation: bias towards smaller (distant) stars for realistic effect
      // z represents scale factor (higher = closer/faster/bigger)
      const depth = Math.pow(Math.random(), 2); // Distribution bias
      const z = depth * 2.5 + 0.2; // Range from 0.2 (far) to 2.7 (close)

      stars.push({
        x: x,
        y: y,
        baseX: x,
        baseY: y,
        z: z, 
        opacity: Math.random() * 0.4 + 0.4 + (z * 0.1), // Closer stars are slightly brighter
        size: Math.random() * 0.5 + (z * 0.8) // Size correlates with depth
      });
    }

    // --- Shooting Star State ---
    let shootingStar: {
      x: number; 
      y: number; 
      vx: number; 
      vy: number; 
      len: number; 
      life: number; 
      maxLife: number;
    } | null = null;

    const render = () => {
      // 1. Clear & Background
      ctx.fillStyle = '#020617'; // Slate 950 base
      ctx.fillRect(0, 0, width, height);

      // Deep Space Gradient Overlay
      const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width * 0.9);
      gradient.addColorStop(0, 'rgba(10, 20, 40, 0)'); // Center transparent
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.7)'); // Darker vignette
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Parallax Calculation
      const centerX = width / 2;
      const centerY = height / 2;
      // Mouse interaction factor
      const parallaxX = (mouseRef.current.x - centerX) * 0.03; 
      const parallaxY = (mouseRef.current.y - centerY) * 0.03;

      // 2. Draw Stars
      ctx.fillStyle = '#FFFFFF';
      stars.forEach((star) => {
        // Natural movement (slow upward flow based on depth)
        star.baseY -= speedFactor * star.z;
        
        // Wrap around logic
        if (star.baseY < -10) {
          star.baseY = height + 10;
          star.baseX = Math.random() * width;
        }

        // Apply Parallax (Inverse movement to mouse creates depth)
        const offsetX = parallaxX * star.z;
        const offsetY = parallaxY * star.z;

        const drawX = star.baseX - offsetX;
        const drawY = star.baseY - offsetY;

        // Wrap horizontal if parallax pushes off screen (optional, helps continuous feel)
        // Simple bounds check for drawing
        
        ctx.globalAlpha = Math.min(star.opacity, 1);
        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Twinkle effect
        if (Math.random() > 0.995) {
           star.opacity = Math.random() * 0.5 + 0.3 + (star.z * 0.1); 
        }
      });

      // 3. Shooting Star Logic
      if (!shootingStar && Math.random() > 0.997) {
        const startX = Math.random() * (width * 1.5);
        const startY = Math.random() * (height * 0.5);
        shootingStar = {
          x: startX,
          y: startY,
          vx: -25 - Math.random() * 15,
          vy: 15 + Math.random() * 15,
          len: 150 + Math.random() * 100,
          life: 1.0,
          maxLife: 1.0
        };
      }

      if (shootingStar) {
        const { x, y, vx, vy, len, life } = shootingStar;
        
        const speed = Math.sqrt(vx*vx + vy*vy);
        const tailX = x - (vx / speed) * len;
        const tailY = y - (vy / speed) * len;

        const starGrad = ctx.createLinearGradient(x, y, tailX, tailY);
        starGrad.addColorStop(0, `rgba(255, 255, 255, ${life})`);
        starGrad.addColorStop(0.2, `rgba(165, 243, 252, ${life * 0.8})`); // Cyan tint
        starGrad.addColorStop(1, `rgba(255, 255, 255, 0)`);

        ctx.strokeStyle = starGrad;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();

        shootingStar.x += vx * 0.4;
        shootingStar.y += vy * 0.4;
        shootingStar.life -= 0.015;

        if (shootingStar.life <= 0 || shootingStar.x < -shootingStar.len || shootingStar.y > height + shootingStar.len) {
          shootingStar = null;
        }
      }

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default AnimatedBackground;