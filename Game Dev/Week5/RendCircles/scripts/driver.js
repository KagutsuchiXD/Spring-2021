
MyGame.main = (function(graphics){

    let circle1 = graphics.Circle({
        center: {
            x: 200,
            y: 200,
        },
        radius: 50,
        fill: 'rgb(0, 0, 255)',
        stroke: 'rgb(255, 0, 0)'
    });

    function update() {
    }
    
    function render() {
        graphics.clear();

        circle1.draw();
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

