//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function (systems, renderer, graphics) {
    'use strict';

    console.log('game initializing...');

    let lastTimeStamp = performance.now();
    //
    // Define a sample particle system to demonstrate its capabilities
    let particles = systems.ParticleSystem({
            center: { x: 300, y: 300 },
            size: { x: 10, y: 10 },
            speed: { mean: 50, stdev: 25 },
            lifetime: { mean: 4, stdev: 1 }
        },
        graphics);
    let renderParticles = renderer.ParticleSystem(particles, graphics, 'rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 1)');

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        //
        // Tell the existing particles to update themselves
        particles.update(elapsedTime);
    }

    //------------------------------------------------------------------
    //
    // Render the particles
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        renderParticles.render();
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {
        let elapsedTime = (time - lastTimeStamp);

        update(elapsedTime);
        lastTimeStamp = time;

        render();

        requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
}(MyGame.systems, MyGame.render, MyGame.graphics));
