/**
 * ==========================================================
 * Operation Missing Good Morning
 * Confetti Engine
 * Version: 1.0.0
 * ==========================================================
 */

"use strict";

/* ==========================================================
   STATE
========================================================== */

const Confetti = {

    canvas: null,

    ctx: null,

    particles: [],

    animationId: null,

    running: false

};

/* ==========================================================
   PARTICLE
========================================================== */

function createParticle(){

    const colors = [

        "#3B82F6",
        "#22C55E",
        "#FACC15",
        "#EF4444",
        "#FFFFFF"

    ];

    return {

        x: Math.random() * window.innerWidth,

        y: -20,

        size: 4 + Math.random() * 8,

        speedY: 2 + Math.random() * 4,

        speedX: -2 + Math.random() * 4,

        rotation: Math.random() * 360,

        rotationSpeed: -6 + Math.random() * 12,

        color: colors[Math.floor(Math.random() * colors.length)],

        opacity: 1

    };

}

/* ==========================================================
   CANVAS
========================================================== */

function createCanvas(){

    if(Confetti.canvas){

        return;

    }

    const canvas = document.createElement("canvas");

    canvas.style.position = "fixed";
    canvas.style.left = "0";
    canvas.style.top = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "9998";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    document.body.appendChild(canvas);

    Confetti.canvas = canvas;
    Confetti.ctx = canvas.getContext("2d");

}

/* ==========================================================
   RESIZE
========================================================== */

function resizeConfetti(){

    if(!Confetti.canvas){

        return;

    }

    Confetti.canvas.width = window.innerWidth;
    Confetti.canvas.height = window.innerHeight;

}

/* ==========================================================
   DRAW
========================================================== */

function drawParticles(){

    const ctx = Confetti.ctx;

    ctx.clearRect(

        0,
        0,
        Confetti.canvas.width,
        Confetti.canvas.height

    );

    Confetti.particles.forEach(p=>{

        ctx.save();

        ctx.globalAlpha = p.opacity;

        ctx.translate(p.x,p.y);

        ctx.rotate(

            p.rotation*Math.PI/180

        );

        ctx.fillStyle = p.color;

        ctx.fillRect(

            -p.size/2,

            -p.size/2,

            p.size,

            p.size

        );

        ctx.restore();

    });

}

/* ==========================================================
   UPDATE
========================================================== */

function updateParticles(){

    Confetti.particles.forEach(p=>{

        p.x += p.speedX;

        p.y += p.speedY;

        p.rotation += p.rotationSpeed;

        if(

            p.y >

            window.innerHeight + 30

        ){

            p.opacity = 0;

        }

    });

    Confetti.particles =

        Confetti.particles.filter(

            p=>p.opacity>0

        );

}

/* ==========================================================
   LOOP
========================================================== */

function confettiLoop(){

    if(!Confetti.running){

        return;

    }

    updateParticles();

    drawParticles();

    Confetti.animationId =

        requestAnimationFrame(

            confettiLoop

        );

}

/* ==========================================================
   START
========================================================== */

function startConfetti(count=180){

    stopConfetti();

    createCanvas();

    resizeConfetti();

    Confetti.running = true;

    Confetti.particles = [];

    for(

        let i=0;

        i<count;

        i++

    ){

        Confetti.particles.push(

            createParticle()

        );

    }

    confettiLoop();

}

/* ==========================================================
   STOP
========================================================== */

function stopConfetti(){

    Confetti.running = false;

    if(

        Confetti.animationId

    ){

        cancelAnimationFrame(

            Confetti.animationId

        );

    }

    Confetti.animationId = null;

    Confetti.particles = [];

    if(

        Confetti.ctx &&
        Confetti.canvas

    ){

        Confetti.ctx.clearRect(

            0,

            0,

            Confetti.canvas.width,

            Confetti.canvas.height

        );

    }

}

/* ==========================================================
   DESTROY
========================================================== */

function destroyConfetti(){

    stopConfetti();

    if(

        Confetti.canvas

    ){

        Confetti.canvas.remove();

    }

    Confetti.canvas = null;
    Confetti.ctx = null;

}

/* ==========================================================
   EVENTS
========================================================== */

window.addEventListener(

    "resize",

    resizeConfetti

);

/* ==========================================================
   EXPORT
========================================================== */

window.Confetti = Confetti;

window.startConfetti = startConfetti;

window.stopConfetti = stopConfetti;

window.destroyConfetti = destroyConfetti;
