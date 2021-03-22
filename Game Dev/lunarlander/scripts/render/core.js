MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('id-canvas');
    let context = canvas.getContext('2d');
    let pad = function(imageSource) {
        let image = new Image();
        image.isReady = false;
        image.onload = function() {
            this.isReady = true;
        };
        image.src = imageSource;
        return image;
    }('assets/landingpad.jpg');

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
        context.moveTo(0, canvas.height);
        for (let i = 0; i < spec.points.length; i++){
            context.lineTo(spec.points[i].x, spec.points[i].y);
        }
        context.lineTo(canvas.width, canvas.height);
        context.closePath();

        context.strokeStyle = 'rgb(0, 0, 0)';
        context.fillStyle = 'rgb(0, 0, 0)';
        context.stroke();
        context.fill();

        for (let i = 0; i < spec.landingZones.length; i++){
            context.drawImage(
                pad,
                spec.landingZones[i].pt1.x,
                spec.landingZones[i].pt1.y,
                spec.landingZones[i].width,
                canvas.height / 40)
        }
    }

    function drawText(spec) {
        let output;
        if(spec.units === ""){
            output = spec.text;
        }
        else{
            output = spec.text + spec.value.toFixed(2) + spec.units;
        }
        context.save();

        context.font = spec.font;
        context.fillStyle = spec.fillStyle;
        context.strokeStyle = spec.strokeStyle;
        context.textBaseline = 'top';

        context.fillText(output, spec.position.x, spec.position.y);
        context.strokeText(output, spec.position.x, spec.position.y);

        context.restore();
    }

    let api = {
        get canvas() { return canvas; },
        clear: clear,
        drawTexture: drawTexture,
        drawTerrain: drawTerrain,
        drawText: drawText
    };

    return api;
}());