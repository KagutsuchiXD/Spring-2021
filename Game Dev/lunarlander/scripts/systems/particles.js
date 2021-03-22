MyGame.systems.ParticleSystem = function(spec) {
    'use strict';
    let nextName = 1;       // Unique identifier for the next particle
    spec.particles = {};

    // This creates one new particle
    function createThrust(angle) {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { width: size, height: size},  // Making square particles
            direction: Random.nextArcVector(angle),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev) + 35, // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean, spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0    // How long the particle has been alive, in seconds
        };

        return p;
    }

    function createExplosion() {
        let size = Random.nextGaussian(spec.size.mean, spec.size.stdev);
        let p = {
            center: { x: spec.center.x, y: spec.center.y },
            size: { width: size, height: size},
            direction: Random.nextCircleVector(),
            speed: Random.nextGaussian(spec.speed.mean, spec.speed.stdev) / 2, // pixels per second
            rotation: 0,
            lifetime: Random.nextGaussian(spec.lifetime.mean , spec.lifetime.stdev),    // How long the particle should live, in seconds
            alive: 0    // How long the particle has been alive, in seconds
        };

        return p;
    }

    // Update the state of all particles.  This includes removing any that have exceeded their lifetime.
    function update(elapsedTime) {
        let removeMe = [];
        // We work with time in seconds, elapsedTime comes in as milliseconds
        elapsedTime = elapsedTime / 1000;

        Object.getOwnPropertyNames(spec.particles).forEach(function(value, index, array) {
            let particle = spec.particles[value];
            // Update how long it has been alive
            particle.alive += elapsedTime;
            // Update its center
            particle.center.x += (elapsedTime * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime * particle.speed * particle.direction.y);
            // Rotate proportional to its speed
            particle.rotation += particle.speed / 500;
            // If the lifetime has expired, identify it for removal
            if (particle.alive > particle.lifetime) {
                removeMe.push(value);
            }
        });
        // Remove all of the expired particles
        for (let particle = 0; particle < removeMe.length; particle++) {
            delete spec.particles[removeMe[particle]];
        }
        removeMe.length = 0;
    }

    function shipThrust(angle){
        // Generate some new particles
        for (let particle = 0; particle < 3; particle++) {
            // Assign a unique name to each particle
            spec.particles[nextName++] = createThrust(angle);
        }
    }

    function shipCrash(){
        // Generate some new particles
        for (let particle = 0; particle < 10; particle++) {
            // Assign a unique name to each particle
            spec.particles[nextName++] = createExplosion();
        }
    }

    let api = {
        update: update,
        shipThrust: shipThrust,
        shipCrash: shipCrash,
        get particles() { return spec.particles; },
        get center(){return spec.center;},
        set center(point) {spec.center = {x: point.x, y: point.y}}
    };

    return api;
}