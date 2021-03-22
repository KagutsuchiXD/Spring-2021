MyGame.screens['high-scores'] = (function(game) {
    'use strict';

    let highscores;
    let scoreList = document.getElementById("scores");

    function initialize() {
        if(localStorage.getItem('scores') == null){
            localStorage['scores'] = JSON.stringify(scores);
        }
        else{
            highscores = localStorage.getItem('scores');
            scores = JSON.parse(highscores);
        }

        for (let score in scores){
            if(scores.hasOwnProperty(score)){
                let scoreP = document.createElement("p");
                let scoreInfo = document.createTextNode(parseInt(scores[score]).toString());
                scoreP.appendChild(scoreInfo);
                scoreList.appendChild(scoreP);
            }
        }
        document.getElementById('id-high-scores-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });
    }

    function run() {
        MyGame.sounds.menu.play();
        scoreList.innerHTML = "";
        initialize();
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));