MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();
    let level = 1;
    let myTerrain = objects.Terrain(level, graphics.canvas);

    let myLander = objects.Lander({
        thrust : 0.1,
        rotateRate : 3.14159 / 2,  // Radians per second
        center: { x: graphics.canvas.width / 2, y: 100 },
        radius: graphics.canvas.width / 30,
        rotation : -1.5708,
        velocity: {vx: 0, vy: 0},
        fuel: 20.0,
        imageSrc: 'assets/lander.png',
        size: { width: graphics.canvas.width / 15, height: graphics.canvas.height / 15 }
    });

    let speedometer = objects.Text({
        text: 'Speed: ',
        value: 0,
        units: ' m/s',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 0, 0, 1)',
        position: { x: 50, y: 50 }
    });

    let fuelGage = objects.Text({
        text: 'Fuel: ',
        value: 0,
        units: ' s',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 0, 0, 1)',
        position: { x: 50, y: 82 }
    });

    let tiltAngle = objects.Text({
        text: 'Angle: ',
        value: 0,
        units: ' degrees',
        font: '32pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 0, 0, 1)',
        position: { x: 50, y: 112 }
    });

    function lineCircleIntersection(pt1, pt2, circle) {
        let v1 = { x: pt2.x - pt1.x, y: pt2.y - pt1.y };
        let v2 = { x: pt1.x - circle.center.x, y: pt1.y - circle.center.y };
        let b = -2 * (v1.x * v2.x + v1.y * v2.y);
        let c =  2 * (v1.x * v1.x + v1.y * v1.y);
        let d = Math.sqrt(b * b - 2 * c * (v2.x * v2.x + v2.y * v2.y - circle.radius * circle.radius));
        if (isNaN(d)) { // no intercept
            return false;
        }
        // These represent the unit distance of point one and two on the line
        let u1 = (b - d) / c;
        let u2 = (b + d) / c;
        if (u1 <= 1 && u1 >= 0) {  // If point on the line segment
            return true;
        }
        if (u2 <= 1 && u2 >= 0) {  // If point on the line segment
            return true;
        }
        return false;
    }

    function landingDetection(){
        let landerPerimeter = {
            center: myLander.center,
            radius: myLander.radius
        }
        let detected = false;
        for (let i = 1; i < myTerrain.points.length; i++){
            detected = lineCircleIntersection(myTerrain.points[i-1], myTerrain.points[i], landerPerimeter);
            if (detected){
                myLander.updateState(detected);
                break;
            }
        }
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function update(elapsedTime) {
        myLander.updatePosition(elapsedTime);
        landingDetection();
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
        update(elapsedTime);
        render();

        if (!cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function initialize() {
        myKeyboard.register(controls["up"], myLander.thrust);
        myKeyboard.register(controls["left"], myLander.rotateLeft);
        myKeyboard.register(controls["right"], myLander.rotateRight);
        myKeyboard.register('Escape', function() {
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            // Then, return to the main menu
            game.showScreen('main-menu');
        });
    }

    function run() {
        initialize();
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input));