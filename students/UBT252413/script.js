document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis for Smooth Momentum Scrolling
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Web Audio API - UI Sound Synthesis
    let audioCtx;
    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    function playTick() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.05);
        
        gainNode.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);
    }

    function playClick() {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    // Attach audio listeners. AudioContext requires user interaction to unlock.
    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('mouseover', initAudio, { once: true });

    const interactables = document.querySelectorAll('button, a, .masonry-item');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', playTick);
    });

    const clickables = document.querySelectorAll('button, .nav-links a');
    clickables.forEach(el => {
        el.addEventListener('click', playClick);
    });

    // Initial Hero Sequence
    const initHeroAnimation = () => {
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

        tl.fromTo(".split-text", 
            { y: 60, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.4 }
        )
        .fromTo(".gsap-hero-reveal",
            { y: 40, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2, stagger: 0.15 },
            "-=0.9"
        );
    };

    // Execute immediately on load
    initHeroAnimation();

    // -------------------------------------------------------------
    // THREE.JS - STATIC WIREFRAME AURA
    // -------------------------------------------------------------
    const webglContainer = document.getElementById("hero-webgl");
    let scene, camera, renderer, aura;

    if (webglContainer) {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 10;

        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        webglContainer.appendChild(renderer.domElement);

        const geometry = new THREE.IcosahedronGeometry(3, 1);
        const material = new THREE.MeshBasicMaterial({ 
            wireframe: true, 
            color: 0xFF5500, 
            transparent: true, 
            opacity: 0.25 
        });
        aura = new THREE.Mesh(geometry, material);
        
        // Position directly behind the hero profile picture
        aura.position.set(3.5, 0, 0); 
        scene.add(aura);

        // Passive Rotation Loop synchronized to GSAP Ticker
        const animate3D = () => {
            aura.rotation.y += 0.003;
            renderer.render(scene, camera);
        };
        gsap.ticker.add(animate3D);

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // First Frame Disappearance (Hero Section)
        gsap.to(material, {
            opacity: 0,
            scrollTrigger: {
                trigger: ".section-hero",
                start: "top top",
                end: "bottom center",
                scrub: true,
                onUpdate: (self) => {
                    aura.visible = material.opacity > 0.01;
                }
            }
        });
    }



    // GSAP ScrollTrigger - General Architecture Reveals
    const scrollSections = document.querySelectorAll(".gsap-scroll-reveal:not(#portfolio)");

    scrollSections.forEach(section => {
        let elementsToAnimate = Array.from(section.children);

        gsap.fromTo(elementsToAnimate, 
            { 
                y: 60, 
                opacity: 0 
            },
            {
                y: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.15,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Dedicated 2D Portfolio Grid Stagger & Parallax
    const portfolioSection = document.getElementById("portfolio");
    if (portfolioSection) {
        const heading = portfolioSection.querySelector(".section-heading");
        const items = portfolioSection.querySelectorAll(".masonry-item");

        if (heading) {
            gsap.fromTo(heading, 
                { y: 60, opacity: 0 }, 
                { 
                    y: 0, opacity: 1, duration: 1, ease: "power3.out",
                    scrollTrigger: {
                        trigger: portfolioSection,
                        start: "top 75%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }

        if (items.length > 0) {
            items.forEach((item, index) => {
                // Determine parallax speed based on even/odd index
                const yOffset = index % 2 === 0 ? 100 : 150; 
                const yParallax = index % 2 === 0 ? -30 : -10;

                // 1. Initial fade-in stagger
                gsap.fromTo(item,
                    { y: yOffset, opacity: 0 },
                    {
                        y: 0, opacity: 1, duration: 1.2, ease: "power3.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 90%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );

                // 2. Continuous Parallax Glide on scroll
                gsap.to(item, {
                    yPercent: yParallax,
                    ease: "none",
                    scrollTrigger: {
                        trigger: portfolioSection,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true
                    }
                });
            });
        }
    }
    
    // Ensure accurate full document height calculations once all images fully load
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    // Cinematic Lightbox (Modal) Physics
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.querySelector('.lightbox-img');
    const lightboxClose = document.querySelector('.lightbox-close');
    const masonryItems = document.querySelectorAll('.masonry-item');

    if (lightbox && lightboxImg && lightboxClose) {
        masonryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const img = item.querySelector('.masonry-image');
                if (!img) return;

                // Bind exact high-res source
                lightboxImg.src = img.src;

                // Cinematic Fade & Scale Reveal
                gsap.to(lightbox, { opacity: 1, pointerEvents: 'auto', duration: 0.4, ease: 'power3.out' });
                gsap.to(lightboxImg, { scale: 1, duration: 0.5, ease: 'back.out(1.5)' });
            });
        });

        const closeLightbox = () => {
            gsap.to(lightbox, { opacity: 0, pointerEvents: 'none', duration: 0.3, ease: 'power2.in' });
            gsap.to(lightboxImg, { scale: 0.95, duration: 0.3, ease: 'power2.in' });
        };

        lightboxClose.addEventListener('click', closeLightbox);
        
        // Allow clicking the background overlay to close
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Light Trail Drawing Engine
    const trailCanvas = document.getElementById("trail-canvas");
    if (trailCanvas) {
        const ctx = trailCanvas.getContext("2d");
        let points = [];
        const maxAge = 15; // Fast snappier lifespan
        
        const resizeCanvas = () => {
            trailCanvas.width = window.innerWidth;
            trailCanvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const addPoint = (x, y) => {
            points.push({ x, y, age: 0 });
        };

        window.addEventListener('mousemove', (e) => addPoint(e.clientX, e.clientY));
        
        // Touch support for mobile dragging
        window.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                addPoint(e.touches[0].clientX, e.touches[0].clientY);
            }
        }, { passive: true });

        const drawTrail = () => {
            ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
            
            if (points.length < 2) {
                if (points.length > 0) points[0].age++;
                if (points.length > 0 && points[0].age > maxAge) points.shift();
                return;
            }

            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.shadowBlur = 15;
            ctx.shadowColor = "#FF5500";

            // Draw segmented lines to control individual thickness and alpha dynamically
            for (let i = 0; i < points.length - 1; i++) {
                const p1 = points[i];
                const p2 = points[i + 1];
                
                const lifeProgress = p1.age / maxAge;
                const alpha = Math.max(0, 1 - lifeProgress);
                const thickness = Math.max(0.1, (1 - lifeProgress) * 6); // Organic taper physics

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = `rgba(255, 85, 0, ${alpha})`;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }

            // Iterate ages and prune dead coordinates memory
            for (let i = 0; i < points.length; i++) {
                points[i].age += 1;
            }
            points = points.filter(p => p.age <= maxAge);
        };
        
        // Tie rendering loop to GSAP for flawless unified timing
        gsap.ticker.add(drawTrail);
    }

    // Dynamic Spotlight & Custom Magnetic Cursor
    const mouseGlow = document.querySelector('.mouse-glow');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const cursorRing = document.querySelector('.custom-cursor-ring');

    if (mouseGlow) {
        gsap.to(mouseGlow, { scale: 1.2, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }

    if (cursorDot && cursorRing) {
        // Use GSAP quickTo for high performance tracking
        const xToDot = gsap.quickTo(cursorDot, "x", { duration: 0, ease: "none" });
        const yToDot = gsap.quickTo(cursorDot, "y", { duration: 0, ease: "none" });
        
        const xToRing = gsap.quickTo(cursorRing, "x", { duration: 0.15, ease: "power3" });
        const yToRing = gsap.quickTo(cursorRing, "y", { duration: 0.15, ease: "power3" });
        
        const xToGlow = mouseGlow ? gsap.quickTo(mouseGlow, "x", { duration: 0.8, ease: "power3" }) : null;
        const yToGlow = mouseGlow ? gsap.quickTo(mouseGlow, "y", { duration: 0.8, ease: "power3" }) : null;

        window.addEventListener('mousemove', (e) => {
            xToDot(e.clientX);
            yToDot(e.clientY);
            xToRing(e.clientX);
            yToRing(e.clientY);
            if (xToGlow && yToGlow) {
                xToGlow(e.clientX);
                yToGlow(e.clientY);
            }
        });

        // Add 'VIEW' hover state specifically to portfolio items
        masonryItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                cursorRing.classList.add('active');
            });
            item.addEventListener('mouseleave', () => {
                cursorRing.classList.remove('active');
            });
        });
    }
});
