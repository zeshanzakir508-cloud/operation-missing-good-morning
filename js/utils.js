/**
 * utils.js - Generic Helper Functions for "Operation Missing Good Morning"
 * 
 * This module provides reusable utility functions that are completely
 * decoupled from business logic, story, scenes, animations, and sounds.
 * 
 * @module utils
 */

'use strict';

/**
 * Application Debug Mode - Auto-detects based on environment
 * @type {boolean}
 */
const DEBUG = (() => {
    // Enable debug on localhost, development, or when explicitly set
    const hostname = typeof window !== 'undefined' ? window.location?.hostname : '';
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' ||
           hostname.startsWith('192.168.') ||
           hostname.startsWith('10.') ||
           hostname.includes('.local') ||
           window.__DEBUG__ === true;
})();

/**
 * Delays execution for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer
 */
function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Clamps a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 250) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), wait);
    };
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 * @param {Function} func - Function to throttle
 * @param {number} wait - Milliseconds between invocations
 * @returns {Function} Throttled function
 */
function throttle(func, wait = 250) {
    let lastCall = 0;
    let timeoutId;
    return function(...args) {
        const now = Date.now();
        if (now - lastCall >= wait) {
            lastCall = now;
            func.apply(this, args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                func.apply(this, args);
            }, wait - (now - lastCall));
        }
    };
}

/**
 * Creates a DOM element with attributes, children, and event listeners
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string|Node} children - Child elements or text
 * @returns {HTMLElement} Created element
 */
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes and handle special cases
    Object.entries(attributes).forEach(([key, value]) => {
        // Handle event listeners
        if (key.startsWith('on') && typeof value === 'function') {
            const eventName = key.slice(2).toLowerCase();
            element.addEventListener(eventName, value);
        } else if (key === 'className') {
            element.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(element.style, value);
        } else if (key.startsWith('data-')) {
            element.dataset[key.slice(5)] = value;
        } else if (typeof value === 'boolean') {
            // Handle boolean attributes correctly
            if (value) {
                element.setAttribute(key, '');
            }
        } else {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    if (typeof children === 'string') {
        element.textContent = children;
    } else if (Array.isArray(children)) {
        children.forEach(child => {
            if (child instanceof Node) {
                element.appendChild(child);
            } else if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            }
        });
    } else if (children instanceof Node) {
        element.appendChild(children);
    } else if (children !== null && children !== undefined) {
        element.textContent = String(children);
    }
    
    return element;
}

/**
 * Removes all child nodes from an element
 * @param {HTMLElement} element - Element to clear
 */
function removeChildren(element) {
    if (!element) return;
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Shows an element by restoring its display property
 * @param {HTMLElement} element - Element to show
 * @param {string} display - Display style (default: 'block')
 */
function showElement(element, display = 'block') {
    if (!element) return;
    
    // If element has a data attribute for original display, use it
    const originalDisplay = element.dataset.originalDisplay;
    if (originalDisplay) {
        element.style.display = originalDisplay;
        delete element.dataset.originalDisplay;
    } else {
        element.style.display = display;
    }
}

/**
 * Hides an element while preserving its display value
 * @param {HTMLElement} element - Element to hide
 */
function hideElement(element) {
    if (!element) return;
    
    // Store original display value before hiding
    const computedStyle = window.getComputedStyle(element);
    const currentDisplay = computedStyle.display;
    if (currentDisplay !== 'none') {
        element.dataset.originalDisplay = currentDisplay;
    }
    element.style.display = 'none';
}

/**
 * Toggles a class on an element
 * @param {HTMLElement} element - Element to toggle class on
 * @param {string} className - Class name to toggle
 * @param {boolean} force - Force add/remove
 * @returns {boolean} New class state
 */
function toggleClass(element, className, force) {
    if (!element) return false;
    if (force !== undefined) {
        element.classList.toggle(className, force);
        return force;
    }
    element.classList.toggle(className);
    return element.classList.contains(className);
}

/**
 * Sets text content of an element safely
 * @param {HTMLElement} element - Element to set text on
 * @param {string} text - Text to set
 */
function setText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * Sets HTML content of an element safely
 * NOTE: Only use with trusted HTML. Never pass user-generated content.
 * @param {HTMLElement} element - Element to set HTML on
 * @param {string} html - HTML string to set
 */
function setHTML(element, html) {
    if (element) {
        element.innerHTML = html;
    }
}

/**
 * Safe query selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {HTMLElement|null} Found element or null
 */
function qs(selector, context = document) {
    try {
        return context.querySelector(selector);
    } catch (error) {
        return null;
    }
}

/**
 * Safe query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {Array} Array of found elements
 */
function qsa(selector, context = document) {
    try {
        return Array.from(context.querySelectorAll(selector));
    } catch (error) {
        return [];
    }
}

/**
 * Shows loading overlay
 * @param {string} message - Optional loading message
 */
function showLoader(message) {
    const loader = qs('#loader');
    if (loader) {
        showElement(loader, 'flex');
        const messageEl = qs('#loader-text', loader);
        if (messageEl && message !== undefined) {
            setText(messageEl, message);
        }
    }
}

/**
 * Hides loading overlay
 */
function hideLoader() {
    const loader = qs('#loader');
    if (loader) {
        hideElement(loader);
    }
}

/**
 * Shows toast notification
 * @param {string} message - Toast message
 * @param {string} type - Toast type (info, success, error, warning)
 * @param {number} duration - Display duration in ms
 * @returns {number} Timeout ID for potential early dismissal
 */
function showToast(message, type = 'info', duration = 3000) {
    const container = qs('#toast');
    if (!container) return 0;
    
    const toast = createElement('div', {
        className: `toast toast-${type}`,
        role: 'alert'
    }, message);
    
    container.appendChild(toast);
    
    // Trigger animation
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });
    
    // Auto hide after duration
    const timeoutId = setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, duration);
    
    return timeoutId;
}

/**
 * Hides all toasts
 */
function hideToast() {
    const container = qs('#toast');
    if (!container) return;
    removeChildren(container);
}

/**
 * Application logger - only logs when DEBUG is true
 * @param {...any} args - Arguments to log
 */
function appLog(...args) {
    if (DEBUG && typeof console !== 'undefined' && console.log) {
        console.log('[APP]', ...args);
    }
}

/**
 * Safely executes a function with error handling (synchronous)
 * @param {Function} fn - Function to execute
 * @param {Function} errorHandler - Error callback
 * @returns {any} Result of the function or error handler return
 */
function safeExecuteSync(fn, errorHandler = null) {
    try {
        return fn();
    } catch (error) {
        appLog('Error in safeExecuteSync:', error?.message || error);
        if (typeof errorHandler === 'function') {
            return errorHandler(error);
        }
        return null;
    }
}

/**
 * Safely executes an async function with error handling
 * @param {Function} fn - Async function to execute
 * @param {Function} errorHandler - Error callback
 * @returns {Promise<any>} Result of the function or error handler return
 */
async function safeExecute(fn, errorHandler = null) {
    try {
        return await fn();
    } catch (error) {
        appLog('Error in safeExecute:', error?.message || error);
        if (typeof errorHandler === 'function') {
            return errorHandler(error);
        }
        return null;
    }
}

/**
 * Waits for DOM ready state
 * @returns {Promise<void>}
 */
function ready() {
    return new Promise(resolve => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', resolve);
        } else {
            resolve();
        }
    });
}

/**
 * Generates a UUID v4 with crypto.randomUUID() fallback
 * @returns {string} UUID
 */
function generateUUID() {
    // Use native crypto.randomUUID() if available
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    
    // Fallback implementation
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

/**
 * Formats a date
 * @param {Date|string} date - Date to format
 * @param {string} format - Format string (default: 'YYYY-MM-DD HH:mm:ss')
 * @returns {string} Formatted date
 */
function formatDate(date, format = 'YYYY-MM-DD HH:mm:ss') {
    const d = date instanceof Date ? date : new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const pad = (n) => String(n).padStart(2, '0');
    const replacements = {
        'YYYY': d.getFullYear(),
        'MM': pad(d.getMonth() + 1),
        'DD': pad(d.getDate()),
        'HH': pad(d.getHours()),
        'mm': pad(d.getMinutes()),
        'ss': pad(d.getSeconds())
    };
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => replacements[match] || match);
}

/**
 * Waits for an element to appear in the DOM
 * @param {string} selector - CSS selector
 * @param {number} timeout - Maximum wait time in ms
 * @returns {Promise<HTMLElement|null>} Found element or null
 */
function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve) => {
        let timeoutId = null;
        let observer = null;
        
        // Check if element already exists
        const existing = qs(selector);
        if (existing) {
            resolve(existing);
            return;
        }
        
        // Set up observer
        observer = new MutationObserver(() => {
            const element = qs(selector);
            if (element) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                observer.disconnect();
                resolve(element);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // Set timeout
        timeoutId = setTimeout(() => {
            if (observer) {
                observer.disconnect();
            }
            resolve(null);
        }, timeout);
    });
}

// Expose utilities globally
window.utils = {
    sleep,
    randomInt,
    clamp,
    debounce,
    throttle,
    createElement,
    removeChildren,
    showElement,
    hideElement,
    toggleClass,
    setText,
    setHTML,
    qs,
    qsa,
    showLoader,
    hideLoader,
    showToast,
    hideToast,
    appLog,
    safeExecuteSync,
    safeExecute,
    ready,
    generateUUID,
    formatDate,
    waitForElement
};

// Convenience exports for global scope
window.sleep = sleep;
window.appLog = appLog;
window.showToast = showToast;
window.hideToast = hideToast;
window.showLoader = showLoader;
window.hideLoader = hideLoader;
window.safeExecute = safeExecute;

// Freeze utility object to prevent modifications
if (typeof Object.freeze === 'function') {
    Object.freeze(window.utils);
}
