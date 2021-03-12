// ------------------------------------------------------------------
// 
// This is the graphics object.  The various rendering components
// are located here.
//
// ------------------------------------------------------------------
MyGame.graphics = (function() {
    'use strict';

    let canvas = document.getElementById('canvas-main');
    let context = canvas.getContext('2d');

    //------------------------------------------------------------------
    //
    // Public function that allows the client code to clear the canvas.
    //
    //------------------------------------------------------------------
    function clear() {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.restore();
    }

    function Circle(spec) {
        let that = {};

        that.draw = function() {
            context.beginPath();
            context.arc(spec.center.x, spec.center.y, spec.radius, 0, 2 * Math.PI);
            context.closePath();

            context.fillStyle = spec.fill;
            context.fill();
            context.strokeStyle = spec.stroke;
            context.stroke();
        };

        return that;
    }

    return {
        clear : clear,
        Circle: Circle
    };
}());
