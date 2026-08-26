import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { useThemeContext } from "../../theme/useThemeContext";

function AnimatedBackground() {
  const { mode } = useThemeContext();
  const canvasRef = useRef(null);
  const isDark = mode === "dark";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Particles configuration
    const particleCount = Math.min(Math.floor((width * height) / 18000), 55);
    const particles = [];

    const colors = isDark
      ? [
          { r: 99, g: 102, b: 241 }, // Indigo
          { r: 14, g: 165, b: 233 }, // Sky
          { r: 168, g: 85, b: 247 }, // Purple
          { r: 16, g: 185, b: 129 }, // Emerald
        ]
      : [
          { r: 79, g: 70, b: 229 },  // Indigo Dark
          { r: 2, g: 132, b: 199 },  // Sky Dark
          { r: 147, g: 51, b: 234 }, // Purple
          { r: 13, g: 148, b: 136 }, // Teal
        ];

    // Floating glowing background orbs with visible motion
    const orbs = [
      { x: width * 0.2, y: height * 0.2, vx: 0.8, vy: 0.6, r: 220, color: colors[0] },
      { x: width * 0.8, y: height * 0.3, vx: -0.7, vy: 0.9, r: 260, color: colors[1] },
      { x: width * 0.3, y: height * 0.8, vx: 0.6, vy: -0.8, r: 240, color: colors[2] },
      { x: width * 0.7, y: height * 0.7, vx: -0.8, vy: -0.5, r: 200, color: colors[3] },
    ];

    for (let i = 0; i < particleCount; i++) {
      const colorObj = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2.5 + 1.5,
        color: colorObj,
        alpha: Math.random() * 0.5 + 0.3,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseAngle: Math.random() * Math.PI * 2,
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw solid canvas base
      ctx.fillStyle = isDark ? "#090D16" : "#F4F7FB";
      ctx.fillRect(0, 0, width, height);

      // 2. Animate and Render Glowing Orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < -orb.r) orb.x = width + orb.r;
        if (orb.x > width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = height + orb.r;
        if (orb.y > height + orb.r) orb.y = -orb.r;

        const radial = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r
        );

        const orbAlpha = isDark ? 0.22 : 0.12;
        radial.addColorStop(
          0,
          `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${orbAlpha})`
        );
        radial.addColorStop(
          0.6,
          `rgba(${orb.color.r}, ${orb.color.g}, ${orb.color.b}, ${orbAlpha * 0.4})`
        );
        radial.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = radial;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Connecting Constellation Lines
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const lineAlpha = (1 - dist / maxDistance) * (isDark ? 0.18 : 0.14);
            ctx.strokeStyle = `rgba(${particles[i].color.r}, ${particles[i].color.g}, ${particles[i].color.b}, ${lineAlpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 4. Update and Draw Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Mouse gentle interaction
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 120 && mdist > 0) {
          const force = (120 - mdist) / 120;
          p.x += (mdx / mdist) * force * 2;
          p.y += (mdy / mdist) * force * 2;
        }

        // Particle pulse
        p.pulseAngle += p.pulseSpeed;
        const currentAlpha =
          p.alpha + Math.sin(p.pulseAngle) * (isDark ? 0.2 : 0.15);
        const displayAlpha = Math.max(0.1, Math.min(1, currentAlpha));

        // Draw particle glow
        ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${displayAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Extra halo on larger particles
        if (p.radius > 2.5) {
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${displayAlpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
        }}
      />
    </Box>
  );
}

export default AnimatedBackground;
