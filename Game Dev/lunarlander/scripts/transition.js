MyGame.screens['transition'] = (function(game, screens) {
    'use strict';
    let stop = false;

    function initialize() {
        document.getElementById('id-transition-quit').addEventListener(
            'click',
            function() {
                stop = true;
                game.showScreen('main-menu'); });
    }

    function run() {
        MyGame.sounds.game.pause();
        MyGame.sounds.menu.play();
        stop = false;
        let timeLeft = 3;
        let timer = setInterval(function(){
            if (!stop){
                if(timeLeft === 0){
                    clearInterval(timer);
                    screens['game-play'].nextLevel();
                    game.showScreen('game-play');
                }
                else {
                    document.getElementById("timer").innerHTML = "<p>Next level begins in " + timeLeft + "</p>";
                }
                timeLeft -= 1;
            }
            else{
                clearInterval(timer);
            }
        }, 1000);
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game, MyGame.screens));