
MyGame.main = (function(graphics){
    let clipPolygon = [{
        x: 400,
        y: 0
    }, {
        x: 300,
        y: 400
    }, {
        x: 500,
        y: 400
    }];
    let clipRotation = 0.5;
    let clipUpdateDirection = 1; 
    let myBigBox = graphics.Rectangle({
        x: 0, y: 0, width: 800, height: 800,
        fill: 'rgba(140, 140, 140, 1)',
        stroke: 'rgba(140, 140, 140, 1)',
        rotation: 0
    });
    let mySmallBox = graphics.Rectangle({
        x: 200, y: 150, width: 400, height: 200,
        fill: 'rgba(0, 0, 255, 1)',
        stroke: 'rgba(255, 0, 0, 1)',
        rotation: 0
    });

    //------------------------------------------------------------------
    //
    // Rotate 'pt' about 'center' by 'angle'.  Returns a new point, does
    // not modify 'pt'.
    //
    //------------------------------------------------------------------
    function rotatePointAboutPoint(center, pt, angle) {
        let sin = Math.sin(angle);
        let cos = Math.cos(angle);
        let pTranslate = {
            x: pt.x - center.x,
            y: pt.y - center.y
        }

        let x = pTranslate.x * cos - pTranslate.y * sin;
        let y = pTranslate.x * sin + pTranslate.y * cos;

        return {
            x: x + center.x,
            y: y + center.y
        };
    }

    //------------------------------------------------------------------
    //
    // Move the clipping region back and forth
    //
    //------------------------------------------------------------------
    function updateClipPolygon() {
        clipRotation += 0.01;
        if (clipRotation >= 1) {
            clipUpdateDirection *= -1;
            clipRotation = 0;
        }
        clipPolygon[1] = rotatePointAboutPoint(clipPolygon[0], clipPolygon[1], 0.01 * clipUpdateDirection);
        clipPolygon[2] = rotatePointAboutPoint(clipPolygon[0], clipPolygon[2], 0.01 * clipUpdateDirection);
    }
    
    function update() {
        updateClipPolygon();
    }
    
    function render() {
        graphics.clear();
        graphics.enableClippingRegion(clipPolygon);
        myBigBox.draw();
        mySmallBox.draw();
        graphics.disableClippingRegion();
    }

    //------------------------------------------------------------------
    //
    // This is the Game Loop function!
    //
    //------------------------------------------------------------------
    function gameLoop(time) {

        update();
        render();

        requestAnimationFrame(gameLoop);
    }

    console.log('game initializing...');
    requestAnimationFrame(gameLoop); 

}(MyGame.graphics));

