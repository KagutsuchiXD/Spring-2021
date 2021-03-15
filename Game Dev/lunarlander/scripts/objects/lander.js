MyGame.objects.Lander = function(spec) {
    'use strict';

    let rotation = 0;
    let imageReady = false;
    let image = new Image();

    image.onload = function() {
        imageReady = true;
    };
    image.src = spec.imageSrc;

    function rotateRight(elapsedTime) {
        spec.rotation += spec.rotateRate * (elapsedTime / 1000);
    }

    function rotateLeft(elapsedTime) {
        spec.rotation -= spec.rotateRate * (elapsedTime / 1000);
    }

    function thrust(elapsedTime) {

    }


    function moveTo(pos) {
        spec.center.x = pos.x;
        spec.center.y = pos.y;
    }

    let api = {
        rotateLeft: rotateLeft,
        rotateRight: rotateRight,
        thrust: thrust,
        moveTo: moveTo,
        get imageReady() { return imageReady; },
        get rotation() { return rotation; },
        get image() { return image; },
        get center() { return spec.center; },
        get size() { return spec.size; }
    };

    return api;
}