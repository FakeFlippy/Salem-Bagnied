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
        this.setupJukeboxControls();
        
        // Particle effect disabled
    }
    
    setupEventListeners() {
        // Setup start CD click
        this.startCD.addEventListener('click', () => this.startPortfolio());
        
        // Allow Enter key to start (only once the boot sequence has handed off)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' &&
                window.bootComplete &&
                !this.entryElement.classList.contains('fade-out')) {
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
    
    setupJukeboxControls() {
        const playBtn = document.getElementById('play-btn');
        const stopBtn = document.getElementById('stop-btn');
        
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                // Start the music player when PLAY is pressed
                if (window.musicPlayer) {
                    window.musicPlayer.startMusic();
                }
                // Add visual feedback
                playBtn.style.background = '#00ff80';
                playBtn.style.color = '#000';
                setTimeout(() => {
                    playBtn.style.background = '';
                    playBtn.style.color = '';
                }, 200);
            });
        }
        
        if (stopBtn) {
            stopBtn.addEventListener('click', () => {
                // Hide the music player and stop playback when STOP is pressed
                if (window.musicPlayer) {
                    if (window.musicPlayer.isPlaying) {
                        window.musicPlayer.togglePlay();
                    }
                    window.musicPlayer.hide();
                }
                // Add visual feedback
                stopBtn.style.background = '#ff0080';
                stopBtn.style.color = '#000';
                setTimeout(() => {
                    stopBtn.style.background = '';
                    stopBtn.style.color = '';
                }, 200);
            });
        }
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
        
        // Open the detail modal for this project
        if (window.projectModal) {
            window.projectModal.open(card.dataset.project);
        }
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

// Project Detail Modal System
const PROJECT_DETAILS = {
    1: {
        window: 'WELLNESS.EXE',
        title: 'Medical Wellness App',
        role: 'Sole Developer · Medical Research Group',
        summary: 'React Native application built for a medical research group in partnership with Caretaker Medical, turning continuous vital-sign streams into guided wellness interventions and research-grade datasets.',
        highlights: [
            'Integrated Bluetooth Low Energy medical devices to stream heart rate and vital signs directly into the app in real time.',
            'Built HRV analytics that derive interbeat intervals from raw sensor output and surface trends through live visualizations.',
            'Designed a guided breathing experience that paces the user and measures the physiological response before and after each session.',
            'Implemented CSV parsing and export so researchers can pull structured session data straight into their analysis workflows.',
            'Layered AI-driven insight generation on top of the collected metrics to summarize patterns for non-technical users.'
        ],
        stack: ['React Native', 'Expo', 'JavaScript', 'BLE', 'Python', 'HRV Analysis']
    },
    2: {
        window: 'COURSEREVIEW.EXE',
        title: 'Course Review System',
        role: 'Team Project · Agile Development',
        summary: 'Full-stack Java desktop application that lets UVA students search courses, publish reviews, and manage their own contributions behind an authenticated account.',
        highlights: [
            'Built a JavaFX desktop interface covering login, course search, and full review create/read/update/delete flows.',
            'Structured the codebase around MVC and DAO patterns so persistence could be swapped without touching UI logic.',
            'Implemented persistent storage against SQLite with Hibernate, plus a JSON fallback layer for lightweight local runs.',
            'Worked in an agile team with iterative sprints, shared code review, and coordinated Git branching.'
        ],
        stack: ['Java', 'JavaFX', 'Hibernate', 'SQLite', 'JSON', 'MVC/DAO', 'Gradle']
    },
    3: {
        window: 'ONSCENE.EXE',
        title: 'OnScene',
        role: 'Developer · Emergency Medical Tooling',
        summary: 'AI-powered documentation system for emergency medical responders that converts spoken field reports into structured written records, cutting report time by roughly 95%.',
        highlights: [
            'Integrated OpenAI Whisper for speech-to-text transcription tuned to noisy, high-stress field audio.',
            'Served the transcription and NLP pipeline through a containerized Flask backend for consistent deployment.',
            'Built the responder-facing mobile client in React Native with Expo for rapid field iteration.',
            'Used Firebase for authentication and synchronized report storage across devices.',
            'Reduced documentation turnaround dramatically by replacing manual typing with dictation plus automated structuring.'
        ],
        stack: ['React Native', 'Python', 'Whisper AI', 'PyTorch', 'Flask', 'Docker', 'Firebase']
    },
    4: {
        window: 'GROUNDSGO.EXE',
        title: 'GroundsGo Transit',
        role: 'Creator',
        summary: 'Unified real-time transit tracker that merges UVA campus buses and Charlottesville city lines into one app, solving the gap where riders had to juggle separate TransLoc and SPOT apps.',
        highlights: [
            'Aggregated multiple independent transit feeds into a single normalized real-time view of campus and city routes.',
            'Built live map tracking so riders can see actual vehicle positions rather than static schedules.',
            'Added AI-assisted trip planning that recommends routes across both systems for a given origin and destination.',
            'Extended coverage to UTS OnDemand overnight service, filling the hours when fixed routes stop running.'
        ],
        stack: ['React Native', 'Expo SDK', 'JavaScript', 'Maps API', 'AI Planning']
    },
    5: {
        window: 'VRCYCLING.EXE',
        title: 'VR Cycling Safety Research',
        role: 'Research Assistant · UVA Link Lab',
        summary: 'Multi-sensor physiological data integration system for VR cycling safety research, synchronizing four independent data streams with Unix millisecond precision to correlate rider stress against measured collision risk.',
        highlights: [
            'Synchronized four concurrent streams — Polar H10 heart rate and HRV over BLE-to-UDP, Arduino GSR/SCR, Tobii Pro VR gaze tracking, and vehicle risk metrics — sampling from 10Hz to 100Hz on a shared millisecond clock.',
            'Developed Unity C# scripts computing real-time collision risk via closest-point-of-pairs geometry, deriving time-to-collision and distance-of-closest-approach per frame.',
            'Built a Python pipeline with pandas and NumPy that resamples to a uniform 100ms grid and automatically merges the streams into 43-column analysis-ready datasets.',
            'Computed gaze entropy metrics (stationary and transition) to quantify how visual attention degrades under rising risk.',
            'Programmed Arduino firmware sampling GSR at 50Hz, bridged into Unity through a custom Python UDP relay.',
            'Produced 300 DPI matplotlib visualizations and full technical documentation supporting publication.'
        ],
        stack: ['Unity', 'C#', 'Python', 'Arduino', 'pandas', 'NumPy', 'BLE', 'Eye Tracking', 'matplotlib']
    },
    6: {
        window: 'SIZZLE.EXE',
        title: 'Sizzle',
        role: 'Full-Stack Developer',
        summary: 'Food discovery app that applies a swipe-to-decide interface to recipes, combining OCR pantry input with a social feed so cooking choices are driven by what you actually have on hand.',
        highlights: [
            'Built a Tinder-style swipe interface for browsing and saving recipe matches.',
            'Implemented OCR receipt scanning so users can populate their pantry by photographing a grocery receipt.',
            'Developed a social feed letting users share cooks and follow other people\'s discoveries.',
            'Stood up an Express and Node.js backend with Firebase handling authentication and data sync.',
            'Shipped on Expo SDK 54 with a React Native client.'
        ],
        stack: ['React Native', 'Expo SDK 54', 'Node.js', 'Express', 'Firebase', 'OCR']
    },
    7: {
        window: 'SCOOTERDET.EXE',
        title: 'E-Scooter Sensor Fusion',
        role: 'Research Assistant · UVA Link Lab',
        summary: 'Real-time multi-sensor perception pipeline for semi-autonomous e-scooter safety, running on an NVIDIA Jetson Orin Nano and fusing stereo depth, 2D LiDAR, and neural object detection into per-object range estimates.',
        highlights: [
            'Fused an Intel RealSense D435i depth camera, RPLidar S3 2D scanner, and YOLO11n detection into a single perception output.',
            'Built a timestamp-ordered priority queue that aligns asynchronous sensor streams inside a 150ms window.',
            'Designed a distance-weighted fusion model favoring stereo depth under 3m and LiDAR beyond it, degrading gracefully when either sensor drops out.',
            'Mapped detection bounding boxes to LiDAR bearing sectors through camera-FOV pixel-to-angle projection for per-object ranging.',
            'Captured the onboard IMU at 200/400Hz, classifying road surface texture via FFT band-energy analysis.',
            'Detected pothole impacts through accelerometer spike thresholding and exported vibration profiles for replay in a Unity VR cycling simulation.'
        ],
        stack: ['Python', 'YOLO11n', 'OpenCV', 'NumPy', 'RealSense', 'RPLidar', 'Jetson Orin', 'FFT', 'Unity']
    }
};

class ProjectModal {
    constructor() {
        this.modal = document.getElementById('project-modal');
        this.backdrop = document.getElementById('project-modal-backdrop');
        if (!this.modal) return;
        
        this.lastFocused = null;
        this.setupEvents();
    }
    
    setupEvents() {
        document.getElementById('modal-close').addEventListener('click', () => this.close());
        document.getElementById('modal-close-dot').addEventListener('click', () => this.close());
        this.backdrop.addEventListener('click', () => this.close());
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) this.close();
        });
    }
    
    isOpen() {
        return this.modal.classList.contains('show');
    }
    
    open(projectId) {
        const data = PROJECT_DETAILS[projectId];
        if (!data) return;
        
        this.lastFocused = document.activeElement;
        
        document.getElementById('modal-window-name').textContent = data.window;
        document.getElementById('modal-title').textContent = data.title;
        document.getElementById('modal-role').textContent = data.role;
        document.getElementById('modal-summary').textContent = data.summary;
        
        const highlights = document.getElementById('modal-highlights');
        highlights.innerHTML = '';
        data.highlights.forEach(text => {
            const li = document.createElement('li');
            li.textContent = text;
            highlights.appendChild(li);
        });
        
        const stack = document.getElementById('modal-stack');
        stack.innerHTML = '';
        data.stack.forEach(tech => {
            const span = document.createElement('span');
            span.textContent = tech;
            stack.appendChild(span);
        });
        
        const links = document.getElementById('modal-links');
        links.innerHTML = '';
        (data.links || []).forEach(link => {
            const a = document.createElement('a');
            a.href = link.url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = link.label;
            links.appendChild(a);
        });
        
        this.backdrop.classList.add('show');
        this.modal.classList.add('show');
        document.body.style.overflow = 'hidden';
        document.getElementById('modal-close').focus();
    }
    
    close() {
        this.modal.classList.remove('show');
        this.backdrop.classList.remove('show');
        document.body.style.overflow = '';
        this.modal.querySelector('.modal-body').scrollTop = 0;
        if (this.lastFocused) this.lastFocused.focus();
    }
}

// Interactive Terminal
class InteractiveTerminal {
    constructor() {
        this.form = document.getElementById('terminal-form');
        this.input = document.getElementById('terminal-input');
        this.output = document.getElementById('terminal-output');
        if (!this.form) return;
        
        this.history = [];
        this.historyIndex = -1;
        
        this.commands = {
            help: () => [
                'Available commands:',
                '  help        — show this list',
                '  skills      — list technical skills',
                '  projects    — list projects (click a card for details)',
                '  experience  — jump to the experience timeline',
                '  research    — current research focus',
                '  education   — degree and coursework',
                '  contact     — how to reach me',
                '  resume      — download resume PDF',
                '  music       — open the jukebox player',
                '  whoami      — short bio',
                '  clear       — clear this terminal'
            ],
            skills: () => [
                'Languages   : Python, Java, C#, C/C++, R, JavaScript, HTML, CSS',
                'Mobile      : React Native, Expo',
                'Backend     : Node.js, Express, Flask, Firebase, SQLite',
                'ML / CV     : PyTorch, Whisper, YOLO11n, OpenCV, Hugging Face',
                'Data        : pandas, NumPy, matplotlib',
                'Embedded    : Arduino, BLE, NVIDIA Jetson, RealSense, RPLidar',
                'XR          : Unity, Tobii Pro eye tracking'
            ],
            projects: () => {
                const names = Object.values(PROJECT_DETAILS).map((p, i) => `  ${i + 1}. ${p.title}`);
                return ['Projects on file:', ...names, '', 'Scroll to PROJECTS.DIR and click any card for the full writeup.'];
            },
            research: () => [
                'UVA Engineering Link Lab — Omni-Reality & Cognition Lab',
                'Research Assistant, Sep 2025 — Present',
                '',
                'Focus: multi-sensor physiological data integration for VR safety',
                'studies, plus real-time perception pipelines for micromobility.',
                'Run "projects" and open VR Cycling Safety Research or',
                'E-Scooter Sensor Fusion for the technical detail.'
            ],
            education: () => [
                'University of Virginia',
                'B.A. Computer Science (2022 — 2026)',
                'Minor: Technology Entrepreneurship, McIntire School of Commerce'
            ],
            contact: () => [
                'EMAIL    : s.bagnied@gmail.com',
                'LINKEDIN : linkedin.com/in/salem-bagnied',
                'GITHUB   : github.com/FakeFlippy'
            ],
            whoami: () => [
                'Salem Bagnied — full stack developer and research assistant at UVA.',
                'I build things that read the physical world: wearable sensors,',
                'VR instrumentation, computer vision on embedded hardware, and the',
                'mobile apps that make all that data legible to actual humans.'
            ],
            resume: () => {
                if (typeof downloadResume === 'function') downloadResume();
                return ['Downloading Salem_Bagnied_Resume.pdf ...'];
            },
            music: () => {
                if (window.musicPlayer) {
                    window.musicPlayer.show();
                    window.musicPlayer.expand();
                }
                return ['Jukebox online. Player expanded at the bottom of the screen.'];
            },
            experience: () => {
                const section = document.querySelector('.experience-section');
                if (section) section.scrollIntoView({ behavior: 'smooth' });
                return ['Jumping to EXPERIENCE.LOG ...'];
            },
            clear: () => {
                this.output.innerHTML = '';
                return null;
            }
        };
        
        this.setupEvents();
    }
    
    setupEvents() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const raw = this.input.value.trim();
            this.input.value = '';
            if (raw) this.run(raw);
        });
        
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.recall(1);
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.recall(-1);
            }
        });
    }
    
    recall(direction) {
        if (!this.history.length) return;
        this.historyIndex = Math.min(
            Math.max(this.historyIndex + direction, -1),
            this.history.length - 1
        );
        this.input.value = this.historyIndex === -1
            ? ''
            : this.history[this.history.length - 1 - this.historyIndex];
    }
    
    run(raw) {
        this.history.push(raw);
        this.historyIndex = -1;
        
        const cmd = raw.toLowerCase();
        this.print(`$ ${raw}`, 'cmd-echo');
        
        const handler = this.commands[cmd];
        if (!handler) {
            this.print(`command not found: ${raw} — type "help"`, 'cmd-error');
            this.scrollToEnd();
            return;
        }
        
        const result = handler();
        if (result) result.forEach(line => this.print(line));
        this.scrollToEnd();
    }
    
    print(text, extraClass) {
        const line = document.createElement('div');
        line.className = 'code-line' + (extraClass ? ' ' + extraClass : '');
        
        const prompt = document.createElement('span');
        prompt.className = 'prompt';
        prompt.textContent = extraClass === 'cmd-echo' ? '' : '>';
        
        const span = document.createElement('span');
        span.className = 'text';
        span.textContent = text;
        
        line.appendChild(prompt);
        line.appendChild(span);
        this.output.appendChild(line);
    }
    
    scrollToEnd() {
        this.output.scrollTop = this.output.scrollHeight;
    }
}

// CRT Boot Sequence
class CRTBoot {
    constructor(onComplete) {
        this.overlay = document.getElementById('crt-boot');
        this.log = document.getElementById('boot-log');
        this.onComplete = onComplete || (() => {});
        this.finished = false;
        
        if (!this.overlay || !this.log) {
            this.onComplete();
            return;
        }
        
        this.lines = [
            'RETROTECH BIOS v2.10 — (C) 1987',
            '',
            'MEMORY TEST ... <span class="ok">640K OK</span>',
            'DETECTING DRIVES ... <span class="ok">DONE</span>',
            '',
            'LOADING SALEM_BAGNIED.SYS',
            '  > PROFILE ......... <span class="ok">[ OK ]</span>',
            '  > PROJECTS ........ <span class="ok">[ OK ]</span>',
            '  > EXPERIENCE ...... <span class="ok">[ OK ]</span>',
            '  > JUKEBOX ......... <span class="ok">[ OK ]</span>',
            '',
            'INITIALIZING NEON SUBSYSTEM ... <span class="warn">MAXIMUM</span>',
            '',
            'READY.'
        ];
        
        this.start();
    }
    
    start() {
        document.getElementById('boot-skip').addEventListener('click', () => this.finish(true));
        
        document.addEventListener('keydown', this.skipHandler = (e) => {
            if (e.key === 'Escape' || e.key === 'Enter') this.finish(true);
        });
        
        // Honor reduced motion by skipping straight through
        if (document.body.classList.contains('no-motion')) {
            this.finish(true);
            return;
        }
        
        // Brief black screen before the tube warms up
        setTimeout(() => this.typeLines(0), 700);
    }
    
    typeLines(index) {
        if (this.finished) return;
        
        if (index >= this.lines.length) {
            setTimeout(() => this.finish(false), 600);
            return;
        }
        
        const line = document.createElement('div');
        line.className = 'boot-line';
        line.innerHTML = this.lines[index] || '&nbsp;';
        this.log.appendChild(line);
        
        // Blank lines pass quickly, content lines get a short beat
        const delay = this.lines[index] === '' ? 60 : 120 + Math.random() * 110;
        setTimeout(() => this.typeLines(index + 1), delay);
    }
    
    finish(skipped) {
        if (this.finished) return;
        this.finished = true;
        
        document.removeEventListener('keydown', this.skipHandler);
        
        const done = () => {
            this.overlay.classList.add('hidden');
            this.onComplete();
        };
        
        if (skipped) {
            this.overlay.style.opacity = '0';
            setTimeout(done, 400);
        } else {
            // Zoom through the screen so the viewer ends up "inside" it
            this.overlay.classList.add('zooming');
            setTimeout(done, 1550);
        }
    }
}

// Display Effects Settings
class EffectsSettings {
    constructor() {
        this.fab = document.getElementById('settings-fab');
        this.panel = document.getElementById('settings-panel');
        if (!this.fab) return;
        
        this.settings = {
            vhs: { key: 'vhs', bodyClass: 'no-vhs', el: document.getElementById('toggle-vhs'), on: true },
            trail: { key: 'trail', bodyClass: 'no-trail', el: document.getElementById('toggle-trail'), on: true },
            motion: { key: 'motion', bodyClass: 'no-motion', el: document.getElementById('toggle-motion'), on: false }
        };
        
        this.load();
        this.setupEvents();
    }
    
    setupEvents() {
        this.fab.addEventListener('click', (e) => {
            e.stopPropagation();
            this.panel.classList.toggle('show');
        });
        
        document.addEventListener('click', (e) => {
            if (!this.panel.contains(e.target) && e.target !== this.fab) {
                this.panel.classList.remove('show');
            }
        });
        
        Object.values(this.settings).forEach(setting => {
            if (!setting.el) return;
            setting.el.addEventListener('click', () => {
                setting.on = !setting.on;
                this.apply(setting);
                this.save();
            });
        });
    }
    
    apply(setting) {
        // "motion" is inverted: ON means motion is reduced
        const disabled = setting.key === 'motion' ? setting.on : !setting.on;
        document.body.classList.toggle(setting.bodyClass, disabled);
        setting.el.classList.toggle('on', setting.on);
        setting.el.setAttribute('aria-checked', String(setting.on));
    }
    
    load() {
        let saved = {};
        try {
            saved = JSON.parse(localStorage.getItem('retroEffects') || '{}');
        } catch (e) {
            saved = {};
        }
        
        // Respect the OS-level reduced motion preference by default
        if (saved.motion === undefined &&
            window.matchMedia &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            saved.motion = true;
        }
        
        Object.values(this.settings).forEach(setting => {
            if (saved[setting.key] !== undefined) {
                setting.on = saved[setting.key];
            }
            this.apply(setting);
        });
    }
    
    save() {
        const out = {};
        Object.values(this.settings).forEach(s => { out[s.key] = s.on; });
        try {
            localStorage.setItem('retroEffects', JSON.stringify(out));
        } catch (e) {
            // storage unavailable, settings simply won't persist
        }
    }
    
    show() {
        this.fab.classList.add('show');
    }
}

// Timeline Scroll Reveal
class TimelineReveal {
    constructor() {
        const items = document.querySelectorAll('.timeline-item');
        if (!items.length) return;
        
        if (!('IntersectionObserver' in window)) {
            items.forEach(item => item.classList.add('revealed'));
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const delay = Array.from(items).indexOf(item) % 2 === 0 ? 0 : 120;
                    setTimeout(() => item.classList.add('revealed'), delay);
                    observer.unobserve(item);
                }
            });
        }, { threshold: 0.25, rootMargin: '0px 0px -60px 0px' });
        
        items.forEach(item => observer.observe(item));
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
        if (inactive > 600) {
            fadeAlpha -= 0.12;
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
            ctx.arc(p.x, p.y, 6 + (i*0.3), 0, Math.PI*2);
            ctx.fillStyle = getTrailColor(i);
            ctx.fill();
            ctx.restore();
        }
        requestAnimationFrame(drawTrail);
    }
    drawTrail();
})();

// Music Player System
class MusicPlayer {
    constructor() {
        this.tracks = [
            { name: "Amnesia", artist: "Moochi", file: "assets/music/Moochi - Amnesia.mp3", cover: "assets/music/Amnesia.jpg" },
            { name: "Athena", artist: "Karl Casey", file: "assets/music/Karl Casey - Athena.mp3", cover: "assets/music/Athena.jpg" },
            { name: "Cloud Chaser", artist: "Karl Casey", file: "assets/music/Karl Casey - Cloud Chaser.mp3", cover: "assets/music/Cloud Surfer.jpg" },
            { name: "Departure", artist: "Karl Casey", file: "assets/music/Karl Casey - Departure.mp3", cover: "assets/music/Departure.jpg" },
            { name: "Malibu", artist: "jiglr", file: "assets/music/jiglr - Malibu.mp3", cover: "assets/music/Malibu.jpg" },
            { name: "Neon Dreams", artist: "lofidreams", file: "assets/music/lofidreams - Neon Dreams.mp3", cover: "assets/music/Neon Dreams.jpg" }
        ];
        this.currentTrack = 0;
        this.audio = new Audio();
        this.isPlaying = false;
        this.isVisible = false;
        this.isExpanded = false;
        
        this.init();
    }
    
    init() {
        this.setupAudio();
        this.setupControls();
        this.buildPlaylist();
        this.loadTrack(0);
    }
    
    setupAudio() {
        this.audio.loop = false;
        this.audio.volume = 0.7;
        
        this.audio.addEventListener('error', () => {
            console.log(`Track "${this.tracks[this.currentTrack].name}" failed to load`);
        });
        
        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });
        
        this.audio.addEventListener('ended', () => {
            this.nextTrack();
        });
    }
    
    setupControls() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const volumeSlider = document.getElementById('volume-slider');
        const expandBtn = document.getElementById('expand-btn');
        const collapseBtn = document.getElementById('collapse-btn');
        const compactPlayPause = document.getElementById('compact-play-pause');
        const compactNext = document.getElementById('compact-next');
        
        // Main controls
        playPauseBtn.addEventListener('click', () => this.togglePlay());
        prevBtn.addEventListener('click', () => this.prevTrack());
        nextBtn.addEventListener('click', () => this.nextTrack());
        volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        
        // Compact controls
        compactPlayPause.addEventListener('click', () => this.togglePlay());
        compactNext.addEventListener('click', () => this.nextTrack());
        
        // Expand/collapse
        expandBtn.addEventListener('click', () => this.expand());
        collapseBtn.addEventListener('click', () => this.collapse());
        
        // Playlist
        document.getElementById('playlist-toggle-btn').addEventListener('click', () => this.togglePlaylist());
        document.getElementById('playlist-close').addEventListener('click', () => this.togglePlaylist(false));
    }
    
    buildPlaylist() {
        const container = document.getElementById('playlist-tracks');
        if (!container) return;
        container.innerHTML = '';
        
        this.tracks.forEach((track, i) => {
            const item = document.createElement('div');
            item.className = 'playlist-item';
            item.dataset.index = i;
            item.innerHTML = `
                <img class="playlist-item-art" src="${track.cover}" alt="">
                <div class="playlist-item-info">
                    <div class="playlist-item-name">${track.name}</div>
                    <div class="playlist-item-artist">${track.artist}</div>
                </div>
                <span class="playlist-item-indicator">▶</span>
            `;
            item.addEventListener('click', () => this.selectTrack(i));
            container.appendChild(item);
        });
    }
    
    selectTrack(index) {
        const wasPlaying = this.isPlaying;
        this.loadTrack(index);
        if (!wasPlaying) {
            this.togglePlay();
        } else {
            this.audio.play().catch(() => {});
        }
        this.togglePlaylist(false);
    }
    
    togglePlaylist(force) {
        const panel = document.getElementById('playlist-panel');
        const open = force !== undefined ? force : !panel.classList.contains('open');
        panel.classList.toggle('open', open);
    }
    
    highlightActiveTrack() {
        document.querySelectorAll('.playlist-item').forEach((el, i) => {
            el.classList.toggle('active', i === this.currentTrack);
        });
    }
    
    setupVisualizer() {
        if (this.analyser) return;
        
        try {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (!AudioCtx) return;
            
            this.audioCtx = new AudioCtx();
            this.source = this.audioCtx.createMediaElementSource(this.audio);
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 128;
            
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);
            
            this.drawVisualizer();
        } catch (e) {
            console.log('Visualizer unavailable:', e.message);
        }
    }
    
    drawVisualizer() {
        const canvas = document.getElementById('audio-visualizer');
        if (!canvas || !this.analyser) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = 240;
        canvas.height = 60;
        
        const bufferLength = this.analyser.frequencyBinCount;
        const data = new Uint8Array(bufferLength);
        const barCount = 32;
        const barWidth = canvas.width / barCount;
        
        const render = () => {
            requestAnimationFrame(render);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (!this.isPlaying) return;
            
            this.analyser.getByteFrequencyData(data);
            
            for (let i = 0; i < barCount; i++) {
                const value = data[i];
                const barHeight = (value / 255) * canvas.height;
                const hue = 140 + (i / barCount) * 180;
                
                ctx.fillStyle = `hsl(${hue}, 100%, 55%)`;
                ctx.shadowBlur = 8;
                ctx.shadowColor = `hsl(${hue}, 100%, 55%)`;
                ctx.fillRect(
                    i * barWidth,
                    canvas.height - barHeight,
                    barWidth - 2,
                    barHeight
                );
            }
            ctx.shadowBlur = 0;
        };
        render();
    }
    
    loadTrack(index) {
        this.currentTrack = index;
        const track = this.tracks[index];
        this.audio.src = track.file;
        
        // Update track info in both views
        document.getElementById('track-name').textContent = track.name;
        document.getElementById('track-artist').textContent = track.artist;
        document.getElementById('compact-track-name').textContent = track.name;
        document.getElementById('compact-track-artist').textContent = track.artist;
        
        // Update album art in both views
        const compactAlbumArt = document.getElementById('compact-album-art');
        const expandedAlbumArt = document.getElementById('expanded-album-art');
        
        if (track.cover) {
            compactAlbumArt.src = track.cover;
            expandedAlbumArt.src = track.cover;
        }
        
        this.highlightActiveTrack();
    }
    
    togglePlay() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        const compactPlayPause = document.getElementById('compact-play-pause');
        
        if (this.isPlaying) {
            this.audio.pause();
            playPauseBtn.textContent = '▶';
            compactPlayPause.textContent = '▶';
            this.isPlaying = false;
        } else {
            this.setupVisualizer();
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            this.audio.play().catch(() => {
                console.log('Audio playback failed - files may not be loaded yet');
            });
            playPauseBtn.textContent = '⏸';
            compactPlayPause.textContent = '⏸';
            this.isPlaying = true;
        }
    }
    
    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play().catch(() => {});
        }
    }
    
    prevTrack() {
        this.currentTrack = this.currentTrack === 0 ? this.tracks.length - 1 : this.currentTrack - 1;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) {
            this.audio.play().catch(() => {});
        }
    }
    
    setVolume(value) {
        this.audio.volume = value / 100;
    }
    
    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';
            
            // Update time displays
            document.getElementById('current-time').textContent = this.formatTime(this.audio.currentTime);
            document.getElementById('total-time').textContent = this.formatTime(this.audio.duration);
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    show() {
        const player = document.getElementById('music-player');
        player.classList.add('show');
        this.isVisible = true;
    }
    
    hide() {
        const player = document.getElementById('music-player');
        player.classList.remove('show');
        this.isVisible = false;
    }
    
    expand() {
        const player = document.getElementById('music-player');
        player.classList.add('expanded');
        this.isExpanded = true;
    }
    
    collapse() {
        const player = document.getElementById('music-player');
        player.classList.remove('expanded');
        this.isExpanded = false;
    }
    
    startMusic() {
        console.log('Starting music player...');
        this.show();
        console.log('Player bar shown');
        setTimeout(() => {
            console.log('Attempting to play audio...');
            this.togglePlay();
        }, 500);
    }
}

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
    window.bootComplete = false;
    
    // Settings first so reduced-motion is applied before any animation runs
    window.effectsSettings = new EffectsSettings();
    
    window.musicPlayer = new MusicPlayer();
    window.projectModal = new ProjectModal();
    window.timelineReveal = new TimelineReveal();
    window.interactiveTerminal = new InteractiveTerminal();
    
    // Boot the CRT, then hand off to the jukebox
    window.crtBoot = new CRTBoot(() => {
        window.bootComplete = true;
        window.jukeboxEntry = new JukeboxEntry();
        if (window.effectsSettings) window.effectsSettings.show();
    });
    
    console.log('Salem Bagnied\'s 80s Retro Portfolio');
    console.log('Esc / Skip: Skip the boot sequence');
    console.log('Enter: Start from jukebox');
    console.log('Scroll: Navigate through sections');
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
