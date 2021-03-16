//make a line with endpoints a and b
// select the mid point of the line
// compute elevation y at point y = 1/2(ay + by) + r
// r is random distributed number r = sr|bx-ax|
MyGame.render.Terrain = (function(graphics) {
    'use strict';

    function render(spec) {
        graphics.drawTerrain(spec);
    }

    return {
        render: render
    };
}(MyGame.graphics));