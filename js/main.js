/**
 * Main JavaScript file for the bilingual portfolio website
 * Contains core functionality including language switching,
 * animation handling, and page initialization
 */

// Configuration
const CONFIG = {
    ANIMATION_DELAY: 100,
    FADE_THRESHOLD: 0.1,
    TIMELINE_THRESHOLD: 0.2
};

/**
 * Language Handling Module
 */
const LanguageManager = {
    // Switch the website language
    switchLanguage: function(lang) {
        const enContent = document.querySelector('.content.en');
        const grContent = document.querySelector('.content.gr');
        const buttons = document.querySelectorAll('.lang-btn');
        const popup = document.getElementById('popup');
    
        if (lang === 'en') {
            if (enContent) enContent.style.display = 'block';
            if (grContent) grContent.style.display = 'none';
        } else {
            if (enContent) enContent.style.display = 'none';
            if (grContent) grContent.style.display = 'block';
        }
    
        buttons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    
        // Store language preference
        localStorage.setItem('preferred-language', lang);
        
        // Update all links to include the language parameter
        this.updateLinks(lang);
    
        // Reset popup visibility when switching languages
        if (popup) {
            popup.style.display = 'block';
        }
    
        // Notify game to re-initialize for the new language
        window.dispatchEvent(new Event('languageChanged'));
    },

    // Update all links to include the language parameter
    updateLinks: function(lang) {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            if (href && (href.startsWith('../') || !href.startsWith('http'))) {
                // Remove existing lang parameter if exists
                let newHref = href.split('?')[0];
                // Add new lang parameter
                link.href = `${newHref}${newHref.includes('?') ? '&' : '?'}lang=${lang}`;
            }
        });
    },

    // Initialize language based on URL parameter or stored preference
    initLanguage: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const lang = urlParams.get('lang') || localStorage.getItem('preferred-language') || 'en';
        this.switchLanguage(lang);
    }
};

/**
 * Animation Module
 */
const AnimationManager = {
    // Initialize fade-in animations
    initFadeAnimations: function() {
        const fadeElements = document.querySelectorAll('.fade-in');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {
            threshold: CONFIG.FADE_THRESHOLD
        });
    
        fadeElements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            observer.observe(element);
        });
    },

    // Initialize timeline animations
    initTimeline: function() {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        if (timelineItems.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: CONFIG.TIMELINE_THRESHOLD
        });
    
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
};

/**
 * Initialization when the DOM is loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize glitch effects
    const glitchElements = document.querySelectorAll('.glitch-effect');
    glitchElements.forEach(element => {
        element.setAttribute('data-text', element.textContent);
    });

    // Initialize language
    LanguageManager.initLanguage();

    // Initialize animations
    AnimationManager.initFadeAnimations();
    AnimationManager.initTimeline();
});

// Global function for language switching (needed for onclick)
function switchLanguage(lang) {
    LanguageManager.switchLanguage(lang);
} 