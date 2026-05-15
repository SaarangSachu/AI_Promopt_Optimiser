
import React, { useEffect, useRef } from 'react';

const StarBackground = ({ theme }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;

        let width = window.innerWidth;
        let height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const stars = [];
        const numStars = 500;
        const mouse = { x: null, y: null, active: false };

        // Star Class
        class Star {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.2; // Slow drift velocity
                this.vy = (Math.random() - 0.5) * 0.2;
                this.size = Math.random() * 1.5 + 0.5;

                if (theme === 'light') {
                    // Blue stars for light mode
                    this.baseColor = `rgba(37, 55, 235, ${Math.random() * 0.5 + 0.1})`; // Blue-600 base
                    this.activeColor = `rgba(59, 130, 246, ${Math.random() * 0.8 + 0.4})`; // Blue-500 glow
                } else {
                    // Original white/cyan for dark mode
                    this.baseColor = `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.1})`;
                    this.activeColor = `rgba(6, 182, 212, ${Math.random() * 0.8 + 0.4})`; // Cyan glow
                }
            }

            update() {
                // Drift
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around screen
                if (this.x < 0) this.x = width;
                if (this.x > width) this.x = 0;
                if (this.y < 0) this.y = height;
                if (this.y > height) this.y = 0;

                // Mouse interaction
                if (mouse.active) {
                    const dx = mouse.x - this.x;
                    const dy = mouse.y - this.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 200;

                    if (distance < maxDist) {
                        // Accelerate towards mouse slightly
                        const forceDirectionX = dx / distance;
                        const forceDirectionY = dy / distance;
                        const force = (maxDist - distance) / maxDist;
                        const attractionStrength = 0.05;

                        this.x += forceDirectionX * force * attractionStrength;
                        this.y += forceDirectionY * force * attractionStrength;

                        // Draw connection line
                        ctx.beginPath();
                        ctx.moveTo(this.x, this.y);
                        ctx.lineTo(mouse.x, mouse.y);
                        if (theme === 'light') {
                            ctx.strokeStyle = `rgba(37, 99, 235, ${1 - distance / maxDist})`;
                        } else {
                            ctx.strokeStyle = `rgba(6, 182, 212, ${1 - distance / maxDist})`;
                        }
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }

            draw() {
                ctx.fillStyle = this.baseColor;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        // Initialize stars
        for (let i = 0; i < numStars; i++) {
            stars.push(new Star());
        }

        const animate = () => {
            ctx.clearRect(0, 0, width, height);

            stars.forEach(star => {
                star.update();
                star.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            width = window.innerWidth;
            height = window.innerHeight;
            canvas.width = width;
            canvas.height = height;
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouse.active = true;
        };

        const handleMouseLeave = () => {
            mouse.active = false;
        }

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseout', handleMouseLeave);

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-run when theme changes

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

export default StarBackground;
