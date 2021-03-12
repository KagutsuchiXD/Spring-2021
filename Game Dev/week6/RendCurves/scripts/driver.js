
MyGame.main = (function(graphics){

    let curve1 = graphics.CurveQuadratic({
        start: { x: 100, y: 100},
        control: { x: 200, y: 200 },
        end: { x: 300, y: 100 },
        stroke: 'rgb(255, 0, 0)'
    });

    function update() {
        if (curve1.control.y > 0) {
            curve1.control.y -= 1;
        }
    }
    
    function render() {
        graphics.clear();

        curve1.draw();
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

