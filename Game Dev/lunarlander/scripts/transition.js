MyGame.screens['transition'] = (function(game, screens) {
    'use strict';
    let stop = false;

    function initialize() {
        document.getElementById('id-transition-quit').addEventListener(
            'click',
            function() {
                stop = true;
                if(screens['game-play'].score > 0){
                    screens['game-play'].calculateScore();
                }
                game.showScreen('main-menu'); });
    }

    function run() {
        stop = false;
        initialize();
        let timeLeft = 3;
        let timer = setInterval(function(){
            if(timeLeft === 0){
                if(!stop){
                    clearInterval(timer);
                    screens['game-play'].nextLevel();
                    game.showScreen('game-play');
                }
            } else {
                document.getElementById("timer").innerHTML = "<p>Next level begins in " + timeLeft + "</p>";
            }
            timeLeft -= 1;
        }, 1000);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens));