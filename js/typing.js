/**
 * ==========================================================
 * Operation Missing Good Morning
 * Typing Engine
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

/* ==========================================================
   TYPING ENGINE
========================================================== */

const TypingEngine = {

    isTyping: false,

    skipRequested: false,

    currentElement: null,

    currentText: "",

    currentIndex: 0

};

/* ==========================================================
   RESET
========================================================== */

function resetTyping(){

    TypingEngine.isTyping = false;

    TypingEngine.skipRequested = false;

    TypingEngine.currentElement = null;

    TypingEngine.currentText = "";

    TypingEngine.currentIndex = 0;

}

/* ==========================================================
   REQUEST SKIP
========================================================== */

function skipTyping(){

    TypingEngine.skipRequested = true;

}

/* ==========================================================
   STATUS
========================================================== */

function isTyping(){

    return TypingEngine.isTyping;

}

/* ==========================================================
   TYPE TEXT
========================================================== */

async function typeText(element,text){

    if(!element){

        return;

    }

    if(!CONFIG.ui.enableTypingEffect){

        element.textContent=text;

        return;

    }

    resetTyping();

    TypingEngine.isTyping=true;

    TypingEngine.currentElement=element;

    TypingEngine.currentText=text;

    element.textContent="";

    for(

        let i=0;

        i<text.length;

        i++

    ){

        TypingEngine.currentIndex=i;

        if(

            TypingEngine.skipRequested

        ){

            element.textContent=text;

            break;

        }

        element.textContent+=text[i];

        await sleep(

            CONFIG.story.typingSpeed

        );

    }

    TypingEngine.isTyping=false;

}

/* ==========================================================
   TYPE TITLE
========================================================== */

async function typeTitle(text){

    await typeText(

        UI.title,

        text

    );

}

/* ==========================================================
   TYPE CONTENT
========================================================== */

async function typeContent(text){

    await typeText(

        UI.content,

        text

    );

}
/* ==========================================================
   TYPE SCENE
========================================================== */

async function typeScene(scene){

    if(!scene){

        return;

    }

    await typeTitle(scene.title);

    await typeContent(scene.message);

}

/* ==========================================================
   STOP TYPING
========================================================== */

function stopTyping(){

    if(

        !TypingEngine.isTyping ||

        !TypingEngine.currentElement

    ){

        return;

    }

    TypingEngine.skipRequested = true;

}

/* ==========================================================
   COMPLETE IMMEDIATELY
========================================================== */

function completeTyping(){

    if(

        !TypingEngine.currentElement

    ){

        return;

    }

    TypingEngine.currentElement.textContent =

        TypingEngine.currentText;

    TypingEngine.currentIndex =

        TypingEngine.currentText.length;

    TypingEngine.skipRequested = true;

    TypingEngine.isTyping = false;

}

/* ==========================================================
   CLEAR
========================================================== */

function clearTyping(){

    if(UI.title){

        UI.title.textContent = "";

    }

    if(UI.content){

        UI.content.textContent = "";

    }

    resetTyping();

}

/* ==========================================================
   GETTERS
========================================================== */

function getTypingProgress(){

    if(

        !TypingEngine.currentText.length

    ){

        return 0;

    }

    return Math.round(

        (TypingEngine.currentIndex /

        TypingEngine.currentText.length)

        *100

    );

}

function getCurrentText(){

    return TypingEngine.currentText;

}

/* ==========================================================
   EXPORT
========================================================== */

window.TypingEngine = TypingEngine;

window.typeText = typeText;

window.typeTitle = typeTitle;

window.typeContent = typeContent;

window.typeScene = typeScene;

window.stopTyping = stopTyping;

window.skipTyping = skipTyping;

window.completeTyping = completeTyping;

window.clearTyping = clearTyping;

window.isTyping = isTyping;

window.getTypingProgress = getTypingProgress;

window.getCurrentText = getCurrentText;
