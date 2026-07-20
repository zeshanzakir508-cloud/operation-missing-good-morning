/**
 * typing.js - Typing Effect Engine for "Operation Missing Good Morning"
 * 
 * This module handles the typewriter effect for rendering scene text
 * character by character with configurable speed and controls.
 * 
 * @module typing
 */

'use strict';

/**
 * Typing Configuration - Immutable settings
 * @namespace TypingConfig
 */
const TypingConfig = {
    /** @type {number} Typing speed in milliseconds per character */
    speed: 30,
    /** @type {number} Pause between words in milliseconds */
    wordPause: 150,
    /** @type {number} Pause at punctuation in milliseconds */
    punctuationPause: 400
};

// Freeze configuration to prevent modifications
Object.freeze(TypingConfig);

/**
 * Typing Engine Runtime State - Mutable
 * @namespace TypingEngine
 */
const TypingEngine = {
    /** @type {boolean} Whether typing is currently active */
    isTyping: false,
    /** @type {boolean} Whether typing is paused */
    isPaused: false,
    /** @type {number} ID of current timeout */
    timeoutId: null,
    /** @type {Function} Callback when typing completes */
    onComplete: null,
    /** @type {Function} Resolve function for the current promise */
    resolve: null,
    /** @type {string} Full text being typed */
    fullText: '',
    /** @type {string} Current typed text */
    currentText: '',
    /** @type {number} Current character index */
    currentIndex: 0,
    /** @type {HTMLElement|null} Target element for typing */
    target: null,
    /** @type {Function|null} Per-character callback */
    onChar: null,
    /** @type {number} Typing speed override */
    currentSpeed: TypingConfig.speed
};

// Prevent accidental property additions
Object.seal(TypingEngine);

/**
 * Gets the delay for a character based on its type
 * @param {string} char - Character to check
 * @returns {number} Delay in milliseconds
 */
function getCharDelay(char) {
    if (char === ' ') {
        return TypingConfig.wordPause;
    }
    if (char === '.' || char === '!' || char === '?' || char === ',' || 
        char === ';' || char === ':' || char === '—' || char === '-') {
        return TypingConfig.punctuationPause;
    }
    return TypingEngine.currentSpeed;
}

/**
 * Types the next character in the sequence
 * @returns {boolean} Whether typing should continue
 */
function typeNextChar() {
    // Check if typing should stop
    if (!TypingEngine.isTyping || TypingEngine.isPaused) {
        return false;
    }
    
    // Check if typing is complete
    if (TypingEngine.currentIndex >= TypingEngine.fullText.length) {
        completeTyping();
        return false;
    }
    
    // Get next character
    const char = TypingEngine.fullText[TypingEngine.currentIndex];
    TypingEngine.currentText += char;
    TypingEngine.currentIndex++;
    
    // Update target element
    if (TypingEngine.target) {
        TypingEngine.target.textContent = TypingEngine.currentText;
    }
    
    // Call per-character callback if provided
    if (TypingEngine.onChar) {
        TypingEngine.onChar(char, TypingEngine.currentIndex - 1, TypingEngine.fullText.length);
    }
    
    // Calculate delay for next character
    const delay = getCharDelay(char);
    
    // Schedule next character
    TypingEngine.timeoutId = setTimeout(() => {
        typeNextChar();
    }, delay);
    
    return true;
}

/**
 * Completes the typing process and resolves the promise
 */
function completeTyping() {
    TypingEngine.isTyping = false;
    TypingEngine.isPaused = false;
    
    if (TypingEngine.timeoutId) {
        clearTimeout(TypingEngine.timeoutId);
        TypingEngine.timeoutId = null;
    }
    
    if (TypingEngine.onComplete) {
        TypingEngine.onComplete();
        TypingEngine.onComplete = null;
    }
    
    if (TypingEngine.resolve) {
        TypingEngine.resolve();
        TypingEngine.resolve = null;
    }
}

/**
 * Resets the typing engine state
 */
function resetTypingState() {
    TypingEngine.fullText = '';
    TypingEngine.currentText = '';
    TypingEngine.currentIndex = 0;
    TypingEngine.target = null;
    TypingEngine.onChar = null;
    TypingEngine.currentSpeed = TypingConfig.speed;
}

/**
 * Stops the current typing animation and resets state
 */
function stopTyping() {
    TypingEngine.isTyping = false;
    TypingEngine.isPaused = false;
    TypingEngine.onComplete = null;
    TypingEngine.resolve = null;
    
    if (TypingEngine.timeoutId) {
        clearTimeout(TypingEngine.timeoutId);
        TypingEngine.timeoutId = null;
    }
    
    resetTypingState();
}

/**
 * Pauses the typing animation
 */
function pauseTyping() {
    if (TypingEngine.isTyping && !TypingEngine.isPaused) {
        TypingEngine.isPaused = true;
        if (TypingEngine.timeoutId) {
            clearTimeout(TypingEngine.timeoutId);
            TypingEngine.timeoutId = null;
        }
    }
}

/**
 * Resumes the typing animation
 */
function resumeTyping() {
    if (TypingEngine.isTyping && TypingEngine.isPaused) {
        TypingEngine.isPaused = false;
        // Continue typing with the next character
        typeNextChar();
    }
}

/**
 * Clears the typing target and resets state
 * @param {HTMLElement} target - Target element to clear
 */
function clearTyping(target) {
    stopTyping();
    if (target) {
        target.textContent = '';
    }
}

/**
 * Instantly displays text without typing animation
 * @param {string} text - Text to display
 * @param {HTMLElement} target - Target element
 */
function instantText(text, target) {
    if (target) {
        // Resolve any previous pending promise
        if (TypingEngine.resolve) {
            TypingEngine.resolve();
            TypingEngine.resolve = null;
        }
        
        stopTyping();
        target.textContent = text;
        TypingEngine.fullText = text;
        TypingEngine.currentText = text;
        TypingEngine.currentIndex = text.length;
        TypingEngine.target = target;
    }
}

/**
 * Skips the current typing animation (completes instantly)
 */
function skipTyping() {
    if (TypingEngine.isTyping && TypingEngine.target) {
        // Clear any pending timeout
        if (TypingEngine.timeoutId) {
            clearTimeout(TypingEngine.timeoutId);
            TypingEngine.timeoutId = null;
        }
        
        // Display remaining text instantly
        if (TypingEngine.fullText) {
            TypingEngine.target.textContent = TypingEngine.fullText;
            TypingEngine.currentText = TypingEngine.fullText;
            TypingEngine.currentIndex = TypingEngine.fullText.length;
        }
        
        // Complete the typing
        completeTyping();
    }
}

/**
 * Types text into a target element with typewriter effect
 * @param {string} text - Text to type
 * @param {HTMLElement} target - Target element to render into
 * @param {Object} options - Typing options
 * @param {number} options.speed - Characters per millisecond
 * @param {Function} options.onComplete - Callback when finished
 * @param {Function} options.onChar - Callback per character
 * @returns {Promise<void>}
 */
function typeWriter(text, target, options = {}) {
    return new Promise((resolve) => {
        if (!target) {
            resolve();
            return;
        }
        
        // Resolve any previous pending promise
        if (TypingEngine.resolve) {
            TypingEngine.resolve();
            TypingEngine.resolve = null;
        }
        
        // Stop any existing typing
        stopTyping();
        
        // Clear target content
        target.textContent = '';
        
        // Setup typing state
        TypingEngine.fullText = text;
        TypingEngine.target = target;
        TypingEngine.currentText = '';
        TypingEngine.currentIndex = 0;
        TypingEngine.currentSpeed = options.speed ?? TypingConfig.speed;
        TypingEngine.onChar = options.onChar || null;
        TypingEngine.onComplete = options.onComplete || null;
        TypingEngine.resolve = resolve;
        TypingEngine.isTyping = true;
        TypingEngine.isPaused = false;
        TypingEngine.timeoutId = null;
        
        // Start typing
        typeNextChar();
    });
}

/**
 * Types a scene's text content
 * @param {Object} scene - Scene object containing message and target
 * @param {string} scene.message - Text to type (story uses 'message' not 'text')
 * @param {string} scene.target - CSS selector for target element
 * @param {Object} options - Typing options
 * @returns {Promise<void>}
 */
async function typeScene(scene, options = {}) {
    // Use 'message' property from story.js, not 'text'
    if (!scene || !scene.message) {
        return;
    }
    
    // Use the correct target selector from HTML
    const targetSelector = scene.target || '#scene-content';
    // Use utils.qs if available, otherwise fallback to document.querySelector
    const target = (typeof qs === 'function') 
        ? qs(targetSelector) 
        : document.querySelector(targetSelector);
    
    if (!target) {
        return;
    }
    
    await typeWriter(scene.message, target, options);
}

/**
 * Gets the current typing progress
 * @returns {Object} Progress information
 */
function getTypingProgress() {
    return {
        isTyping: TypingEngine.isTyping,
        isPaused: TypingEngine.isPaused,
        progress: TypingEngine.fullText.length > 0 
            ? TypingEngine.currentIndex / TypingEngine.fullText.length 
            : 0,
        totalCharacters: TypingEngine.fullText.length,
        typedCharacters: TypingEngine.currentIndex
    };
}

/**
 * Sets the typing speed
 * @param {number} speed - Speed in milliseconds per character
 */
function setTypingSpeed(speed) {
    if (speed > 0) {
        TypingEngine.currentSpeed = speed;
    }
}

// Expose typing engine globally
window.TypingConfig = TypingConfig;
window.TypingEngine = TypingEngine;
window.typeWriter = typeWriter;
window.stopTyping = stopTyping;
window.pauseTyping = pauseTyping;
window.resumeTyping = resumeTyping;
window.clearTyping = clearTyping;
window.instantText = instantText;
window.skipTyping = skipTyping;
window.typeScene = typeScene;
window.getTypingProgress = getTypingProgress;
window.setTypingSpeed = setTypingSpeed;
