/**
 * Vinod Hospital - Interactive Canvas Particle System
 * High-performance 2D network animation optimized for mobile & desktop.
 */

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = {
            x: null,
            y: null,
            radius: 120, // Interaction radius
            active: false
        };
        
        // Dynamic configuration based on screen width
        this.isMobile = window.innerWidth < 768;
        this.particleCount = this.isMobile ? 120 : 450;
        this.connectionDistance = this.isMobile ? 70 : 100;
        
        // Colors loaded dynamically from stylesheet variables
        this.colors = {
            primary: '168, 85%, 45%',
            accent: '226, 80%, 58%',
            mode: 'dark'
        };

        this.init();
    }

    init() {
        this.resize();
        this.updateColorsFromTheme();
        this.createParticles();
        this.setupEventListeners();
        this.animate();
    }

    updateColorsFromTheme() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        this.colors.mode = theme;
        
        // Read CSS variables
        const styles = getComputedStyle(document.documentElement);
        
        // Helper to extract clean HSL parts
        const getHSLValues = (varName) => {
            const val = styles.getPropertyValue(varName).trim();
            // Convert e.g., 'hsl(168, 85%, 45%)' -> '168, 85%, 45%'
            const match = val.match(/hsl\(([^)]+)\)/);
            return match ? match[1] : null;
        };

        const primaryHSL = getHSLValues('--primary');
        const accentHSL = getHSLValues('--accent');
        
        if (primaryHSL) this.colors.primary = primaryHSL;
        if (accentHSL) this.colors.accent = accentHSL;
    }

    resize() {
        const parent = this.canvas.parentElement;
        this.canvas.width = parent.clientWidth;
        this.canvas.height = parent.clientHeight;
        
        // Recalculate density on major resize
        const isMobileNow = window.innerWidth < 768;
        if (isMobileNow !== this.isMobile) {
            this.isMobile = isMobileNow;
            this.particleCount = this.isMobile ? 120 : 450;
            this.connectionDistance = this.isMobile ? 70 : 100;
            this.createParticles();
        }
    }

    createParticles() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 1.8 + 0.6,
                // Assign randomly to primary or accent color group
                colorType: Math.random() > 0.35 ? 'primary' : 'accent',
                alpha: Math.random() * 0.4 + 0.2
            });
        }
    }

    setupEventListeners() {
        const parent = this.canvas.parentElement;
        
        parent.addEventListener('mousemove', (e) => {
            const rect = parent.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.active = true;
        });

        parent.addEventListener('mouseleave', () => {
            this.mouse.active = false;
        });

        // Listen for custom theme updates
        window.addEventListener('theme-changed', () => {
            this.updateColorsFromTheme();
        });

        // Throttle resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 150);
        });
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Motion
            p.x += p.vx;
            p.y += p.vy;
            
            // Wrap boundaries
            if (p.x < 0) p.x = this.canvas.width;
            if (p.x > this.canvas.width) p.x = 0;
            if (p.y < 0) p.y = this.canvas.height;
            if (p.y > this.canvas.height) p.y = 0;

            // Mouse interaction (gravity effect)
            if (this.mouse.active) {
                const dx = this.mouse.x - p.x;
                const dy = this.mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    // Move slightly towards mouse
                    p.x -= (dx / dist) * force * 0.6;
                    p.y -= (dy / dist) * force * 0.6;
                }
            }

            // Draw particle
            const hslColor = p.colorType === 'primary' ? this.colors.primary : this.colors.accent;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `hsla(${hslColor}, ${p.alpha})`;
            this.ctx.fill();
        }

        // Draw connections (Web network)
        // To keep performance high, only draw lines between near neighbors
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < this.connectionDistance) {
                    // Line opacity drops off with distance
                    const alpha = (1 - dist / this.connectionDistance) * 0.12;
                    const hslColor = p1.colorType === 'primary' ? this.colors.primary : this.colors.accent;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `hsla(${hslColor}, ${alpha})`;
                    this.ctx.lineWidth = 0.55;
                    this.ctx.stroke();
                }
            }
        }

        requestAnimationFrame(() => this.animate());
    }
}

// Initialise the system when script is loaded and DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.particles = new ParticleSystem('hero-canvas');
});
