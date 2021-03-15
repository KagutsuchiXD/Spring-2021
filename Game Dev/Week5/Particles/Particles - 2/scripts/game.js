//------------------------------------------------------------------
//
// This provides the "game" code.
//
//------------------------------------------------------------------
MyGame.main = (function (graphics) {
    'use strict';

    console.log('game initializing...');

    let particles = [];
    let lastTimeStamp = performance.now();

    function Particle(spec) {
        spec.size = { x: 10, y: 10 };
        spec.alive = 0;

        function update(elapsedTime) {
            //
            // We work with time in seconds, elapsedTime comes in as milliseconds
            elapsedTime = elapsedTime / 1000;
            //
            // Update how long it has been alive
            spec.alive += elapsedTime;

            //
            // Update its center
            spec.center.x += (elapsedTime * spec.speed * spec.direction.x);
            spec.center.y += (elapsedTime * spec.speed * spec.direction.y);

            //
            // Rotate proportional to its speed
            spec.rotation += spec.speed / 500;

            //
            // Return true if this particle is still alive
            return (spec.alive < spec.lifetime);
        };

        let api = {
            update: update,
            get center() { return spec.center; },
            get size() { return spec.size; },
            get rotation() { return spec.rotation; },
            get fill() { return 'rgba(255, 255, 255, 1)'; },
            get stroke() { return 'rgba(0, 0, 0, 1)'; }
        };

        return api;
    }

    //------------------------------------------------------------------
    //
    // Update the particles
    //
    //------------------------------------------------------------------
    function update(elapsedTime) {
        let particle = 0;
        let aliveParticles = [];

        //
        // Go through and update each of the currently alive particles
        aliveParticles.length = 0;
        for (particle = 0; particle < particles.length; particle++) {
            //
            // A return value of true indicates this particle is still alive
            if (particles[particle].update(elapsedTime)) {
                aliveParticles.push(particles[particle]);
            }
        }
        particles = aliveParticles;

        //
        // Generate some new particles
        for (particle = 0; particle < 8; particle++) {
            let p = {
                center: { x: 300, y: 300},
                direction: Random.nextCircleVector(),
                speed: Random.nextGaussian(50, 25), // pixels per second
                rotation: 0,
                lifetime:  Random.nextGaussian(3, 1)    // seconds
            };

            particles.push(Particle(p));
        }
    }

    //------------------------------------------------------------------
    //
    // Render the particles
    //
    //------------------------------------------------------------------
    function render() {
        graphics.clear();

        for (let particle = 0; particle < particles.length; particle++) {
            graphics.drawRectangle(particles[particle]);
        }
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
}(MyGame.graphics));
