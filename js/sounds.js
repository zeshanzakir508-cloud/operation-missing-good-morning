/**
 * sounds.js - Audio System for "Operation Missing Good Morning"
 * 
 * This module manages all audio playback including sound effects and
 * system sounds, completely decoupled from story logic and visuals.
 * 
 * @module sounds
 */

'use strict';

/**
 * Audio Configuration - Immutable defaults
 * @namespace AudioConfig
 */
const AudioConfig = {
    /** @type {number} Default volume (0.0 - 1.0) */
    defaultVolume: 0.7
};

// Freeze configuration
Object.freeze(AudioConfig);

/**
 * Audio Runtime State - Mutable
 * @namespace AudioState
 */
const AudioState = {
    /** @type {number} Current volume (0.0 - 1.0) */
    volume: AudioConfig.defaultVolume,
    /** @type {boolean} Whether audio is muted */
    muted: false,
    /** @type {string} Audio context state */
    contextState: 'suspended'
};

// Prevent accidental property additions
Object.seal(AudioState);

/**
 * Audio Manager
 * @namespace AudioManager
 */
const AudioManager = {
    /** @type {AudioContext|null} Audio context */
    context: null,
    /** @type {Map<string, AudioBuffer>} Sound effects */
    sounds: new Map(),
    /** @type {boolean} Whether audio is initialized */
    initialized: false
};

// Prevent accidental property additions
Object.seal(AudioManager);

/**
 * Creates an AudioContext
 * @returns {AudioContext|null} Audio context or null if not supported
 */
function createAudioContext() {
    try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) {
            return null;
        }
        return new AudioContextClass();
    } catch (error) {
        return null;
    }
}

/**
 * Initializes the audio system
 * @returns {Promise<boolean>} Success status
 */
async function initAudio() {
    if (AudioManager.initialized) {
        return true;
    }
    
    try {
        AudioManager.context = createAudioContext();
        if (!AudioManager.context) {
            return false;
        }
        
        // Create sound effects
        AudioManager.sounds.set('beep', generateBeepSound());
        AudioManager.sounds.set('success', generateSuccessSound());
        AudioManager.sounds.set('error', generateErrorSound());
        AudioManager.sounds.set('click', generateClickSound());
        
        AudioManager.initialized = true;
        AudioState.contextState = AudioManager.context.state;
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Generates a beep sound
 * @returns {AudioBuffer|null} Generated sound or null on failure
 */
function generateBeepSound() {
    const ctx = AudioManager.context;
    if (!ctx) return null;
    
    try {
        const sampleRate = ctx.sampleRate;
        const duration = 0.15;
        const bufferLength = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);
        
        const frequency = 800;
        for (let i = 0; i < bufferLength; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * Math.exp(-t * 3);
        }
        
        return buffer;
    } catch (error) {
        return null;
    }
}

/**
 * Generates a success sound (ascending tones)
 * @returns {AudioBuffer|null} Generated sound or null on failure
 */
function generateSuccessSound() {
    const ctx = AudioManager.context;
    if (!ctx) return null;
    
    try {
        const sampleRate = ctx.sampleRate;
        const duration = 0.5;
        const bufferLength = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);
        
        const frequencies = [523, 659, 784];
        for (let i = 0; i < bufferLength; i++) {
            const t = i / sampleRate;
            let value = 0;
            frequencies.forEach((freq, index) => {
                const start = index * (duration / frequencies.length);
                const end = (index + 1) * (duration / frequencies.length);
                if (t >= start && t < end) {
                    const phase = t - start;
                    const envelope = Math.sin(phase / (end - start) * Math.PI);
                    value += Math.sin(2 * Math.PI * freq * phase) * envelope * 0.3;
                }
            });
            data[i] = value;
        }
        
        return buffer;
    } catch (error) {
        return null;
    }
}

/**
 * Generates an error sound (descending tone)
 * @returns {AudioBuffer|null} Generated sound or null on failure
 */
function generateErrorSound() {
    const ctx = AudioManager.context;
    if (!ctx) return null;
    
    try {
        const sampleRate = ctx.sampleRate;
        const duration = 0.3;
        const bufferLength = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);
        
        const frequency = 300;
        for (let i = 0; i < bufferLength; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * (1 - t / duration);
        }
        
        return buffer;
    } catch (error) {
        return null;
    }
}

/**
 * Generates a click sound (short noise burst)
 * @returns {AudioBuffer|null} Generated sound or null on failure
 */
function generateClickSound() {
    const ctx = AudioManager.context;
    if (!ctx) return null;
    
    try {
        const sampleRate = ctx.sampleRate;
        const duration = 0.05;
        const bufferLength = Math.floor(sampleRate * duration);
        const buffer = ctx.createBuffer(1, bufferLength, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferLength; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 50);
        }
        
        return buffer;
    } catch (error) {
        return null;
    }
}

/**
 * Plays a sound from the cache
 * @param {string} soundName - Name of the sound to play
 * @param {number} volume - Volume override (0.0 - 1.0)
 * @returns {Promise<void>}
 */
async function playSound(soundName, volume = AudioState.volume) {
    if (AudioState.muted) return;
    if (!AudioManager.initialized) {
        await initAudio();
    }
    
    const ctx = AudioManager.context;
    if (!ctx) return;
    
    // Resume context if suspended (required by Chrome autoplay policy)
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
            AudioState.contextState = 'running';
        } catch (error) {
            // Failed to resume, silently return
            return;
        }
    }
    
    const buffer = AudioManager.sounds.get(soundName);
    if (!buffer) {
        return;
    }
    
    try {
        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();
        
        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        const clampedVolume = Math.min(Math.max(volume, 0), 1);
        gainNode.gain.setValueAtTime(clampedVolume, ctx.currentTime);
        
        source.start(0);
        source.onended = () => {
            source.disconnect();
            gainNode.disconnect();
        };
    } catch (error) {
        // Silently fail for audio
    }
}

/**
 * Plays a beep sound
 * @param {number} volume - Volume (0.0 - 1.0)
 * @returns {Promise<void>}
 */
async function playBeep(volume = AudioState.volume) {
    await playSound('beep', volume);
}

/**
 * Plays a success sound
 * @param {number} volume - Volume (0.0 - 1.0)
 * @returns {Promise<void>}
 */
async function playSuccess(volume = AudioState.volume) {
    await playSound('success', volume);
}

/**
 * Plays an error sound
 * @param {number} volume - Volume (0.0 - 1.0)
 * @returns {Promise<void>}
 */
async function playError(volume = AudioState.volume) {
    await playSound('error', volume);
}

/**
 * Plays a click sound
 * @param {number} volume - Volume (0.0 - 1.0)
 * @returns {Promise<void>}
 */
async function playClick(volume = AudioState.volume) {
    await playSound('click', volume);
}

/**
 * Mutes all audio
 */
function muteAudio() {
    AudioState.muted = true;
}

/**
 * Unmutes all audio
 */
function unmuteAudio() {
    AudioState.muted = false;
}

/**
 * Toggles mute state
 * @returns {boolean} New mute state
 */
function toggleMute() {
    AudioState.muted = !AudioState.muted;
    return AudioState.muted;
}

/**
 * Sets master volume
 * @param {number} volume - Volume (0.0 - 1.0)
 */
function setVolume(volume) {
    AudioState.volume = Math.min(Math.max(volume, 0), 1);
}

/**
 * Preloads all audio buffers
 * @returns {Promise<void>}
 */
async function preloadAudio() {
    await initAudio();
}

/**
 * Unlocks audio on user interaction (required by Chrome autoplay policy)
 * @returns {Promise<void>}
 */
async function unlockAudio() {
    if (!AudioManager.initialized) {
        await initAudio();
    }
    
    const ctx = AudioManager.context;
    if (!ctx) return;
    
    if (ctx.state === 'suspended') {
        try {
            await ctx.resume();
            AudioState.contextState = 'running';
        } catch (error) {
            // Silently fail
        }
    }
}

/**
 * Closes the audio context and releases resources
 * @returns {Promise<void>}
 */
async function closeAudio() {
    const ctx = AudioManager.context;
    if (!ctx) return;
    
    try {
        await ctx.close();
        AudioManager.context = null;
        AudioManager.initialized = false;
        AudioManager.sounds.clear();
        AudioState.contextState = 'closed';
    } catch (error) {
        // Silently fail
    }
}

// Expose audio functions globally
window.AudioConfig = AudioConfig;
window.AudioState = AudioState;
window.AudioManager = AudioManager;
window.createAudioContext = createAudioContext;
window.initAudio = initAudio;
window.generateBeepSound = generateBeepSound;
window.generateSuccessSound = generateSuccessSound;
window.generateErrorSound = generateErrorSound;
window.generateClickSound = generateClickSound;
window.playSound = playSound;
window.playBeep = playBeep;
window.playSuccess = playSuccess;
window.playError = playError;
window.playClick = playClick;
window.muteAudio = muteAudio;
window.unmuteAudio = unmuteAudio;
window.toggleMute = toggleMute;
window.setVolume = setVolume;
window.preloadAudio = preloadAudio;
window.unlockAudio = unlockAudio;
window.closeAudio = closeAudio;

// Freeze configuration
Object.freeze(window.AudioConfig);
