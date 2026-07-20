/**
 * ==========================================================
 * Operation Missing Good Morning
 * Utility Functions
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

/* ==========================================================
   DOM HELPERS
========================================================== */

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

/* ==========================================================
   ELEMENTS
========================================================== */

const UI = {

    app: $("#app"),

    screen: $("#screen"),

    title: $("#scene-title"),

    content: $("#scene-content"),

    progressBar: $("#progress-bar"),

    progressWrapper: $("#progress-wrapper"),

    button: $("#primary-button"),

    loader: $("#loader"),

    loaderText: $("#loader-text"),

    toast: $("#toast"),

    effects: $("#effects")

};

/* ==========================================================
   WAIT
========================================================== */

function sleep(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

/* ==========================================================
   BUTTON
========================================================== */

function setButton(text){

    if(!UI.button) return;

    UI.button.textContent = text;

}

/* ==========================================================
   TITLE
========================================================== */

function setTitle(text){

    if(!UI.title) return;

    UI.title.textContent = text;

}

/* ==========================================================
   CONTENT
========================================================== */

function setContent(text){

    if(!UI.content) return;

    UI.content.textContent = text;

}

/* ==========================================================
   PROGRESS
========================================================== */

function setProgress(value){

    if(!UI.progressBar) return;

    const percent = Math.max(
        0,
        Math.min(value, CONFIG.progress.max)
    );

    UI.progressBar.style.width = percent + "%";

}

/* ==========================================================
   LOADER
========================================================== */

function hideLoader(){

    if(!UI.loader) return;

    UI.loader.classList.add("fade-out");

    setTimeout(()=>{

        UI.loader.classList.add("hidden");

    },500);

}

function showLoader(text="Loading..."){

    if(!UI.loader) return;

    UI.loader.classList.remove("hidden");

    if(UI.loaderText){

        UI.loaderText.textContent = text;

    }

}

/* ==========================================================
   TOAST
========================================================== */

function showToast(message,time=2500){

    if(!UI.toast) return;

    UI.toast.textContent=message;

    UI.toast.classList.remove("toast-hide");

    UI.toast.classList.add("toast-show");

    setTimeout(()=>{

        UI.toast.classList.remove("toast-show");

        UI.toast.classList.add("toast-hide");

    },time);

}

/* ==========================================================
   CLASS HELPERS
========================================================== */

function addClass(element,className){

    if(!element) return;

    element.classList.add(className);

}

function removeClass(element,className){

    if(!element) return;

    element.classList.remove(className);

}

function toggleClass(element,className){

    if(!element) return;

    element.classList.toggle(className);

}

/* ==========================================================
   SCREEN
========================================================== */

function hideScreen(){

    if(!UI.screen) return;

    UI.screen.classList.add("fade-out");

}

function showScreen(){

    if(!UI.screen) return;

    UI.screen.classList.remove("fade-out");

    UI.screen.classList.add("fade-in");

}

/* ==========================================================
   RANDOM
========================================================== */

function random(min,max){

    return Math.floor(

        Math.random()*(max-min+1)

    )+min;

}

/* ==========================================================
   LOG
========================================================== */

function appLog(message){

    console.log(

        "[Operation]",

        message

    );

}

/* ==========================================================
   STATUS COLOR
========================================================== */

function getStatusClass(type){

    switch(type){

        case "success":

            return "text-success";

        case "danger":

            return "text-danger";

        case "warning":

            return "text-warning";

        default:

            return "";

    }

}

/* ==========================================================
   SAFE HTML
========================================================== */

function escapeHTML(text){

    const div=document.createElement("div");

    div.textContent=text;

    return div.innerHTML;

}

/* ==========================================================
   COPY
========================================================== */

async function copyText(text){

    try{

        await navigator.clipboard.writeText(text);

        showToast("Copied");

    }

    catch(e){

        console.error(e);

    }

}

/* ==========================================================
   EXPORT
========================================================== */

window.UI = UI;

window.$ = $;
window.$$ = $$;

window.sleep = sleep;

window.setTitle = setTitle;
window.setContent = setContent;
window.setButton = setButton;
window.setProgress = setProgress;

window.showLoader = showLoader;
window.hideLoader = hideLoader;

window.showToast = showToast;

window.addClass = addClass;
window.removeClass = removeClass;
window.toggleClass = toggleClass;

window.hideScreen = hideScreen;
window.showScreen = showScreen;

window.random = random;

window.escapeHTML = escapeHTML;

window.copyText = copyText;

window.appLog = appLog;

window.getStatusClass = getStatusClass;
