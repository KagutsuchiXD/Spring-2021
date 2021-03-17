MyGame.objects.Lander = function(spec) {
    'use strict';
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    let alive = true;
    let landed = false;

    function updatePosition(elapsedTime){
        spec.velocity.vy += (9 * elapsedTime/ 1000);

        spec.center.x += (spec.velocity.vx * (elapsedTime/ 1000));
        spec.center.y += (spec.velocity.vy * (elapsedTime/ 1000));
    }


    function rotateRight(elapsedTime) {
        spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    }

    function rotateLeft(elapsedTime) {
        spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    }

    function thrust(elapsedTime) {
        let ax = Math.cos(spec.rotation) * spec.thrust * elapsedTime;
        let ay = Math.sin(spec.rotation) * spec.thrust * elapsedTime;

        spec.velocity.vx += ax;
        spec.velocity.vy += ay;
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrust: thrust,
        updatePosition: updatePosition,
        get imageReady() { return imageReady; },
        get rotation() { return spec.rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; },
        get radius() {return spec.radius},
        get alive() {return alive},
        get landed() {return landed},
        get speed() {return Math.sqrt(Math.abs(Math.pow(spec.velocity.vx, 2)) * Math.abs(Math.pow(spec.velocity.vy, 2)))},
        get fuel() {return spec.fuel}

    };

    return api;
}