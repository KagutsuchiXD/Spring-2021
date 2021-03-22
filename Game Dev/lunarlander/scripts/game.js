MyGame.game = (function(screens){
    'use strict';
    MyGame.sounds.thruster = new Audio("assets/sounds/thrusters.mp3");
    MyGame.sounds.explosion = new Audio("assets/sounds/explosion.mp3");
    MyGame.sounds.game = new Audio("assets/sounds/gameplay.mp3");
    MyGame.sounds.menu = new Audio("assets/sounds/spacemenu.mp3");
    MyGame.sounds.complete = new Audio("assets/sounds/win.mp3");

    function showScreen(id) {
        let active = document.getElementsByClassName('active');
        for (let screen = 0; screen < active.length; screen++) {
            active[screen].classList.remove('active');
        }

        screens[id].run();

        document.getElementById(id).classList.add('active');
    }

    function initialize() {
        let screen = null;

        for (screen in screens) {
            if (screens.hasOwnProperty(screen)) {
                screens[screen].initialize();
            }
        }

        showScreen('main-menu');
    }

    return {
        initialize : initialize,
        showScreen : showScreen
    };
}(MyGame.screens));