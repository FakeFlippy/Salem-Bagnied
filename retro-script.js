// 80s Retro Portfolio Interactive Script

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
        this.setupEventListeners();
        
        // Particle effect disabled
    }
    
    setupEventListeners() {
        // Setup start CD click
        this.startCD.addEventListener('click', () => this.startPortfolio());
        
        // Allow Enter key to start
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.entryElement.classList.contains('fade-out')) {
                this.startPortfolio();
            }
        });
        
        // Setup custom cursor
        this.setupCustomCursor();
    }
    
    setupCustomCursor() {
        const cursor = document.querySelector('.cursor');
        const startButton = this.startCD;
        const container = this.entryElement;
        
        if (!cursor || !startButton) return;
        
        document.addEventListener('mousemove', (e) => {
            if (container.contains(e.target)) {
                cursor.style.display = 'block';
                cursor.style.setProperty('--x', e.pageX + 'px');
                cursor.style.setProperty('--y', e.pageY + 'px');
                
                // Calculate rotation to point at START button
                const rotation = this.calculateRotation(cursor, startButton, e.pageX, e.pageY);
                cursor.style.setProperty('--r', rotation + 20 + 'deg');
            } else {
                cursor.style.display = 'none';
            }
        });
        
        container.addEventListener('mouseleave', () => {
            cursor.style.display = 'none';
        });
    }
    
    calculateRotation(cursor, target, mouseX, mouseY) {
        const targetRect = target.getBoundingClientRect();
        const targetCenter = {
            x: targetRect.left + targetRect.width / 2,
            y: targetRect.top + targetRect.height / 2
        };
        
        const radians = Math.atan2(targetCenter.x - mouseX, targetCenter.y - mouseY);
        const degree = (radians * (180 / Math.PI) * -1) + 180;
        return degree;
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
        // Canvas removed
        this.scrollSections = document.querySelectorAll('.scroll-section');
        this.currentSection = 0;
        
        this.init();
    }
    
    init() {
        // Particle effects disabled
        
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
                    // Keep text visible permanently after typing completes
                }
            }, 80);
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

// Neon Mouse Trail
(function() {
    const canvas = document.getElementById('neon-mouse-trail');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let mouseTrail = [];
    const maxTrail = 40;
    const trailFade = 0.10;
    
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    let lastMove = Date.now();
    document.addEventListener('mousemove', (e) => {
        mouseTrail.push({
            x: e.clientX,
            y: e.clientY,
            t: Date.now()
        });
        if (mouseTrail.length > maxTrail) mouseTrail.shift();
        lastMove = Date.now();
    });

    function lerpColor(a, b, t) {
        return [
            Math.round(a[0] + (b[0] - a[0]) * t),
            Math.round(a[1] + (b[1] - a[1]) * t),
            Math.round(a[2] + (b[2] - a[2]) * t)
        ];
    }
    const neonColors = [
        [255,0,128], // hot pink
        [0,255,128], // neon green
        [128,0,255], // purple
        [255,255,0], // yellow
        [0,255,255], // cyan
        [255,64,0]   // orange
    ];
    function getTrailColor(i) {
        const t = (Date.now()/800 + i/maxTrail) % neonColors.length;
        const idx = Math.floor(t);
        const next = (idx+1)%neonColors.length;
        const frac = t-idx;
        const c = lerpColor(neonColors[idx], neonColors[next], frac);
        return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
    let fadeAlpha = 1;
    function drawTrail() {
        ctx.clearRect(0,0,width,height);
        let now = Date.now();
        let inactive = now - lastMove;
        if (inactive > 1200) {
            fadeAlpha -= 0.08;
            if (fadeAlpha <= 0) {
                mouseTrail = [];
                fadeAlpha = 0;
            }
        } else {
            fadeAlpha = 1;
        }
        for (let i = 0; i < mouseTrail.length; ++i) {
            const p = mouseTrail[i];
            const alpha = ((i+1)/mouseTrail.length * (1-trailFade) + trailFade) * fadeAlpha;
            ctx.save();
            ctx.globalAlpha = alpha*0.5;
            ctx.shadowBlur = 12;
            ctx.shadowColor = getTrailColor(i);
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8 + (i*0.5), 0, Math.PI*2);
            ctx.fillStyle = getTrailColor(i);
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(drawTrail);
    }
    drawTrail();
})();

// Resume Download Function
function downloadResume() {
    // Create a temporary link to download resume
    const link = document.createElement('a');
    link.href = 'assets/Resume.pdf';
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
