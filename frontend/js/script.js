// script.js
// Basic interactions for the Hirotix frontend prototype

document.addEventListener('DOMContentLoaded', () => {

    // 0. Loader Slide Up Logic
    const loader = document.getElementById('pageLoader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('slide-up');
            setTimeout(() => {
                loader.style.display = 'none';
                // Trigger hero typewriter after loader is gone
                initTypewriter();
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

        // Parallax scroll for hero content
        const heroContent = document.querySelector('.hero-content');
        if (heroContent && currentScrollY < 600) {
            heroContent.style.transform = `translateY(${currentScrollY * 0.3}px)`;
            heroContent.style.opacity = 1 - (currentScrollY / 600);
        }

        lastScrollY = currentScrollY;
    });

    // 1.1 Mouse Parallax for Background Shapes
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const shapes = document.querySelectorAll('.bg-shape');
        shapes.forEach((shape, index) => {
            const factor = (index + 1) * 20;
            const moveX = (x - 0.5) * factor;
            const moveY = (y - 0.5) * factor;
            shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
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

    // 5. Typewriter Effect
    function initTypewriter() {
        const heroSubtitle = document.querySelector('.hero-content p');
        if (!heroSubtitle) return;

        const text = heroSubtitle.innerText;
        heroSubtitle.innerHTML = '';
        heroSubtitle.style.opacity = '1';
        
        let i = 0;
        const speed = 30; // ms

        function type() {
            if (i < text.length) {
                heroSubtitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }


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

    // 6. Universal Modal Logic
    const modalContent = {
        'resume-guide': {
            title: 'AI Resume Guide',
            body: `
                <div class="structured-content">
                    <div class="content-section">
                        <ion-icon name="key-outline" class="section-icon"></ion-icon>
                        <h4>1. The Power of Keywords</h4>
                        <p>Our AI analyzes job descriptions in real-time. To match them, your resume must use industry-standard terminology. Hirotix highlights these keywords for you.</p>
                    </div>
                    
                    <div class="content-section">
                        <ion-icon name="text-outline" class="section-icon"></ion-icon>
                        <h4>2. Clean Formatting</h4>
                        <p>Avoid complex tables or images that trip up AI scanners. Use clear headings like <b>Experience</b>, <b>Education</b>, and <b>Skills</b>.</p>
                    </div>
                    
                    <div class="content-section">
                        <ion-icon name="rocket-outline" class="section-icon"></ion-icon>
                        <h4>3. Action-Oriented Bullets</h4>
                        <p>Instead of "Responsible for...", use "Engineered...", "Optimized...", or "Led...". Quantify your results (e.g., "Increased efficiency by 20%").</p>
                    </div>
                    
                    <div class="highlight-box">
                        <ion-icon name="bulb-outline"></ion-icon>
                        <span><b>Pro Tip:</b> Use our built-in AI Resume Builder to automatically apply these standards!</span>
                    </div>
                </div>
            `
        },
        'career-blog': {
            title: 'Hirotix Career Blog',
            body: `
                <div class="structured-content">
                    <h4><ion-icon name="newspaper-outline"></ion-icon> Latest Articles</h4>
                    <ul class="blog-list">
                        <li>
                            <b>The Rise of AI Synergy</b>
                            <p>How matching your unique skills with the right company culture leads to 3x faster career growth.</p>
                        </li>
                        <li>
                            <b>Ace the Technical Interview</b>
                            <p>Tips from top engineering leads at Google and Meta on what they really look for in 2026.</p>
                        </li>
                    </ul>
                    <p>Stay tuned for weekly updates from the Hirotix Team.</p>
                </div>
            `
        },
        'privacy': {
            title: 'Privacy Policy',
            body: `
                <div class="structured-content">
                    <h4><ion-icon name="shield-checkmark-outline"></ion-icon> Data Protection</h4>
                    <p>We take your privacy seriously. Here is how we handle your information:</p>
                    <ul class="standard-list">
                        <li><b>Encryption:</b> All personal data is encrypted using AES-256 standards.</li>
                        <li><b>Anonymization:</b> Your profile is anonymized during the initial matching phase.</li>
                        <li><b>No Third-Party Sharing:</b> We never sell your data; it stays within Hirotix.</li>
                    </ul>
                    <div class="contact-box">
                         <ion-icon name="mail-outline"></ion-icon> <span>Enquiries: <u>privacy@hirotix.com</u></span>
                    </div>
                </div>
            `
        },
        'terms': {
            title: 'Terms of Service',
            body: `
                <div class="structured-content">
                    <h4><ion-icon name="document-text-outline"></ion-icon> User Agreement</h4>
                    <p>By accessing Hirotix, you agree to the following terms:</p>
                    <ol class="standard-list">
                        <li><b>Accuracy:</b> You must provide truthful academic and professional information.</li>
                        <li><b>Platform Use:</b> Any attempt to 'game' the matching algorithm is prohibited.</li>
                        <li><b>Liability:</b> Hirotix is a matching tool; final hiring remains the employer's choice.</li>
                    </ol>
                    <div class="update-tag">
                        <ion-icon name="time-outline"></ion-icon> <span>Last Updated: March 2026</span>
                    </div>
                </div>
            `
        },
        'about': {
            title: 'About the Project',
            body: `
                <div class="structured-content">
                    <h4><ion-icon name="sparkles-outline"></ion-icon> The Hirotix Vision</h4>
                    <p>Hirotix was born from the idea that the traditional job search is broken. We use advanced neural matching to connect the right talent with the right opportunity, instantly.</p>
                    
                    <div class="team-grid">
                        <div class="team-member card-wow">
                            <ion-icon name="code-slash-outline"></ion-icon>
                            <b>Developers:</b>
                            <p>Hussain Muzaffar & Sayyed Guftan</p>
                        </div>
                        <div class="team-member card-wow">
                            <ion-icon name="school-outline"></ion-icon>
                            <b>Project Guides:</b>
                            <p>Prof. Mahwish Momin & Prof. Affan Khan</p>
                        </div>
                    </div>
                    
                    <p class="footer-note">Proudly developed for the College Project Submission (BCA) 2026.</p>
                </div>
            `
        },
        'academic': {
            title: 'Academic Information',
            body: `
                <div class="structured-content">
                    <h4><ion-icon name="book-outline"></ion-icon> Technical Architecture</h4>
                    <p>This project explores several key areas of modern software engineering:</p>
                    <ul class="standard-list">
                        <li><b>Front-end:</b> Glassmorphism UI, Liquid Animations, and Responsive Design.</li>
                        <li><b>Back-end:</b> Scalable Node.js architecture with Real-time AI processing.</li>
                        <li><b>AI Engine:</b> Custom neural matching logic for high-precision recruitment.</li>
                    </ul>
                    <p class="footer-note"><b>Subject:</b> Final Year Project - BCA (Bachelor of Computer Applications)</p>
                </div>
            `
        }
    };

    const modalOverlay = document.getElementById('universalModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalTriggers = document.querySelectorAll('.modal-trigger');
    const modalCloseButtons = document.querySelectorAll('.modal-close');

    function openModal(type) {
        const content = modalContent[type];
        if (content && modalOverlay) {
            modalTitle.innerText = content.title;
            modalBody.innerHTML = content.body;
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        }
    }

    function closeModal() {
        if (modalOverlay) {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = ''; // Restore scroll
        }
    }

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const type = trigger.getAttribute('data-modal');
            openModal(type);
        });
    });

    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', closeModal);
    });

    // Close on outside click
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) closeModal();
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // --- Contact Form Logic ---
    const contactForm = document.getElementById('contactForm');
    const contactFormContainer = document.querySelector('.contact-form-container');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && contactFormContainer) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Prepare data
            const payload = {
                fullName: document.getElementById('userName').value,
                email: document.getElementById('userEmail').value,
                subject: document.getElementById('userSubject').value,
                message: document.getElementById('userMessage').value
            };

            // Simulate loading state
            const btnText = submitBtn.querySelector('span');
            const btnIcon = submitBtn.querySelector('ion-icon');

            btnText.innerText = "Transmitting Message...";
            submitBtn.disabled = true;
            submitBtn.style.opacity = "0.7";
            btnIcon.setAttribute('name', 'refresh-outline');
            btnIcon.style.animation = "spin 1s linear infinite";

            // Add spin animation dynamically if not present
            if (!document.getElementById('spinStyle')) {
                const spinStyle = document.createElement('style');
                spinStyle.id = 'spinStyle';
                spinStyle.textContent = `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`;
                document.head.appendChild(spinStyle);
            }

            try {
                // Call actual API
                await submitContact(payload);
                
                // Show success state
                contactFormContainer.classList.add('success');
                window.scrollTo({ top: contactFormContainer.offsetTop - 100, behavior: 'smooth' });
            } catch (error) {
                alert(error.message || "Failed to send message. Please check your connection.");
                
                // Reset button on error
                btnText.innerText = "Send Message";
                submitBtn.disabled = false;
                submitBtn.style.opacity = "1";
                btnIcon.setAttribute('name', 'paper-plane-outline');
                btnIcon.style.animation = "";
            }
        });
    }
});

// Global function for form reset (called from HTML)
function resetContactForm() {
    const contactForm = document.getElementById('contactForm');
    const contactFormContainer = document.querySelector('.contact-form-container');
    const submitBtn = document.getElementById('submitBtn');

    if (contactForm && contactFormContainer) {
        contactForm.reset();
        contactFormContainer.classList.remove('success');
        
        // Reset button state
        const btnText = submitBtn.querySelector('span');
        const btnIcon = submitBtn.querySelector('ion-icon');
        btnText.innerText = "Send Message";
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        btnIcon.setAttribute('name', 'paper-plane-outline');
        btnIcon.style.animation = "";
    }
}

// Keyframe for floating particles
const styleElement = document.createElement('style');
styleElement.textContent = `
    @keyframes float-slow {
        0% { transform: translate(0, 0); }
        50% { transform: translate(${Math.random() * 40 - 20}px, ${Math.random() * 40 - 20}px); }
        100% { transform: translate(0, 0); }
    }
`;
document.head.appendChild(styleElement);
