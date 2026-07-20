/**
 * ==========================================================
 * Operation Missing Good Morning
 * Scene Manager
 * Part 1
 * ==========================================================
 */

"use strict";

/* ==========================================================
   STATE
========================================================== */

const SceneManager = {

    currentScene: 0,

    totalScenes: STORY.length,

    busy: false

};

/* ==========================================================
   CURRENT SCENE
========================================================== */

function getCurrentScene(){

    return STORY[
        SceneManager.currentScene
    ];

}

/* ==========================================================
   RENDER TITLE
========================================================== */

async function renderTitle(scene){

    await typeTitle(

        scene.title

    );

}

/* ==========================================================
   RENDER CONTENT
========================================================== */

async function renderContent(scene){

    await typeContent(

        scene.message

    );

}

/* ==========================================================
   RENDER BUTTON
========================================================== */

function renderButton(scene){

    setButton(

        scene.button

    );

}

/* ==========================================================
   RENDER PROGRESS
========================================================== */

function renderProgress(scene){

    setProgress(

        scene.progress

    );

}

/* ==========================================================
   UPDATE STATUS
========================================================== */

function updateStatus(scene){

    switch(scene.type){

        case "success":

            successAnimation();

            break;

        case "danger":

            alertAnimation();

            break;

        case "warning":

            pulse(UI.screen);

            break;

        default:

            fadeIn(UI.screen);

    }

}

/* ==========================================================
   PLAY SCENE SOUND
========================================================== */

function playSceneSound(scene){

    switch(scene.type){

        case "success":

            playSuccess();

            break;

        case "danger":

            playError();

            break;

        default:

            playBeep();

    }

}

/* ==========================================================
   PRINT LOGS
========================================================== */

async function printLogs(scene){

    if(

        !scene.logs ||

        !scene.logs.length

    ){

        return;

    }

    for(

        const log of scene.logs

    ){

        appLog(log);

        await sleep(120);

    }

}

/* ==========================================================
   RENDER SCENE
========================================================== */

async function renderScene(index){

    if(

        SceneManager.busy

    ){

        return;

    }

    if(

        index < 0 ||

        index >= STORY.length

    ){

        return;

    }

    SceneManager.busy = true;

    const scene = STORY[index];

    clearTyping();

    await transitionScreen();

    renderProgress(scene);

    renderButton(scene);

    playSceneSound(scene);

    updateStatus(scene);

    await renderTitle(scene);

    await renderContent(scene);

    await printLogs(scene);

    SceneManager.currentScene = index;

    SceneManager.busy = false;

}

/* ==========================================================
   FIRST SCENE
========================================================== */

async function loadFirstScene(){

    await renderScene(0);

}
