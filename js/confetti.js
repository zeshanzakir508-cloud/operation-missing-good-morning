/**
 * confetti.js - Confetti Animation System for "Operation Missing Good Morning"
 * 
 * This module provides a lightweight, canvas-based confetti animation
 * that is completely decoupled from story logic and scene management.
 * 
 * @module confetti
 */

'use strict';

/**
 * Confetti Configuration
 * @namespace ConfettiConfig
 */
const ConfettiConfig = {
    /** @type {number} Number of confetti pieces */
    count: 150,
    /** @type {number} Duration of animation in milliseconds */
    duration: 4000,
    /** @type {string[]} Available colors */
    colors: [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
        '#FFEAA7', '#DDA0DD', '#FF9FF3', '#54A0FF',
        '#FF6348', '#7BED9F', '#FFA502', '#2ED573'
    ],
    /** @type {number} Gravity factor */
    gravity: 0.5,
    /** @type {number} Wind factor */
    wind: 0.1,
    /** @type {number} Spin speed */
    spinSpeed: 2
};

// Deep freeze configuration to prevent any mutations
Object.freeze(ConfettiConfig.colors);
Object.freeze(ConfettiConfig);

/**
 * Confetti Manager
 * @namespace ConfettiManager
 */
const ConfettiManager = {
    /** @type {HTMLCanvasElement|null} Canvas element */
    canvas: null,
    /** @type {CanvasRenderingContext2D|null} Canvas context */
    ctx: null,
    /** @type {Array} Confetti particles */
    particles: [],
    /** @type {number} Animation frame ID */
    animationId: null,
    /** @type {boolean} Whether animation is running */
    isRunning: false,
    /** @type {number} Start time of animation */
    startTime: 0,
    /** @type {number} Duration of current animation */
    duration: ConfettiConfig.duration,
    /** @type {Function} Resize handler */
    resizeHandler: null
};

// Prevent accidental property additions
Object.seal(ConfettiManager);

/**
 * Creates a confetti particle
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {string} color - Particle color
 * @param {number} width - Particle width
 * @param {number} height - Particle height
 * @returns {Object} Particle object
 */
function createParticle(x, y, color, width, height) {
    return {
        x: x ?? Math.random() * window.innerWidth,
        y: y ?? Math.random() * window.innerHeight * 0.5,
        color: color ?? ConfettiConfig.colors[Math.floor(Math.random() * ConfettiConfig.colors.length)],
        width: width ?? (Math.random() * 8 + 4),
        height: height ?? (Math.random() * 6 + 2),
        velocityX: (Math.random() - 0.5) * 2,
        velocityY: Math.random() * 3 + 1,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * ConfettiConfig.spinSpeed,
        opacity: 1
    };
}

/**
 * Initializes the confetti canvas
 * @returns {boolean} Success status
 */
function initConfettiCanvas() {
    if (ConfettiManager.canvas) {
        return true;
    }
    
    // Create canvas if it doesn't exist
    let canvas = document.querySelector('#confetti-canvas');
    if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'confetti-canvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);
    }
    
    ConfettiManager.canvas = canvas;
    ConfettiManager.ctx = canvas.getContext('2d');
    
    // Verify context was created successfully
    if (!ConfettiManager.ctx) {
        ConfettiManager.canvas = null;
        return false;
    }
    
    // Set canvas size with high DPI support
    resizeConfettiCanvas();
    
    // Handle resize
    ConfettiManager.resizeHandler = () => resizeConfettiCanvas();
    window.addEventListener('resize', ConfettiManager.resizeHandler);
    
    return true;
}

/**
 * Resizes the confetti canvas to match window with high DPI support
 */
function resizeConfettiCanvas() {
    if (!ConfettiManager.canvas || !ConfettiManager.ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    ConfettiManager.canvas.width = width * dpr;
    ConfettiManager.canvas.height = height * dpr;
    ConfettiManager.canvas.style.width = width + 'px';
    ConfettiManager.canvas.style.height = height + 'px';
    
    // Reset transform before applying new scale
    ConfettiManager.ctx.setTransform(1, 0, 0, 1, 0, 0);
    ConfettiManager.ctx.scale(dpr, dpr);
}

/**
 * Generates confetti particles
 * @param {number} count - Number of particles
 * @param {number} startX - Optional starting X position
 * @param {number} startY - Optional starting Y position
 * @param {string[]} customColors - Optional custom colors
 * @returns {Array} Array of particle objects
 */
function generateParticles(count, startX, startY, customColors) {
    const particles = [];
    const width = window.innerWidth;
    const height = window.innerHeight;
    const colors = customColors || ConfettiConfig.colors;
    
    for (let i = 0; i < count; i++) {
        const x = startX !== undefined ? startX + (Math.random() - 0.5) * 100 : Math.random() * width;
        const y = startY !== undefined ? startY + (Math.random() - 0.5) * 100 : Math.random() * height * 0.5;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particles.push(createParticle(
            x,
            y,
            color,
            Math.random() * 8 + 4,
            Math.random() * 6 + 2
        ));
    }
    
    return particles;
}

/**
 * Draws a single confetti piece
 * @param {Object} particle - Particle to draw
 */
function drawParticle(particle) {
    const ctx = ConfettiManager.ctx;
    if (!ctx) return;
    
    ctx.save();
    ctx.translate(particle.x, particle.y);
    ctx.rotate((particle.rotation * Math.PI) / 180);
    ctx.globalAlpha = particle.opacity;
    ctx.fillStyle = particle.color;
    ctx.fillRect(-particle.width / 2, -particle.height / 2, particle.width, particle.height);
    ctx.restore();
}

/**
 * Updates a particle's position
 * @param {Object} particle - Particle to update
 */
function updateParticle(particle) {
    // Apply gravity
    particle.velocityY += ConfettiConfig.gravity * 0.1;
    
    // Apply wind
    particle.x += particle.velocityX + (Math.random() - 0.5) * ConfettiConfig.wind;
    particle.y += particle.velocityY;
    
    // Rotate
    particle.rotation += particle.rotationSpeed;
    
    // Fade out when near bottom
    if (particle.y > window.innerHeight * 0.8) {
        particle.opacity *= 0.98;
    }
}

/**
 * Animation loop
 * @param {number} timestamp - Current timestamp
 */
function animateConfetti(timestamp) {
    if (!ConfettiManager.isRunning) return;
    
    const ctx = ConfettiManager.ctx;
    if (!ctx || !ConfettiManager.canvas) return;
    
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ConfettiManager.canvas.width, ConfettiManager.canvas.height);
    ctx.scale(dpr, dpr);
    
    // Update and draw particles
    let activeParticles = 0;
    for (let i = ConfettiManager.particles.length - 1; i >= 0; i--) {
        const particle = ConfettiManager.particles[i];
        
        // Check if particle is still active
        if (particle.opacity <= 0.01 || particle.y > window.innerHeight + 100) {
            ConfettiManager.particles.splice(i, 1);
            continue;
        }
        
        updateParticle(particle);
        drawParticle(particle);
        activeParticles++;
    }
    
    // Check if we should continue
    const elapsed = timestamp - ConfettiManager.startTime;
    if (activeParticles === 0 || elapsed > ConfettiManager.duration) {
        stopConfetti();
        return;
    }
    
    // Continue animation
    ConfettiManager.animationId = requestAnimationFrame(animateConfetti);
}

/**
 * Stops the confetti animation
 */
function stopConfetti() {
    ConfettiManager.isRunning = false;
    ConfettiManager.startTime = 0;
    ConfettiManager.duration = ConfettiConfig.duration;
    
    if (ConfettiManager.animationId) {
        cancelAnimationFrame(ConfettiManager.animationId);
        ConfettiManager.animationId = null;
    }
    
    // Clear canvas
    if (ConfettiManager.ctx && ConfettiManager.canvas) {
        const dpr = window.devicePixelRatio || 1;
        ConfettiManager.ctx.setTransform(1, 0, 0, 1, 0, 0);
        ConfettiManager.ctx.clearRect(0, 0, ConfettiManager.canvas.width, ConfettiManager.canvas.height);
        ConfettiManager.ctx.scale(dpr, dpr);
    }
    
    ConfettiManager.particles = [];
}

/**
 * Cleans up confetti resources
 */
function cleanupConfetti() {
    stopConfetti();
    
    if (ConfettiManager.resizeHandler) {
        window.removeEventListener('resize', ConfettiManager.resizeHandler);
        ConfettiManager.resizeHandler = null;
    }
    
    if (ConfettiManager.canvas) {
        ConfettiManager.canvas.remove();
        ConfettiManager.canvas = null;
        ConfettiManager.ctx = null;
    }
}

/**
 * Launches the confetti animation
 * @param {number|Object} options - Number of confetti pieces or options object
 * @param {number} options.count - Number of confetti pieces
 * @param {number} options.duration - Animation duration in ms
 * @param {number} options.x - Starting X position (optional)
 * @param {number} options.y - Starting Y position (optional)
 * @param {string[]} options.colors - Custom color array (optional)
 */
function launchConfetti(options = {}) {
    // Handle numeric argument for backward compatibility
    if (typeof options === 'number') {
        options = { count: options };
    }
    
    // Extract options with defaults
    const count = options.count ?? ConfettiConfig.count;
    const duration = options.duration ?? ConfettiConfig.duration;
    const startX = options.x;
    const startY = options.y;
    const customColors = options.colors || null;
    
    // Stop any existing animation
    stopConfetti();
    
    // Initialize canvas
    if (!initConfettiCanvas()) {
        return;
    }
    
    // Generate particles
    ConfettiManager.particles = generateParticles(count, startX, startY, customColors);
    ConfettiManager.isRunning = true;
    ConfettiManager.startTime = performance.now();
    ConfettiManager.duration = duration;
    
    // Start animation
    ConfettiManager.animationId = requestAnimationFrame(animateConfetti);
}

/**
 * Launches confetti with custom position
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} count - Number of confetti pieces
 */
function launchConfettiAt(x, y, count = ConfettiConfig.count) {
    launchConfetti({
        count: count,
        x: x,
        y: y
    });
}

/**
 * Launches confetti with custom colors
 * @param {string[]} colors - Array of color strings
 * @param {number} count - Number of confetti pieces
 */
function launchConfettiWithColors(colors, count = ConfettiConfig.count) {
    launchConfetti({
        count: count,
        colors: colors
    });
}

// Expose public API only
window.launchConfetti = launchConfetti;
window.launchConfettiAt = launchConfettiAt;
window.launchConfettiWithColors = launchConfettiWithColors;
window.stopConfetti = stopConfetti;
window.cleanupConfetti = cleanupConfetti;

// For debugging purposes, expose configuration (read-only)
window.ConfettiConfig = ConfettiConfig;
