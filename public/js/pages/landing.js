/**
 * Landing Page JavaScript
 * Handle landing page interactions
 */

// Smooth scroll for hero CTA
document.addEventListener('DOMContentLoaded', () => {
    // Add scroll animations
    observeElements();
    
    // Add active state to navbar on scroll
    handleNavbarScroll();
    
    // Add parallax effect to hero orbs
    handleParallax();
});

/**
 * Observe elements for scroll animations
 */
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observe all cards and sections
    const elements = document.querySelectorAll(
        '.feature-card, .step-card, .testimonial-card, .pricing-card'
    );
    
    elements.forEach(el => observer.observe(el));
}

/**
 * Handle navbar background on scroll
 */
function handleNavbarScroll() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Handle parallax effect for hero orbs
 */
function handleParallax() {
    const orbs = document.querySelectorAll('.hero-orb');
    
    if (orbs.length === 0) return;
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 0.3;
            const yPos = -(scrolled * speed);
            orb.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/**
 * Track button clicks (analytics placeholder)
 */
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const action = this.textContent.trim();
        console.log('Button clicked:', action);
        // Add analytics tracking here
        // gtag('event', 'click', { 'event_category': 'Button', 'event_label': action });
    });
});

/**
 * Newsletter subscription (placeholder)
 */
const newsletterForm = document.getElementById('newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        try {
            // Send to backend
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            if (response.ok) {
                alert('Cảm ơn bạn đã đăng ký!');
                newsletterForm.reset();
            }
        } catch (error) {
            console.error('Newsletter error:', error);
        }
    });
}
