MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let level = 2;
    let myTerrain = objects.Terrain(level, graphics.canvas);

    let myLander = objects.Lander({
        imageSrc: 'assets/Lander.png',
        center: { x: graphics.canvas.width / 2, y: 100 },
        size: { width: graphics.canvas.width / 10, height: graphics.canvas.height / 10 },
        rotation : 0,
        moveRate: 500 / 1000, // pixels per millisecond
        rotateRate : 3.14159  // Radians per second
    });

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
    }

    function render() {
        graphics.clear();

        renderer.Lander.render(myLander);
        renderer.Terrain.render(myTerrain);
        //renderer.Text.render(myText);
    }

    function gameLoop(time) {
        let elapsedTime = time - lastTimeStamp;
        lastTimeStamp = time;

        processInput(elapsedTime);
        update();
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        myKeyboard.register('w', myLander.thrust);
        myKeyboard.register('a', myLander.rotateLeft);
        myKeyboard.register('d', myLander.rotateRight);
        myKeyboard.register('Escape', function() {
            //
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            //
            // Then, return to the main menu
            game.showScreen('main-menu');
        });
    }

    function run() {
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));