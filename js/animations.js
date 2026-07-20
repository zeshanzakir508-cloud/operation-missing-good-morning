/**
 * ==========================================================
 * Operation Missing Good Morning
 * Animation Engine
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

/* ==========================================================
   ANIMATION CLASSES
========================================================== */

const AnimationClasses = {

    fadeIn: "fade-in",

    fadeOut: "fade-out",

    slideUp: "slide-up",

    slideDown: "slide-down",

    slideLeft: "slide-left",

    slideRight: "slide-right",

    zoomIn: "zoom-in",

    pulse: "pulse",

    glow: "glow",

    shake: "shake",

    heartbeat: "heartbeat",

    float: "float",

    rotate: "rotate"

};

/* ==========================================================
   REMOVE ALL ANIMATIONS
========================================================== */

function clearAnimations(element){

    if(!element){

        return;

    }

    Object.values(AnimationClasses).forEach(className=>{

        element.classList.remove(className);

    });

}

/* ==========================================================
   PLAY ANIMATION
========================================================== */

function animate(element,animation){

    if(!element){

        return;

    }

    clearAnimations(element);

    void element.offsetWidth;

    element.classList.add(animation);

}

/* ==========================================================
   FADE
========================================================== */

function fadeIn(element){

    animate(

        element,

        AnimationClasses.fadeIn

    );

}

function fadeOut(element){

    animate(

        element,

        AnimationClasses.fadeOut

    );

}

/* ==========================================================
   SLIDE
========================================================== */

function slideUp(element){

    animate(

        element,

        AnimationClasses.slideUp

    );

}

function slideDown(element){

    animate(

        element,

        AnimationClasses.slideDown

    );

}

function slideLeft(element){

    animate(

        element,

        AnimationClasses.slideLeft

    );

}

function slideRight(element){

    animate(

        element,

        AnimationClasses.slideRight

    );

}

/* ==========================================================
   SPECIAL EFFECTS
========================================================== */

function pulse(element){

    animate(

        element,

        AnimationClasses.pulse

    );

}

function glow(element){

    animate(

        element,

        AnimationClasses.glow

    );

}

function shake(element){

    animate(

        element,

        AnimationClasses.shake

    );

}

function heartbeat(element){

    animate(

        element,

        AnimationClasses.heartbeat

    );

}

function zoomIn(element){

    animate(

        element,

        AnimationClasses.zoomIn

    );

}

function floating(element){

    animate(

        element,

        AnimationClasses.float

    );

}

function rotate(element){

    animate(

        element,

        AnimationClasses.rotate

    );

}

/* ==========================================================
   SCREEN TRANSITION
========================================================== */

async function transitionScreen(){

    fadeOut(UI.screen);

    await sleep(

        CONFIG.animation.sceneTransition

    );

    clearAnimations(UI.screen);

    fadeIn(UI.screen);

}

/* ==========================================================
   BUTTON CLICK
========================================================== */

function animateButton(){

    pulse(UI.button);

}

/* ==========================================================
   ALERT
========================================================== */

function alertAnimation(){

    shake(UI.screen);

}

/* ==========================================================
   SUCCESS
========================================================== */

function successAnimation(){

    glow(UI.screen);

}

/* ==========================================================
   ERROR
========================================================== */

function errorAnimation(){

    shake(UI.screen);

    showToast(

        "Investigation Error"

    );

}

/* ==========================================================
   EXPORT
========================================================== */

window.AnimationClasses = AnimationClasses;

window.clearAnimations = clearAnimations;

window.animate = animate;

window.fadeIn = fadeIn;

window.fadeOut = fadeOut;

window.slideUp = slideUp;

window.slideDown = slideDown;

window.slideLeft = slideLeft;

window.slideRight = slideRight;

window.zoomIn = zoomIn;

window.pulse = pulse;

window.glow = glow;

window.shake = shake;

window.heartbeat = heartbeat;

window.floating = floating;

window.rotate = rotate;

window.transitionScreen = transitionScreen;

window.animateButton = animateButton;

window.alertAnimation = alertAnimation;

window.successAnimation = successAnimation;

window.errorAnimation = errorAnimation;
