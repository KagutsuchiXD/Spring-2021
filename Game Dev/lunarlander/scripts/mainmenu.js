MyGame.screens['main-menu'] = (function(game, screens) {
    'use strict';

    function initialize() {
        document.getElementById('id-new-game').addEventListener(
            'click',
            function() {
                screens['game-play'].newGame();
                game.showScreen('game-play');});

        document.getElementById('id-high-scores').addEventListener(
            'click',
            function() { game.showScreen('high-scores'); });

        document.getElementById('id-controls').addEventListener(
            'click',
            function() { game.showScreen('controls'); });

        document.getElementById('id-about').addEventListener(
            'click',
            function() { game.showScreen('about'); });
    }

    function run() {
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens));