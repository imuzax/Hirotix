// script.js
// Basic interactions for the Hirotix frontend prototype

document.addEventListener('DOMContentLoaded', () => {

    // 0. Loader Slide Up Logic
    const loader = document.getElementById('pageLoader');
    if (loader) {
        // Wait slightly to show brand, then slide up
        setTimeout(() => {
            loader.classList.add('slide-up');
            // Remove from DOM after transition (0.8s) so it doesn't block clicks
            setTimeout(() => {
                loader.style.display = 'none';
            }, 800);
        }, 1200);
    }

    // 1. SaaS Navigation Logic
    const navbar = document.getElementById('mainNavbar');
    const announcement = document.getElementById('announcementBar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Navbar expansion (Dynamic Island effect)
        if (currentScrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Announcement Bar visibility (Only at top)
        if (currentScrollY > 10) {
            announcement.style.transform = 'translateY(-100%)';
            announcement.style.opacity = '0';
        } else {
            announcement.style.transform = 'translateY(0)';
            announcement.style.opacity = '1';
        }

        lastScrollY = currentScrollY;
    });

    // 2. Mobile Menu Toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('ion-icon');
            icon.name = navLinks.classList.contains('active') ? 'close-outline' : 'menu-outline';
        });
    }

    // 3. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const faders = document.querySelectorAll('.fade-in-section');

    // Add staggered delays to children if they are steps
    document.querySelectorAll('.timeline').forEach(timeline => {
        const steps = timeline.querySelectorAll('.timeline-step');
        steps.forEach((step, index) => {
            step.style.transitionDelay = `${index * 0.15}s`;
        });
    });

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    // 4. Hero Particles Interaction (Optional but Premium)
    const heroParticles = document.getElementById('heroParticles');
    if (heroParticles) {
        for (let i = 0; i < 20; i++) {
            const dot = document.createElement('div');
            dot.className = 'hero-dot';
            dot.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                background: var(--accent-color);
                border-radius: 50%;
                opacity: ${Math.random() * 0.3};
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: float-slow ${Math.random() * 10 + 10}s linear infinite;
            `;
            heroParticles.appendChild(dot);
        }
    }
});

// Keyframe for floating particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float-slow {
        0% { transform: translate(0, 0); }
        50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
        100% { transform: translate(0, 0); }
    }
`;
document.head.appendChild(style);
