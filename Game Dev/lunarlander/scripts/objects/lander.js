MyGame.objects.Lander = function(spec) {
    'use strict';
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    spec.alive = true;
    spec.landed = false;

    function updatePosition(elapsedTime){
        if(!spec.landed){
            spec.velocity.vy += (15 * elapsedTime/ 1000);

            spec.center.x += (spec.velocity.vx * (elapsedTime/ 1000));
            spec.center.y += (spec.velocity.vy * (elapsedTime/ 1000));
        }
    }

    function rotateRight(elapsedTime) {
        if(!spec.landed){
            spec.rotation += spec.rotateRate * (elapsedTime / 1000);
        }
    }

    function rotateLeft(elapsedTime) {
        if(!spec.landed){
            spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
        }
    }

    function thrust(elapsedTime) {
        let ax = Math.cos(spec.rotation) * spec.thrust * elapsedTime;
        let ay = Math.sin(spec.rotation) * spec.thrust * elapsedTime;

        spec.fuel -= (elapsedTime / 1000);

        spec.velocity.vx += ax;
        spec.velocity.vy += ay;
    }

    function updateState(land, alive){
        spec.landed = land;
        spec.alive = alive;
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrust: thrust,
        updatePosition: updatePosition,
        updateState: updateState,
        get imageReady() { return imageReady; },
        get rotation() { return spec.rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get radius() {return spec.radius},
        get alive() {return spec.alive},
        get landed() {return spec.landed},
        get speed() {return (Math.sqrt(Math.abs(Math.pow(spec.velocity.vx, 2)) + Math.abs(Math.pow(spec.velocity.vy, 2))) / 15)},
        get fuel() {return spec.fuel}
    };

    return api;
}