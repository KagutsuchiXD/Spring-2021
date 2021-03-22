MyGame.screens['game-play'] = (function(game, objects, renderer, graphics, input, systems) {
    'use strict';

    let lastTimeStamp = performance.now();
    let cancelNextRequest = true;

    let myKeyboard = input.Keyboard();

    let resultTimer = 5;
    let level = 2;
    let score = 0;
    let particleSystem = systems.ParticleSystem({
        center: {x: graphics.canvas.width / 2, y: 100 },
        size: { mean: 10, stdev: 4 },
        speed: { mean: 50, stdev: 25 },
        lifetime: { mean: 1, stdev: 1 }
    });

    let renderParticles = renderer.ParticleSystem(particleSystem, graphics, 'assets/fire.png');

    let myTerrain = objects.Terrain(level, graphics.canvas);

    let myLander = objects.Lander({
        thrust : 0.07,
        rotateRate : 3.14159 / 2,  // Radians per second
        center: { x: graphics.canvas.width / 2, y: 100 },
        radius: graphics.canvas.width / 50,
        rotation : -1.5708,
        velocity: {vx: 0, vy: 0},
        fuel: 20.0,
        imageSrc: 'assets/lander.png',
        size: { width: graphics.canvas.width / 25, height: graphics.canvas.height / 25 }
    }, particleSystem);

    let speedometer = objects.Text({
        text: 'Speed: ',
        value: 0.0,
        units: ' m/s',
        font: '20pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(40, 224, 89, 1)',
        position: { x: 25, y: 50 }
    });

    let fuelGage = objects.Text({
        text: 'Fuel: ',
        value: 20.0,
        units: ' s',
        font: '20pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(40, 224, 89, 1)',
        position: { x: 25, y: 75 }
    });

    let tiltAngle = objects.Text({
        text: 'Angle: ',
        value: 0.0,
        units: ' degrees',
        font: '20pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(40, 224, 89, 1)',
        position: { x: 25, y: 100 }
    });

    let result = objects.Text({
        text: "YOU DIED",
        value: 0.0,
        units: "",
        font: '100pt Arial',
        fillStyle: 'rgba(255, 255, 255, 1)',
        strokeStyle: 'rgba(255, 0, 0, 1)',
        position: { x: graphics.canvas.width / 5, y: graphics.canvas.height / 3 }
    })

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
                let survived = checkSurvival(myTerrain.points[i-1], myTerrain.points[i]);
                if(survived){
                    console.log("You Survived");
                    MyGame.sounds.complete.currentTime = 0;
                    MyGame.sounds.complete.play();
                }
                else{
                    console.log("You Died");
                    particleSystem.shipCrash();
                    MyGame.sounds.explosion.currentTime = 0;
                    MyGame.sounds.explosion.play();
                }
                myLander.updateState(detected, survived);
                break;
            }
        }
    }

    function checkSurvival(pt1, pt2){
        let angle = (myLander.rotation + 1.5708) * (180 / Math.PI);
        return (pt1.landing === true && pt2.landing === true && myLander.speed <= 2 && angle < 5 && angle > -5);
    }

    function calculateScore(){
        if (myLander.alive && myLander.landed){
            score += (myLander.fuel * 1000) / level;
        }
    }

    function saveScore(){
        if (score > 0){
            let swap = false;
            for(let i = 5; i > 0; i--){
                if(scores.hasOwnProperty(i.toString())){
                    if(score > parseInt(scores[i.toString()])){
                        if(!swap){
                            scores[i.toString()] = score.toString();
                            swap = true;
                        }
                        else{
                            let temp = parseInt(scores[i.toString()]);
                            scores[(i+1).toString()] = temp.toString();
                            scores[i.toString()] = score.toString();
                        }
                    }
                }
            }
            localStorage['scores'] = JSON.stringify(scores);
        }
    }

    function processInput(elapsedTime) {
        myKeyboard.update(elapsedTime);
    }

    function updateLanderStatus(){
        fuelGage.updateValue(myLander.fuel);
        speedometer.updateValue(myLander.speed);
        tiltAngle.updateValue((myLander.rotation + 1.5708) * (180 / Math.PI));
        particleSystem.center = myLander.center;

        if(fuelGage.value <= 0){
            fuelGage.strokeStyle = 'rgba(255, 0, 0, 1)';
        }
        else{
            fuelGage.strokeStyle = 'rgba(40, 224, 89, 1)';
        }
        if(speedometer.value >= 2){
            speedometer.strokeStyle = 'rgba(255, 0, 0, 1)';
        }
        else{
            speedometer.strokeStyle = 'rgba(40, 224, 89, 1)';
        }
        if(tiltAngle.value > 5 || tiltAngle.value < -5){
            tiltAngle.strokeStyle = 'rgba(255, 0, 0, 1)';
        }
        else{
            tiltAngle.strokeStyle = 'rgba(40, 224, 89, 1)';
        }
        landingDetection();
    }

    function update(elapsedTime) {
        particleSystem.update(elapsedTime);
        if(!myLander.landed){
            myLander.updatePosition(elapsedTime);
            updateLanderStatus();
        }
        else if(level > 1 && myLander.alive){
            calculateScore();
            cancelNextRequest = true;
            game.showScreen('transition');
        }
        else if(myLander.alive && resultTimer > 0){
            result.text = "LANDING COMPLETE";
            result.font = '50pt Arial';
            resultTimer -= (elapsedTime / 1000);
        }
        else if(resultTimer > 0){
            resultTimer -= (elapsedTime / 1000);
            if(resultTimer > 2){
                particleSystem.shipCrash();
            }
        }
        else{
            calculateScore();
            cancelNextRequest = true;
            game.showScreen('main-menu');
        }
    }

    function render() {
        graphics.clear();

        renderer.Terrain.render(myTerrain);
        renderer.Text.render(speedometer);
        renderer.Text.render(fuelGage);
        renderer.Text.render(tiltAngle);
        if(!myLander.alive){
            renderer.Text.render(result);
            renderer.Lander.render(myLander);
            renderParticles.render();
        }
        else{
            if(myLander.landed){
                renderer.Text.render(result);
            }
            renderParticles.render();
            renderer.Lander.render(myLander);
        }
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

    function newGame(){
        level = 2;
        score = 0;
        resetScreen();
    }

    function nextLevel(){
        level -= 1;
        resetScreen();
    }

    function resetScreen(){
        resultTimer = 3;
        result.text = "YOU DIED";
        result.font = '100pt Arial';
        myTerrain = objects.Terrain(level, graphics.canvas);

        myLander = objects.Lander({
            thrust : 0.07,
            rotateRate : 3.14159 / 2,  // Radians per second
            center: { x: graphics.canvas.width - 100, y: 100 },
            radius: graphics.canvas.width / 50,
            rotation : -2.35619,
            velocity: {vx: 0, vy: 0},
            fuel: 20.0,
            imageSrc: 'assets/lander.png',
            size: { width: graphics.canvas.width / 25, height: graphics.canvas.height / 25 }
        });

        speedometer = objects.Text({
            text: 'Speed: ',
            value: 0,
            units: ' m/s',
            font: '20pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(40, 224, 89, 1)',
            position: { x: 25, y: 50 }
        });

        fuelGage = objects.Text({
            text: 'Fuel: ',
            value: 20.0,
            units: ' s',
            font: '20pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(40, 224, 89, 1)',
            position: { x: 25, y: 75 }
        });

        tiltAngle = objects.Text({
            text: 'Angle: ',
            value: 0,
            units: ' degrees',
            font: '20pt Arial',
            fillStyle: 'rgba(255, 255, 255, 1)',
            strokeStyle: 'rgba(40, 224, 89, 1)',
            position: { x: 25, y: 95 }
        });
    }

    function fireThrusters(elapsedTime){
        if(myLander.fuel > 0){
            myLander.thrust(elapsedTime);
            particleSystem.shipThrust(myLander.rotation);
        }
    }

    function initialize() {
        myKeyboard.register(controls["up"], fireThrusters);
        myKeyboard.register(controls["left"], myLander.rotateLeft);
        myKeyboard.register(controls["right"], myLander.rotateRight);
        myKeyboard.register('Escape', function() {
            // Stop the game loop by canceling the request for the next animation frame
            cancelNextRequest = true;
            game.showScreen('pause');
        });
    }

    function run() {
        initialize();
        MyGame.sounds.menu.pause();
        MyGame.sounds.game.play();
        lastTimeStamp = performance.now();
        cancelNextRequest = false;
        requestAnimationFrame(gameLoop);
    }

    return {
        initialize : initialize,
        run : run,
        newGame: newGame,
        nextLevel: nextLevel,
        saveScore: saveScore,
        get score(){return score;},
        get cancelNextRequest(){return cancelNextRequest;}
    };

}(MyGame.game, MyGame.objects, MyGame.render, MyGame.graphics, MyGame.input, MyGame.systems));