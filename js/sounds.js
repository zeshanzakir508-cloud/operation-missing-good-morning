/**
 * ==========================================================
 * Operation Missing Good Morning
 * Sound Engine
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

/* ==========================================================
   SOUND STATE
========================================================== */

const SoundEngine = {

    enabled: CONFIG.sound.enabled,

    volume: CONFIG.sound.volume,

    sounds: {

        beep: document.getElementById("beep"),

        success: document.getElementById("success"),

        error: document.getElementById("error")

    }

};

/* ==========================================================
   INITIALIZE
========================================================== */

function initializeSounds(){

    Object.values(

        SoundEngine.sounds

    ).forEach(sound=>{

        if(!sound){

            return;

        }

        sound.volume = SoundEngine.volume;

    });

}

/* ==========================================================
   PLAY
========================================================== */

function playSound(name){

    if(

        !SoundEngine.enabled

    ){

        return;

    }

    const audio =

        SoundEngine.sounds[name];

    if(!audio){

        return;

    }

    try{

        audio.pause();

        audio.currentTime = 0;

        audio.play().catch(()=>{});

    }

    catch(e){

        console.warn(e);

    }

}

/* ==========================================================
   STOP
========================================================== */

function stopSound(name){

    const audio =

        SoundEngine.sounds[name];

    if(!audio){

        return;

    }

    audio.pause();

    audio.currentTime = 0;

}

/* ==========================================================
   STOP ALL
========================================================== */

function stopAllSounds(){

    Object.keys(

        SoundEngine.sounds

    ).forEach(stopSound);

}

/* ==========================================================
   ENABLE
========================================================== */

function enableSounds(){

    SoundEngine.enabled = true;

}

/* ==========================================================
   DISABLE
========================================================== */

function disableSounds(){

    SoundEngine.enabled = false;

    stopAllSounds();

}

/* ==========================================================
   TOGGLE
========================================================== */

function toggleSounds(){

    SoundEngine.enabled =

        !SoundEngine.enabled;

}

/* ==========================================================
   VOLUME
========================================================== */

function setVolume(volume){

    volume =

        Math.max(

            0,

            Math.min(1,volume)

        );

    SoundEngine.volume = volume;

    Object.values(

        SoundEngine.sounds

    ).forEach(sound=>{

        if(sound){

            sound.volume = volume;

        }

    });

}

/* ==========================================================
   SHORTCUTS
========================================================== */

function playBeep(){

    playSound("beep");

}

function playSuccess(){

    playSound("success");

}

function playError(){

    playSound("error");

}

/* ==========================================================
   AUTO INIT
========================================================== */

initializeSounds();

/* ==========================================================
   EXPORT
========================================================== */

window.SoundEngine = SoundEngine;

window.playSound = playSound;

window.stopSound = stopSound;

window.stopAllSounds = stopAllSounds;

window.enableSounds = enableSounds;

window.disableSounds = disableSounds;

window.toggleSounds = toggleSounds;

window.setVolume = setVolume;

window.playBeep = playBeep;

window.playSuccess = playSuccess;

window.playError = playError;
