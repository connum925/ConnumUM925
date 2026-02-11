/**
 * Animations Module
 * Handles reveal-on-scroll animations using IntersectionObserver
 */

class Animations {
    constructor() {
        this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.init();
    }

    init() {
        if (this.prefersReducedMotion) {
            // If user prefers reduced motion, reveal all elements immediately
            this.revealAll();
            return;
        }

        // Setup IntersectionObserver for reveal animations
        this.setupRevealObserver();

        // Setup lazy loading for images
        this.setupLazyLoading();
    }

    setupRevealObserver() {
        const revealElements = document.querySelectorAll('.reveal-fade');

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    // Optional: unobserve after revealing to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(el => observer.observe(el));
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        lazyImages.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });

            // If image is already loaded (cached)
            if (img.complete) {
                img.classList.add('loaded');
            }
        });
    }

    revealAll() {
        const revealElements = document.querySelectorAll('.reveal-fade');
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    // Method to reveal new elements dynamically added to the page
    observeNewElements(elements) {
        if (this.prefersReducedMotion) {
            elements.forEach(el => el.classList.add('revealed'));
            return;
        }

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        elements.forEach(el => {
            if (el.classList.contains('reveal-fade')) {
                observer.observe(el);
            }
        });
    }
}

// Create and export singleton instance
const animations = new Animations();
export default animations;
