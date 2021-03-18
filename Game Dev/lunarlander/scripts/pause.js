MyGame.screens['pause'] = (function(game, state) {
    'use strict';

    function initialize() {
        document.getElementById('id-continue').addEventListener(
            'click',
            function() { game.showScreen('game-play'); });

        document.getElementById('id-quit').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }

    function run() {
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens['game-play']));