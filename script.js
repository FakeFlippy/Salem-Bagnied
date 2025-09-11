// Particle effects disabled

// Splash Screen Controller
class SplashScreen {
    constructor() {
        this.splashElement = document.getElementById('splash-screen');
        this.startButton = document.getElementById('start-button');
        this.mainContainer = document.getElementById('main-container');
        this.particleCanvas = document.getElementById('particle-canvas');
        
        this.init();
    }
    
    init() {
        // Particle effects disabled
        
        // Setup start button
        this.startButton.addEventListener('click', () => this.startPortfolio());
        
        // Allow Enter key to start
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !this.splashElement.classList.contains('fade-out')) {
                this.startPortfolio();
            }
        });
        
        // Auto-start after 10 seconds (optional)
        setTimeout(() => {
            if (!this.splashElement.classList.contains('fade-out')) {
                this.startPortfolio();
            }
        }, 15000);
    }
    
    startPortfolio() {
        // Add fade out class
        this.splashElement.classList.add('fade-out');
        
        // Show main container
        setTimeout(() => {
            this.mainContainer.classList.add('show');
        }, 500);
        
        // Remove splash screen from DOM
        setTimeout(() => {
            this.splashElement.style.display = 'none';
        }, 1000);
        
        // Initialize main screen
        setTimeout(() => {
            window.jukebox = new JukeboxPortfolio();
        }, 1500);
    }
}

// Portfolio Jukebox Interactive Script
class JukeboxPortfolio {
    constructor() {
        this.currentSection = null;
        this.isPlaying = false;
        this.cdContainers = document.querySelectorAll('.cd-container');
        this.contentDisplay = document.getElementById('content-display');
        this.ledDisplay = document.getElementById('current-track');
        this.insertedCd = document.getElementById('inserted-cd');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupControlButtons();
        this.preloadContent();
    }
    
    setupEventListeners() {
        // CD selection events
        this.cdContainers.forEach(container => {
            container.addEventListener('click', (e) => {
                const section = container.dataset.section;
                this.selectCD(section, container);
            });
            
            // Hover effects
            container.addEventListener('mouseenter', () => {
                if (!this.isPlaying) {
                    this.playHoverSound();
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });
    }
    
    setupControlButtons() {
        const playBtn = document.getElementById('play-btn');
        const stopBtn = document.getElementById('stop-btn');
        const ejectBtn = document.getElementById('eject-btn');
        
        playBtn.addEventListener('click', () => this.playCurrentSection());
        stopBtn.addEventListener('click', () => this.stopPlayback());
        ejectBtn.addEventListener('click', () => this.ejectCD());
    }
    
    selectCD(section, container) {
        if (this.currentSection === section && this.isPlaying) {
            return; // Already playing this section
        }
        
        // Update LED display
        this.updateLEDDisplay(`LOADING ${section.toUpperCase()}...`);
        
        // Animate CD insertion
        this.animateCDInsertion(container, section);
        
        // Load content after animation
        setTimeout(() => {
            this.loadSectionContent(section);
            this.currentSection = section;
            this.isPlaying = true;
            this.updateLEDDisplay(`NOW PLAYING: ${section.toUpperCase()}`);
        }, 800);
    }
    
    animateCDInsertion(container, section) {
        const cd = container.querySelector('.cd');
        const cdClone = cd.cloneNode(true);
        
        // Style the inserted CD
        this.insertedCd.innerHTML = '';
        this.insertedCd.appendChild(cdClone);
        this.insertedCd.className = `inserted-cd active ${section}-cd`;
        
        // Add insertion sound effect (optional)
        this.playInsertionSound();
        
        // Visual feedback on original CD
        container.style.opacity = '0.6';
        setTimeout(() => {
            container.style.opacity = '1';
        }, 1000);
    }
    
    loadSectionContent(section) {
        // Hide all content sections
        const allSections = document.querySelectorAll('.section-content');
        allSections.forEach(sec => {
            sec.classList.remove('active');
        });
        
        // Hide welcome message
        const welcomeMessage = document.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.style.display = 'none';
        }
        
        // Show selected section
        const targetContent = document.getElementById(`${section}-content`);
        if (targetContent) {
            // Clone content to content display
            const contentClone = targetContent.cloneNode(true);
            contentClone.classList.add('active');
            
            const contentScreen = document.querySelector('.content-screen');
            contentScreen.innerHTML = '';
            contentScreen.appendChild(contentClone);
            
            // Trigger entrance animation
            this.animateContentEntrance(contentClone);
        }
    }
    
    animateContentEntrance(content) {
        content.style.opacity = '0';
        content.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            content.style.transition = 'all 0.6s ease-out';
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        }, 100);
    }
    
    playCurrentSection() {
        if (this.currentSection && !this.isPlaying) {
            this.isPlaying = true;
            this.insertedCd.classList.add('active');
            this.updateLEDDisplay(`NOW PLAYING: ${this.currentSection.toUpperCase()}`);
            this.playClickSound();
        }
    }
    
    stopPlayback() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.insertedCd.classList.remove('active');
            this.updateLEDDisplay(`STOPPED: ${this.currentSection.toUpperCase()}`);
            this.playClickSound();
        }
    }
    
    ejectCD() {
        if (this.currentSection) {
            this.isPlaying = false;
            this.currentSection = null;
            
            // Animate CD ejection
            this.insertedCd.style.left = '150%';
            this.insertedCd.classList.remove('active');
            
            setTimeout(() => {
                this.insertedCd.style.left = '-100%';
                this.insertedCd.innerHTML = '';
            }, 800);
            
            // Show welcome message
            this.showWelcomeMessage();
            this.updateLEDDisplay('SELECT A DISC');
            this.playEjectSound();
        }
    }
    
    showWelcomeMessage() {
        const contentScreen = document.querySelector('.content-screen');
        contentScreen.innerHTML = `
            <div class="welcome-message">
                <h2>Welcome to My Interactive Portfolio</h2>
                <p>Select a CD to explore different aspects of my professional journey</p>
                <div class="animated-cd-demo">
                    <div class="demo-cd spinning">
                        <div class="cd-surface">
                            <div class="cd-hole"></div>
                            <div class="cd-reflection"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    updateLEDDisplay(text) {
        this.ledDisplay.textContent = text;
        
        // Add typing effect
        this.ledDisplay.style.animation = 'none';
        setTimeout(() => {
            this.ledDisplay.style.animation = 'ledGlow 2s ease-in-out infinite alternate';
        }, 100);
    }
    
    handleKeyboardNavigation(e) {
        const sections = ['about', 'experience', 'projects', 'resume'];
        
        switch(e.key) {
            case '1':
                this.selectCDByIndex(0);
                break;
            case '2':
                this.selectCDByIndex(1);
                break;
            case '3':
                this.selectCDByIndex(2);
                break;
            case '4':
                this.selectCDByIndex(3);
                break;
            case ' ':
                e.preventDefault();
                if (this.isPlaying) {
                    this.stopPlayback();
                } else {
                    this.playCurrentSection();
                }
                break;
            case 'Escape':
                this.ejectCD();
                break;
        }
    }
    
    selectCDByIndex(index) {
        const containers = Array.from(this.cdContainers);
        if (containers[index]) {
            const section = containers[index].dataset.section;
            this.selectCD(section, containers[index]);
        }
    }
    
    preloadContent() {
        // Preload any images or resources
        const images = document.querySelectorAll('img[src]');
        images.forEach(img => {
            const preloadImg = new Image();
            preloadImg.src = img.src;
        });
    }
    
    // Sound Effects (optional - can be enhanced with actual audio files)
    playInsertionSound() {
        this.playSound('insertion');
    }
    
    playEjectSound() {
        this.playSound('eject');
    }
    
    playClickSound() {
        this.playSound('click');
    }
    
    playHoverSound() {
        this.playSound('hover');
    }
    
    playSound(type) {
        // Web Audio API for simple sound effects
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // Different frequencies for different sounds
            switch(type) {
                case 'insertion':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.3);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.3);
                    break;
                case 'eject':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.2);
                    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.2);
                    break;
                case 'click':
                    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.1);
                    break;
                case 'hover':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    gainNode.gain.setValueAtTime(0.02, audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
                    oscillator.start(audioContext.currentTime);
                    oscillator.stop(audioContext.currentTime + 0.05);
                    break;
            }
        }
    }
}

// Resume Functions
function downloadResume() {
    // Create a temporary link to download resume
    const link = document.createElement('a');
    link.href = 'assets/resume.pdf'; // You'll need to add your actual resume file
    link.download = 'Resume.pdf';
    link.click();
    
    // Visual feedback
    const btn = event.target.closest('.download-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">✅</span> Downloaded!';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 2000);
}

function viewResume() {
    // Open resume in new tab or show inline
    window.open('Resume/index.html', '_blank');
    
    // Visual feedback
    const btn = event.target.closest('.view-btn');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="btn-icon">👁️</span> Opening...';
    
    setTimeout(() => {
        btn.innerHTML = originalText;
    }, 1500);
}

// All particle effects disabled

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize splash screen first
    const splash = new SplashScreen();
    
    // Add loading screen fade out
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Add keyboard shortcuts info
    console.log('🎵 Salem Bagnied\'s Portfolio - Keyboard Shortcuts:');
    console.log('Enter: Start from splash screen');
    console.log('1-4: Select CD sections');
    console.log('Space: Play/Pause');
    console.log('Escape: Eject CD');
});

// Add some CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    .cd-container.active {
        animation: pulse 2s ease-in-out infinite;
    }
    
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .content-display {
        animation: slideInFromRight 0.8s ease-out;
    }
`;
document.head.appendChild(style);
