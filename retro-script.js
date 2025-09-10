// 80s Retro Portfolio Interactive Script

// Colored Sand Particle System
class ColoredSandEffect {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.colors = ['#ff0080', '#00ff80', '#8000ff', '#ffff00', '#00ffff', '#ff4000'];
        
        this.init();
    }
    
    init() {
        this.resize();
        this.setupEventListeners();
        this.animate();
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.resize());
        
        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.createParticles();
        });
        
        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX;
            this.mouse.y = touch.clientY;
            this.createParticles();
        });
    }
    
    createParticles() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: this.mouse.x + (Math.random() - 0.5) * 8,
                y: this.mouse.y + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 1.5,
                vy: (Math.random() - 0.5) * 1.5,
                size: Math.random() * 8 + 6,
                color: this.colors[Math.floor(Math.random() * this.colors.length)],
                life: 1,
                decay: Math.random() * 0.008 + 0.003,
                gravity: Math.random() * 0.05 + 0.01
            });
        }
        
        // Limit particles for performance
        if (this.particles.length > 1500) {
            this.particles = this.particles.slice(-1200);
        }
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.vx *= 0.98;
            particle.vy *= 0.98;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.save();
            this.ctx.globalAlpha = particle.life;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Add intense glow effect for 80s style
            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            
            this.ctx.restore();
        });
    }
    
    animate() {
        this.updateParticles();
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// Jukebox Entry Controller
class JukeboxEntry {
    constructor() {
        this.entryElement = document.getElementById('jukebox-entry');
        this.startCD = document.getElementById('start-cd');
        this.portfolioElement = document.getElementById('retro-portfolio');
        this.transitionCD = document.getElementById('transition-cd');
        this.particleCanvas = document.getElementById('particle-canvas');
        
        this.init();
    }
    
    init() {
        // Initialize colored sand effect
        this.sandEffect = new ColoredSandEffect(this.particleCanvas);
        
        // Setup start CD click
        this.startCD.addEventListener('click', () => this.startPortfolio());
        
        // Allow Enter key to start
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.entryElement.classList.contains('fade-out')) {
                this.startPortfolio();
            }
        });
        
    }
    
    startPortfolio() {
        // Move the actual START CD down
        this.startCD.style.position = 'fixed';
        this.startCD.style.zIndex = '10000';
        this.startCD.style.transition = 'transform 2s ease-in-out';
        this.startCD.style.transform = 'translateY(100vh)';
        
        // Play transition sound
        this.playTransitionSound();
        
        // Fade out jukebox entry (but keep the CD visible)
        setTimeout(() => {
            this.entryElement.classList.add('fade-out');
        }, 500);
        
        // Show portfolio
        setTimeout(() => {
            this.entryElement.style.display = 'none';
            this.portfolioElement.classList.add('show');
            
            // Initialize main portfolio
            window.retroPortfolio = new RetroPortfolio();
        }, 1500);
        
        // Reset the CD position after animation
        setTimeout(() => {
            this.startCD.style.position = '';
            this.startCD.style.zIndex = '';
            this.startCD.style.transition = '';
            this.startCD.style.transform = '';
        }, 2500);
    }
    
    playTransitionSound() {
        // Web Audio API for transition sound effect
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            
            // Create a swoosh sound effect
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 1.5);
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 1.5);
        }
    }
}

// Retro Portfolio Main Controller
class RetroPortfolio {
    constructor() {
        this.mainCanvas = document.getElementById('main-particle-canvas');
        this.scrollSections = document.querySelectorAll('.scroll-section');
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        // Initialize main particle effect
        this.mainSandEffect = new ColoredSandEffect(this.mainCanvas);
        
        // Setup scroll animations
        this.setupScrollAnimations();
        
        // Setup typing animation
        this.setupTypingAnimation();
        
        // Setup project card interactions
        this.setupProjectCards();
        
        // Initial section visibility check
        this.checkSectionVisibility();
    }
    
    setupScrollAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    this.animateSection(entry.target);
                }
            });
        }, observerOptions);
        
        this.scrollSections.forEach(section => {
            observer.observe(section);
        });
        
        // Smooth scrolling for better effect
        document.documentElement.style.scrollBehavior = 'smooth';
    }
    
    animateSection(section) {
        const sectionType = section.dataset.scroll;
        
        switch(sectionType) {
            case 'hero':
                this.animateHeroSection(section);
                break;
            case 'about':
                this.animateAboutSection(section);
                break;
            case 'projects':
                this.animateProjectsSection(section);
                break;
            case 'experience':
                this.animateExperienceSection(section);
                break;
            case 'contact':
                this.animateContactSection(section);
                break;
        }
    }
    
    animateHeroSection(section) {
        const shapes = section.querySelectorAll('.shape');
        shapes.forEach((shape, index) => {
            setTimeout(() => {
                shape.style.animation = `float 6s ease-in-out infinite ${index * 2}s`;
            }, index * 200);
        });
    }
    
    animateAboutSection(section) {
        const codeLines = section.querySelectorAll('.code-line');
        codeLines.forEach((line, index) => {
            setTimeout(() => {
                line.style.opacity = '0';
                line.style.transform = 'translateX(-20px)';
                line.style.transition = 'all 0.5s ease-out';
                
                setTimeout(() => {
                    line.style.opacity = '1';
                    line.style.transform = 'translateX(0)';
                }, 50);
            }, index * 200);
        });
        
        const statItems = section.querySelectorAll('.stat-item');
        statItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transform = 'scale(0.8)';
                item.style.transition = 'transform 0.5s ease-out';
                
                setTimeout(() => {
                    item.style.transform = 'scale(1)';
                }, 100);
            }, 500 + index * 150);
        });
    }
    
    animateProjectsSection(section) {
        const projectCards = section.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(50px) rotateX(20deg)';
                card.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) rotateX(0)';
                }, 50);
            }, index * 200);
        });
    }
    
    animateExperienceSection(section) {
        const timelineItems = section.querySelectorAll('.timeline-item');
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = index % 2 === 0 ? 'translateX(-50px)' : 'translateX(50px)';
                item.style.transition = 'all 0.6s ease-out';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 100);
            }, index * 300);
        });
    }
    
    animateContactSection(section) {
        const contactItems = section.querySelectorAll('.contact-item');
        contactItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.4s ease-out';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, index * 150);
        });
    }
    
    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (typingElement) {
            const text = typingElement.textContent;
            typingElement.textContent = '';
            
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    typingElement.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                    // Restart typing after delay
                    setTimeout(() => {
                        typingElement.textContent = '';
                        i = 0;
                        const restartInterval = setInterval(() => {
                            if (i < text.length) {
                                typingElement.textContent += text.charAt(i);
                                i++;
                            } else {
                                clearInterval(restartInterval);
                            }
                        }, 100);
                    }, 3000);
                }
            }, 100);
        }
    }
    
    setupProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                const screenGlow = card.querySelector('.screen-glow');
                if (screenGlow) {
                    screenGlow.style.animation = 'screenFlicker 0.5s ease-in-out infinite';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                const screenGlow = card.querySelector('.screen-glow');
                if (screenGlow) {
                    screenGlow.style.animation = 'screenFlicker 3s ease-in-out infinite';
                }
            });
            
            card.addEventListener('click', () => {
                this.showProjectDetails(card);
            });
        });
    }
    
    showProjectDetails(card) {
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 150);
        
        // Play click sound
        this.playClickSound();
        
        // Here you could add modal or navigation to project details
        console.log('Project clicked:', card.dataset.project);
    }
    
    checkSectionVisibility() {
        // Initial check for sections already in view
        this.scrollSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.7) {
                section.classList.add('visible');
                this.animateSection(section);
            }
        });
    }
    
    playClickSound() {
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(1200, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.03, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        }
    }
}

// Resume Download Function
function downloadResume() {
    // Create a temporary link to download resume
    const link = document.createElement('a');
    link.href = 'assets/Salem_Bagnied_Resume.pdf'; // You'll need to add your actual resume file
    link.download = 'Salem_Bagnied_Resume.pdf';
    link.click();
    
    // Visual feedback
    const btn = event.target.closest('.retro-button');
    const originalText = btn.querySelector('.button-text').innerHTML;
    btn.querySelector('.button-text').innerHTML = 'DOWNLOADED!';
    
    setTimeout(() => {
        btn.querySelector('.button-text').innerHTML = originalText;
    }, 2000);
    
    // Play download sound
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize jukebox entry
    const jukeboxEntry = new JukeboxEntry();
    
    // Add loading screen fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 1s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 200);
    
    // Add keyboard shortcuts info
    console.log('🎵 Salem Bagnied\'s 80s Retro Portfolio');
    console.log('Enter: Start from jukebox');
    console.log('Scroll: Navigate through sections');
    console.log('Click: Interact with elements');
    
    // Add retro cursor trail effect
    let mouseTrail = [];
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        });
        
        // Keep only recent trail points
        mouseTrail = mouseTrail.filter(point => Date.now() - point.time < 500);
        
        // Create trail elements
        if (mouseTrail.length > 1) {
            const trailElement = document.createElement('div');
            trailElement.style.position = 'fixed';
            trailElement.style.left = e.clientX + 'px';
            trailElement.style.top = e.clientY + 'px';
            trailElement.style.width = '4px';
            trailElement.style.height = '4px';
            trailElement.style.background = '#ff0080';
            trailElement.style.borderRadius = '50%';
            trailElement.style.pointerEvents = 'none';
            trailElement.style.zIndex = '10000';
            trailElement.style.boxShadow = '0 0 10px #ff0080';
            trailElement.style.transition = 'opacity 0.5s ease-out';
            
            document.body.appendChild(trailElement);
            
            setTimeout(() => {
                trailElement.style.opacity = '0';
                setTimeout(() => {
                    if (trailElement.parentNode) {
                        trailElement.parentNode.removeChild(trailElement);
                    }
                }, 500);
            }, 50);
        }
    });
});

// Add dynamic CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes retroPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .project-card.active {
        animation: retroPulse 2s ease-in-out infinite;
    }
    
    @keyframes neonGlow {
        0%, 100% { filter: brightness(1) hue-rotate(0deg); }
        50% { filter: brightness(1.2) hue-rotate(180deg); }
    }
    
    .retro-portfolio {
        animation: neonGlow 10s ease-in-out infinite;
    }
`;
document.head.appendChild(style);
