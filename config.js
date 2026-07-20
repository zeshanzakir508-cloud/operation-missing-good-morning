/**
 * ==========================================================
 * Operation Missing Good Morning
 * Configuration
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

const CONFIG = {

    // =========================
    // Project Information
    // =========================
    app: {

        name: "Operation Missing Good Morning",

        version: "1.0.0",

        author: "Muhammad Zeshan Zakir"

    },

    // =========================
    // Personalization
    // =========================
    user: {

        husbandName: "Husband",

        wifeName: "Wife"

    },

    // =========================
    // Story Settings
    // =========================
    story: {

        autoPlay: false,

        typingSpeed: 25,

        sceneDelay: 500,

        allowBack: false

    },

    // =========================
    // UI Settings
    // =========================
    ui: {

        showProgress: true,

        showCaseNumber: true,

        enableTypingEffect: true,

        enableGlassEffect: true,

        enableFloatingBackground: true

    },

    // =========================
    // Animations
    // =========================
    animation: {

        fadeDuration: 500,

        sceneTransition: 600,

        buttonDuration: 250,

        confettiDuration: 5000

    },

    // =========================
    // Sounds
    // =========================
    sound: {

        enabled: true,

        volume: 0.60

    },

    // =========================
    // Investigation Status
    // =========================
    investigation: {

        caseId: "GM-001",

        department: "Family Investigation Bureau",

        priority: "HIGH",

        status: "INVESTIGATING"

    },

    // =========================
    // Progress
    // =========================
    progress: {

        max: 100

    },

    // =========================
    // Theme
    // =========================
    theme: {

        primary: "#3B82F6",

        success: "#22C55E",

        warning: "#FACC15",

        danger: "#EF4444"

    }

};

// Prevent accidental modification
Object.freeze(CONFIG);
Object.freeze(CONFIG.app);
Object.freeze(CONFIG.user);
Object.freeze(CONFIG.story);
Object.freeze(CONFIG.ui);
Object.freeze(CONFIG.animation);
Object.freeze(CONFIG.sound);
Object.freeze(CONFIG.investigation);
Object.freeze(CONFIG.progress);
Object.freeze(CONFIG.theme);
