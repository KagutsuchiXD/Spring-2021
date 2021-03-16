MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    function drawTexture(image, center, rotation, size) {
        context.save();

        context.translate(center.x, center.y);
        context.rotate(rotation);
        context.translate(-center.x, -center.y);

        context.drawImage(
            image,
            center.x - size.width / 2,
            center.y - size.height / 2,
            size.width, size.height);

        context.restore();
    }

    function drawTerrain(spec){
        context.beginPath();
        context.moveTo(spec[0].x, spec[0].y);
        for (let i = 1; i < spec.length; i++){
            context.lineTo(spec[i].x, spec[i].y);
        }
        context.closePath();
        context.strokeStyle = 'rgb(0, 0, 0)';
        context.stroke();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawTerrain: drawTerrain,
        //drawText: drawText
    };

    return api;
}());