/**
 * app.js - Application Entry Point for "Operation Missing Good Morning"
 * 
 * This is the minimal application bootstrap that initializes all modules
 * and handles startup errors gracefully.
 * 
 * @module app
 */

'use strict';

/**
 * Application Configuration
 * @namespace AppConfig
 */
const AppConfig = {
    /** @type {string} Application name */
    name: 'Operation Missing Good Morning',
    /** @type {string} Application version */
    version: '1.0.0'
};

// Freeze configuration
Object.freeze(AppConfig);

/**
 * Application Runtime State
 * @namespace AppState
 */
const AppState = {
    /** @type {boolean} Whether the app has been initialized */
    initialized: false,
    /** @type {boolean} Whether startup completed successfully */
    startupComplete: false,
    /** @type {Array<string>} Startup errors */
    errors: []
};

// Prevent accidental property additions
Object.seal(AppState);

/**
 * Checks if all required globals exist
 * @returns {Object} Result object with success flag and missing dependencies
 */
function checkDependencies() {
    const required = [
        { name: 'STORY', check: () => typeof STORY !== 'undefined' && Array.isArray(STORY) && STORY.length > 0 },
        { name: 'sleep', check: () => typeof sleep === 'function' },
        { name: 'typeScene', check: () => typeof typeScene === 'function' },
        { name: 'clearTyping', check: () => typeof clearTyping === 'function' },
        { name: 'transitionScreen', check: () => typeof transitionScreen === 'function' },
        { name: 'playBeep', check: () => typeof playBeep === 'function' },
        { name: 'playSuccess', check: () => typeof playSuccess === 'function' },
        { name: 'playError', check: () => typeof playError === 'function' },
        { name: 'alertAnimation', check: () => typeof alertAnimation === 'function' },
        { name: 'successAnimation', check: () => typeof successAnimation === 'function' },
        { name: 'pulse', check: () => typeof pulse === 'function' },
        { name: 'appLog', check: () => typeof appLog === 'function' },
        { name: 'showToast', check: () => typeof showToast === 'function' },
        { name: 'launchConfetti', check: () => typeof launchConfetti === 'function' },
        { name: 'initScenes', check: () => typeof initScenes === 'function' }
    ];
    
    const missing = required.filter(dep => !dep.check());
    return {
        success: missing.length === 0,
        missing: missing.map(dep => dep.name)
    };
}

/**
 * Shows startup errors to the user
 * @param {Array<string>} errors - Error messages
 */
function showStartupErrors(errors) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #c0392b;
        color: white;
        padding: 20px 30px;
        border-radius: 8px;
        font-family: 'Courier New', monospace;
        font-size: 14px;
        max-width: 600px;
        width: 90%;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        text-align: center;
    `;
    
    const title = document.createElement('strong');
    title.textContent = '⚠️ Startup Error';
    title.style.display = 'block';
    title.style.marginBottom = '10px';
    title.style.fontSize = '18px';
    errorDiv.appendChild(title);
    
    const list = document.createElement('ul');
    list.style.cssText = 'text-align: left; margin: 0; padding-left: 20px;';
    
    errors.forEach(error => {
        const li = document.createElement('li');
        li.textContent = error;
        li.style.marginBottom = '5px';
        list.appendChild(li);
    });
    
    errorDiv.appendChild(list);
    
    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Dismiss';
    closeBtn.style.cssText = `
        background: rgba(255,255,255,0.2);
        border: 1px solid rgba(255,255,255,0.3);
        color: white;
        padding: 8px 20px;
        margin-top: 15px;
        border-radius: 4px;
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
    `;
    closeBtn.addEventListener('click', () => {
        errorDiv.remove();
    });
    errorDiv.appendChild(closeBtn);
    
    document.body.prepend(errorDiv);
    
    // Hide loader if visible
    if (typeof hideLoader === 'function') {
        hideLoader();
    }
}

/**
 * Initializes the application
 * @returns {Promise<void>}
 */
async function initApp() {
    try {
        // Show loader
        if (typeof showLoader === 'function') {
            showLoader('Initializing...');
        }
        
        // Log startup
        if (typeof appLog === 'function') {
            appLog('🚀 Starting ' + AppConfig.name + ' v' + AppConfig.version);
        }
        
        // Check dependencies
        const deps = checkDependencies();
        if (!deps.success) {
            AppState.errors = deps.missing.map(name => 
                'Missing dependency: ' + name
            );
            
            if (typeof appLog === 'function') {
                appLog('❌ Missing dependencies:', deps.missing.join(', '));
            }
            
            showStartupErrors(AppState.errors);
            return;
        }
        
        // Initialize audio (if available)
        if (typeof initAudio === 'function') {
            try {
                await initAudio();
            } catch (error) {
                if (typeof appLog === 'function') {
                    appLog('⚠️ Audio initialization warning:', error?.message || error);
                }
            }
        }
        
        // Initialize scene manager
        if (typeof initScenes === 'function') {
            await initScenes();
        } else {
            throw new Error('initScenes is not defined');
        }
        
        // Mark as initialized
        AppState.initialized = true;
        AppState.startupComplete = true;
        
        if (typeof appLog === 'function') {
            appLog('✅ Application initialized successfully');
        }
        
        // Hide loader
        if (typeof hideLoader === 'function') {
            hideLoader();
        }
        
    } catch (error) {
        AppState.errors.push(error?.message || 'Unknown initialization error');
        
        if (typeof appLog === 'function') {
            appLog('❌ Fatal initialization error:', error?.message || error);
        }
        
        showStartupErrors(['Failed to initialize: ' + (error?.message || 'Unknown error')]);
    }
}

/**
 * Global error handler
 * @param {ErrorEvent} event - Error event
 */
function handleGlobalError(event) {
    const error = event.error || event;
    const message = error?.message || 'Unknown error';
    
    if (typeof appLog === 'function') {
        appLog('❌ Uncaught error:', message, error?.stack);
    }
    
    // Show toast if available and app is initialized
    if (typeof showToast === 'function' && AppState.initialized) {
        showToast('An unexpected error occurred', 'error', 5000);
    }
}

/**
 * Global promise rejection handler
 * @param {PromiseRejectionEvent} event - Promise rejection event
 */
function handlePromiseRejection(event) {
    const error = event.reason;
    const message = error?.message || error || 'Unknown promise rejection';
    
    if (typeof appLog === 'function') {
        appLog('❌ Unhandled promise rejection:', message);
    }
    
    // Show toast if available and app is initialized
    if (typeof showToast === 'function' && AppState.initialized) {
        showToast('An unexpected error occurred', 'error', 5000);
    }
}

/**
 * Register global event listeners
 */
function registerGlobalListeners() {
    // Window load
    window.addEventListener('load', () => {
        if (typeof appLog === 'function') {
            appLog('📦 Window loaded');
        }
    });
    
    // Uncaught errors
    window.addEventListener('error', handleGlobalError);
    
    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', handlePromiseRejection);
}

/**
 * Unregister global event listeners
 * Removes only persistent global error handlers (not one-shot listeners)
 */
function unregisterGlobalListeners() {
    window.removeEventListener('error', handleGlobalError);
    window.removeEventListener('unhandledrejection', handlePromiseRejection);
}

// Register global listeners immediately
registerGlobalListeners();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    // DOM already ready, initialize immediately
    initApp();
}

// Expose app API globally
window.AppConfig = AppConfig;
window.AppState = AppState;
window.initApp = initApp;
window.checkDependencies = checkDependencies;
window.showStartupErrors = showStartupErrors;
window.registerGlobalListeners = registerGlobalListeners;
window.unregisterGlobalListeners = unregisterGlobalListeners;

// Freeze configuration
if (typeof Object.freeze === 'function') {
    Object.freeze(window.AppConfig);
}
