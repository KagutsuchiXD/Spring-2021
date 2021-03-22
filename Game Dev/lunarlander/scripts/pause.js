MyGame.screens['pause'] = (function(game,screens) {
    'use strict';

    function initialize() {
        document.getElementById('id-continue').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });

        document.getElementById('id-quit').addEventListener(
            'click',
            function() {
                game.showScreen('main-menu'); });
    }

    function run() {
        MyGame.sounds.game.pause();
        MyGame.sounds.menu.play();
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game,MyGame.screens));