/**
 * animations.js - Visual Effects Library for "Operation Missing Good Morning"
 * 
 * This module provides animation and transition effects that are completely
 * decoupled from story logic, scene management, and audio.
 * 
 * @module animations
 */

'use strict';

/**
 * Animation Configuration
 * @namespace AnimationConfig
 */
const AnimationConfig = {
    /** @type {number} Default animation duration in milliseconds */
    duration: 300,
    /** @type {string} Default easing function */
    easing: 'ease-in-out'
};

// Freeze configuration
Object.freeze(AnimationConfig);

/**
 * Internal helper to wait for a transition to complete with a timeout fallback
 * @param {HTMLElement} element - Element to watch
 * @param {string} property - CSS property being transitioned
 * @param {number} duration - Max wait time in ms
 * @returns {Promise<void>}
 */
function waitForTransition(element, property = 'all', duration = 300) {
    return new Promise((resolve) => {
        let resolved = false;
        
        const onEnd = (event) => {
            if (resolved) return;
            if (property !== 'all' && event.propertyName !== property) return;
            resolved = true;
            element.removeEventListener('transitionend', onEnd);
            resolve();
        };
        
        element.addEventListener('transitionend', onEnd);
        
        // Timeout fallback
        setTimeout(() => {
            if (!resolved) {
                resolved = true;
                element.removeEventListener('transitionend', onEnd);
                resolve();
            }
        }, duration + 50);
    });
}

/**
 * Internal helper to force a reflow
 * @param {HTMLElement} element - Element to force reflow on
 */
function forceReflow(element) {
    if (element) {
        void element.offsetHeight;
    }
}

/**
 * Fades in an element
 * @param {HTMLElement} element - Element to fade in
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function fadeIn(element, duration = AnimationConfig.duration) {
    if (!element) return;
    
    // Reset styles
    element.style.opacity = '0';
    element.style.display = '';
    element.style.transition = `opacity ${duration}ms ${AnimationConfig.easing}`;
    
    // Trigger reflow
    forceReflow(element);
    
    element.style.opacity = '1';
    await waitForTransition(element, 'opacity', duration);
    element.style.transition = '';
}

/**
 * Fades out an element
 * @param {HTMLElement} element - Element to fade out
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function fadeOut(element, duration = AnimationConfig.duration) {
    if (!element) return;
    
    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ${AnimationConfig.easing}`;
    
    // Trigger reflow
    forceReflow(element);
    
    element.style.opacity = '0';
    await waitForTransition(element, 'opacity', duration);
    element.style.display = 'none';
    element.style.transition = '';
}

/**
 * Slides up an element
 * @param {HTMLElement} element - Element to slide up
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function slideUp(element, duration = AnimationConfig.duration) {
    if (!element) return;
    
    const height = element.offsetHeight;
    element.style.overflow = 'hidden';
    element.style.height = height + 'px';
    element.style.transition = `height ${duration}ms ${AnimationConfig.easing}`;
    
    // Trigger reflow
    forceReflow(element);
    
    element.style.height = '0';
    await waitForTransition(element, 'height', duration);
    element.style.display = 'none';
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
}

/**
 * Slides down an element
 * @param {HTMLElement} element - Element to slide down
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function slideDown(element, duration = AnimationConfig.duration) {
    if (!element) return;
    
    element.style.display = '';
    element.style.overflow = 'hidden';
    element.style.height = '0';
    element.style.transition = `height ${duration}ms ${AnimationConfig.easing}`;
    
    const height = element.scrollHeight;
    
    // Trigger reflow
    forceReflow(element);
    
    element.style.height = height + 'px';
    await waitForTransition(element, 'height', duration);
    element.style.height = '';
    element.style.overflow = '';
    element.style.transition = '';
}

// Track active pulse timeouts to prevent overlapping calls
const pulseTimeouts = new WeakMap();

/**
 * Pulse animation on an element (preserves existing transform)
 * @param {HTMLElement} element - Element to pulse
 * @param {number} duration - Animation duration in ms
 * @param {number} scale - Scale factor (default: 1.05)
 */
function pulse(element, duration = 500, scale = 1.05) {
    if (!element) return;
    
    // Cancel any pending pulse on this element
    const existingTimeout = pulseTimeouts.get(element);
    if (existingTimeout) {
        clearTimeout(existingTimeout);
        pulseTimeouts.delete(element);
    }
    
    // Store original transform
    const originalTransform = element.style.transform || '';
    
    element.style.transition = `transform ${duration}ms ${AnimationConfig.easing}`;
    element.style.transform = originalTransform ? `${originalTransform} scale(${scale})` : `scale(${scale})`;
    
    const timeoutId = setTimeout(() => {
        element.style.transform = originalTransform;
        pulseTimeouts.delete(element);
        setTimeout(() => {
            element.style.transition = '';
        }, 50);
    }, duration);
    
    pulseTimeouts.set(element, timeoutId);
}

/**
 * Shake animation on an element using Web Animations API
 * @param {HTMLElement} element - Element to shake
 * @param {number} duration - Animation duration in ms
 * @param {number} intensity - Shake intensity in pixels
 */
function shake(element, duration = 500, intensity = 5) {
    if (!element) return;
    
    // Check if Web Animations API is supported
    if (element.animate) {
        const keyframes = [
            { transform: `translateX(${-intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(${-intensity}px)` },
            { transform: `translateX(${intensity}px)` },
            { transform: `translateX(0)` }
        ];
        
        element.animate(keyframes, {
            duration: duration,
            easing: 'ease-in-out'
        });
    } else {
        // Fallback using CSS classes
        element.classList.add('shake-animation');
        element.style.animation = `shake ${duration}ms ease-in-out`;
        setTimeout(() => {
            element.classList.remove('shake-animation');
            element.style.animation = '';
        }, duration);
    }
}

/**
 * Success animation (green flash) using CSS class
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function successAnimation(element = document.body, duration = 500) {
    if (!element) return;
    
    element.classList.add('success-flash');
    setTimeout(() => {
        element.classList.remove('success-flash');
    }, duration);
}

/**
 * Alert animation (red flash) using CSS class
 * @param {HTMLElement} element - Element to animate
 * @param {number} duration - Animation duration in ms
 */
function alertAnimation(element = document.body, duration = 500) {
    if (!element) return;
    
    element.classList.add('alert-flash');
    setTimeout(() => {
        element.classList.remove('alert-flash');
    }, duration);
}

/**
 * Internal helper for slide transitions
 * @param {HTMLElement} element - Element to transition
 * @param {string} direction - Direction to slide
 * @param {number} duration - Duration in ms
 * @returns {Promise<void>}
 */
async function performSlideTransition(element, direction, duration) {
    // First, move element off-screen in the target direction without animation
    element.style.transition = 'none';
    const offscreenPosition = direction === 'left' ? '100%' : '-100%';
    element.style.transform = `translateX(${offscreenPosition})`;
    forceReflow(element);
    
    // Then animate moving it to the opposite off-screen position
    element.style.transition = `transform ${duration}ms ${AnimationConfig.easing}`;
    const oppositePosition = direction === 'left' ? '-100%' : '100%';
    element.style.transform = `translateX(${oppositePosition})`;
    await waitForTransition(element, 'transform', duration);
    
    // Finally animate to the center position
    element.style.transform = 'translateX(0)';
    await waitForTransition(element, 'transform', duration);
    
    element.style.transition = '';
}

/**
 * Screen transition effect
 * @param {HTMLElement} element - Element to transition
 * @param {'fade'|'slide-left'|'slide-right'} direction - Transition direction
 * @param {number} duration - Transition duration in ms
 * @returns {Promise<void>}
 */
async function transitionScreen(element = document.getElementById('screen'), direction = 'fade', duration = 300) {
    if (!element) return;
    
    switch (direction) {
        case 'fade':
            await fadeOut(element, duration);
            await fadeIn(element, duration);
            break;
            
        case 'slide-left':
            await performSlideTransition(element, 'left', duration);
            break;
            
        case 'slide-right':
            await performSlideTransition(element, 'right', duration);
            break;
            
        default:
            // Fade as default
            await fadeOut(element, duration);
            await fadeIn(element, duration);
            break;
    }
}

/**
 * Flash animation (quick visibility toggle) - preserves original opacity
 * @param {HTMLElement} element - Element to flash
 * @param {number} count - Number of flashes
 * @param {number} duration - Flash duration in ms
 * @returns {Promise<void>}
 */
async function flash(element, count = 3, duration = 100) {
    if (!element) return;
    
    const originalOpacity = element.style.opacity || '1';
    
    for (let i = 0; i < count; i++) {
        element.style.opacity = '0';
        await new Promise(resolve => setTimeout(resolve, duration));
        element.style.opacity = originalOpacity;
        await new Promise(resolve => setTimeout(resolve, duration));
    }
}

/**
 * Zoom in animation
 * @param {HTMLElement} element - Element to zoom
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function zoomIn(element, duration = AnimationConfig.duration) {
    if (!element) return;
    
    element.style.transition = `transform ${duration}ms ${AnimationConfig.easing}, opacity ${duration}ms ${AnimationConfig.easing}`;
    element.style.transform = 'scale(0)';
    element.style.opacity = '0';
    element.style.display = '';
    
    // Trigger reflow
    forceReflow(element);
    
    element.style.transform = 'scale(1)';
    element.style.opacity = '1';
    await waitForTransition(element, 'transform', duration);
    element.style.transition = '';
}

/**
 * Adds a CSS class to trigger animation
 * @param {HTMLElement} element - Element to animate
 * @param {string} className - CSS class to add
 * @param {number} duration - Animation duration in ms
 * @returns {Promise<void>}
 */
async function triggerCSSAnimation(element, className, duration = AnimationConfig.duration) {
    if (!element) return;
    
    element.classList.remove(className);
    // Trigger reflow
    forceReflow(element);
    element.classList.add(className);
    
    return new Promise((resolve) => {
        setTimeout(() => {
            element.classList.remove(className);
            resolve();
        }, duration);
    });
}

// Expose animation functions globally
window.AnimationConfig = AnimationConfig;
window.fadeIn = fadeIn;
window.fadeOut = fadeOut;
window.slideUp = slideUp;
window.slideDown = slideDown;
window.pulse = pulse;
window.shake = shake;
window.successAnimation = successAnimation;
window.alertAnimation = alertAnimation;
window.transitionScreen = transitionScreen;
window.flash = flash;
window.zoomIn = zoomIn;
window.triggerCSSAnimation = triggerCSSAnimation;

// Freeze configuration
Object.freeze(window.AnimationConfig);
