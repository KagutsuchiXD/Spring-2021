MyGame.screens['main-menu'] = (function(game, screens) {
    'use strict';

    function initialize() {
        MyGame.sounds.menu.play();
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
        MyGame.sounds.game.pause();
        MyGame.sounds.explosion.pause();
        MyGame.sounds.menu.play();
        screens['game-play'].saveScore();
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens));