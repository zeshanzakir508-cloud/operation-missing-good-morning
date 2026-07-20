/**
 * scenes.js - Scene Management Module for "Operation Missing Good Morning"
 * 
 * This module handles all scene rendering, navigation, and user interaction
 * for the interactive story experience.
 * 
 * @module scenes
 */

'use strict';

/**
 * Scene Manager Runtime State - Controls story flow and rendering
 * @namespace SceneManager
 */
const SceneManager = {
    /** @type {number} Index of currently displayed scene */
    currentIndex: 0,
    /** @type {number} Total number of scenes in story */
    total: 0,
    /** @type {boolean} Flag to prevent concurrent rendering */
    rendering: false,
    /** @type {boolean} Flag to prevent duplicate event binding */
    eventsBound: false
};

// Prevent accidental property additions but allow runtime updates
Object.seal(SceneManager);

/**
 * Checks if the story has any scenes
 * @returns {boolean} True if scenes exist
 */
function hasScenes() {
    return typeof STORY !== 'undefined' && Array.isArray(STORY) && STORY.length > 0;
}

/**
 * Safely logs messages if appLog is available
 * @param {string} message - Message to log
 */
function safeLog(message) {
    if (typeof appLog === 'function') {
        appLog(message);
    }
}

/**
 * Safely executes sleep if available
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
async function safeSleep(ms) {
    if (typeof sleep === 'function') {
        await sleep(ms);
    }
}

/**
 * Updates the progress bar directly
 * @param {Object} scene - Scene object containing progress
 */
function updateProgress(scene) {
    if (!scene) return;
    
    const progressBar = document.getElementById('progress-bar');
    if (progressBar && typeof scene.progress === 'number') {
        const clampedProgress = Math.min(Math.max(scene.progress, 0), 100);
        progressBar.style.width = clampedProgress + '%';
    }
}

/**
 * Updates the primary button text directly
 * @param {Object} scene - Scene object containing button text
 */
function updateButton(scene) {
    const button = document.getElementById('primary-button');
    if (button) {
        button.textContent = scene?.button || 'Continue';
    }
}

/**
 * Plays audio based on scene type
 * @param {Object} scene - Scene object containing type
 */
function playSceneAudio(scene) {
    if (!scene || !scene.type) return;
    
    switch (scene.type) {
        case 'success':
            if (typeof playSuccess === 'function') playSuccess();
            break;
        case 'danger':
            if (typeof playError === 'function') playError();
            break;
        case 'info':
        case 'warning':
        case 'default':
        default:
            if (typeof playBeep === 'function') playBeep();
            break;
    }
}

/**
 * Triggers visual effects based on scene type
 * @param {Object} scene - Scene object containing type
 */
function playSceneEffect(scene) {
    if (!scene || !scene.type) return;
    
    switch (scene.type) {
        case 'danger':
            if (typeof alertAnimation === 'function') alertAnimation();
            break;
        case 'success':
            if (typeof successAnimation === 'function') successAnimation();
            break;
        case 'warning':
            if (typeof pulse === 'function') {
                const target = document.getElementById('screen') || document.body;
                pulse(target);
            }
            break;
        case 'info':
        case 'default':
        default:
            // No effect for info/default
            break;
    }
}

/**
 * Prints debug logs from scene with delay
 * @param {Object} scene - Scene object containing logs
 */
async function printLogs(scene) {
    if (!scene || !scene.logs || !Array.isArray(scene.logs)) return;
    
    for (const log of scene.logs) {
        safeLog(log);
        await safeSleep(100);
    }
}

/**
 * Displays the scene title
 * @param {Object} scene - Scene object containing title
 */
function displaySceneTitle(scene) {
    if (!scene) return;
    
    const titleElement = document.getElementById('scene-title');
    if (titleElement) {
        titleElement.textContent = scene.title || '';
    }
}

/**
 * Main scene renderer - displays a scene by index
 * @param {number} index - Scene index to display
 * @returns {Promise<void>}
 */
async function showScene(index) {
    // Prevent double rendering
    if (SceneManager.rendering) {
        safeLog('Scene rendering already in progress');
        return;
    }
    
    // Validate index
    if (index < 0 || index >= SceneManager.total) {
        safeLog('Invalid scene index: ' + index);
        return;
    }
    
    const scene = STORY[index];
    if (!scene) {
        safeLog('Scene not found at index: ' + index);
        return;
    }
    
    try {
        SceneManager.rendering = true;
        
        // Clear typing before transition to prevent text flicker
        if (typeof clearTyping === 'function') {
            clearTyping();
        }
        
        // Transition screen
        if (typeof transitionScreen === 'function') {
            const screen = document.getElementById('screen');
            if (screen) {
                await transitionScreen(screen);
            }
        }
        
        // Update current index before rendering
        SceneManager.currentIndex = index;
        
        // Display scene metadata
        displaySceneTitle(scene);
        
        // Update UI elements
        updateProgress(scene);
        updateButton(scene);
        
        // Play audio and effects
        playSceneAudio(scene);
        playSceneEffect(scene);
        
        // Type the scene text
        if (typeof typeScene === 'function') {
            await typeScene(scene);
        }
        
        // Print logs if present
        await printLogs(scene);
        
        // Handle final scene - check if this is the last scene
        if (index === SceneManager.total - 1) {
            if (typeof launchConfetti === 'function') {
                launchConfetti();
            }
            if (typeof showToast === 'function') {
                showToast('Case Closed');
            }
        }
        
        safeLog('Scene loaded: ' + index);
        
    } catch (error) {
        safeLog('Error showing scene: ' + (error?.message ?? error));
    } finally {
        SceneManager.rendering = false;
    }
}

/**
 * Loads the first scene
 * @returns {Promise<void>}
 */
async function loadScene() {
    await showScene(SceneManager.currentIndex);
}

/**
 * Advances to the next scene
 * @returns {Promise<void>}
 */
async function nextScene() {
    if (SceneManager.rendering) return;
    
    const nextIndex = SceneManager.currentIndex + 1;
    if (nextIndex >= SceneManager.total) {
        safeLog('Already at last scene');
        return;
    }
    
    await showScene(nextIndex);
}

/**
 * Returns to the previous scene
 * @returns {Promise<void>}
 */
async function previousScene() {
    if (SceneManager.rendering) return;
    
    const prevIndex = SceneManager.currentIndex - 1;
    if (prevIndex < 0) {
        safeLog('Already at first scene');
        return;
    }
    
    await showScene(prevIndex);
}

/**
 * Restarts the story from the beginning
 * @returns {Promise<void>}
 */
async function restartStory() {
    if (SceneManager.rendering) return;
    
    SceneManager.currentIndex = 0;
    await loadScene();
    safeLog('Story restarted');
}

/**
 * Checks if currently on the first scene
 * @returns {boolean}
 */
function isFirstScene() {
    return SceneManager.currentIndex === 0;
}

/**
 * Checks if currently on the last scene
 * @returns {boolean}
 */
function isLastScene() {
    return SceneManager.currentIndex === SceneManager.total - 1;
}

/**
 * Safely jumps to a specific scene index
 * @param {number} index - Target scene index
 * @returns {Promise<void>}
 */
async function jumpToScene(index) {
    if (SceneManager.rendering) return;
    
    if (index < 0 || index >= SceneManager.total) {
        safeLog('Invalid jump target: ' + index);
        return;
    }
    
    await showScene(index);
}

/**
 * Handles primary button clicks
 * @returns {Promise<void>}
 */
async function handlePrimaryButton() {
    if (SceneManager.rendering) return;
    
    if (isLastScene()) {
        await restartStory();
    } else {
        await nextScene();
    }
}

/**
 * Handles keyboard navigation
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {Promise<void>}
 */
async function handleKeyboard(event) {
    // Ignore key repeats to prevent accidental multiple navigations
    if (event.repeat) return;
    
    // Ignore input while rendering
    if (SceneManager.rendering) return;
    
    // Prevent default for navigation keys
    const navigationCodes = ['ArrowRight', 'ArrowLeft', 'Space', 'Enter', 'Home'];
    if (navigationCodes.includes(event.code)) {
        event.preventDefault();
    }
    
    switch (event.code) {
        case 'ArrowRight':
        case 'Space':
        case 'Enter':
            if (isLastScene()) {
                await restartStory();
            } else {
                await nextScene();
            }
            break;
            
        case 'ArrowLeft':
            await previousScene();
            break;
            
        case 'Home':
            await restartStory();
            break;
            
        default:
            // Ignore other keys
            break;
    }
}

/**
 * Binds event listeners for scene navigation
 * This function ensures listeners are only attached once
 */
function bindSceneEvents() {
    // Check if already bound using SceneManager flag
    if (SceneManager.eventsBound) {
        safeLog('Scene events already bound');
        return;
    }
    
    // Get primary button by ID and bind click handler
    const button = document.getElementById('primary-button');
    if (button) {
        button.addEventListener('click', handlePrimaryButton);
    } else {
        safeLog('Primary button not found');
    }
    
    // Bind keyboard events
    document.addEventListener('keydown', handleKeyboard);
    
    // Mark as bound
    SceneManager.eventsBound = true;
    safeLog('Scene events bound');
}

/**
 * Removes event listeners for scene navigation
 */
function destroySceneEvents() {
    const button = document.getElementById('primary-button');
    if (button) {
        button.removeEventListener('click', handlePrimaryButton);
    }
    
    document.removeEventListener('keydown', handleKeyboard);
    
    SceneManager.eventsBound = false;
    safeLog('Scene events destroyed');
}

/**
 * Initializes the scene manager
 * Binds events and loads the first scene
 * @returns {Promise<void>}
 */
async function initScenes() {
    try {
        // Ensure STORY exists and has scenes
        if (!hasScenes()) {
            safeLog('STORY is not defined or empty');
            return;
        }
        
        // Update total scenes
        SceneManager.total = STORY.length;
        
        // Bind events
        bindSceneEvents();
        
        // Load first scene
        await loadScene();
        
        safeLog('Scene manager initialized with ' + SceneManager.total + ' scenes');
        
    } catch (error) {
        safeLog('Error initializing scenes: ' + (error?.message ?? error));
    }
}

// Expose public API globally
window.SceneManager = SceneManager;
window.initScenes = initScenes;
window.nextScene = nextScene;
window.previousScene = previousScene;
window.restartStory = restartStory;
window.jumpToScene = jumpToScene;
