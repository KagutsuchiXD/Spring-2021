MyGame.screens['pause'] = (function(game,screens) {
    'use strict';

    function initialize() {
        document.getElementById('id-continue').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });

        document.getElementById('id-quit').addEventListener(
            'click',
            function() {
                if(screens['game-play'].score > 0){
                    screens['game-play'].calculateScore();
                }
                game.showScreen('main-menu'); });
    }

    function run() {
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game,MyGame.screens));