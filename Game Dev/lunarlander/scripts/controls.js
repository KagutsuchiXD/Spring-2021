MyGame.screens['controls'] = (function(game) {
    'use strict';

    let storageControls;

    function initialize() {
        if(localStorage.getItem('controls') == null){
            controls["up"] = 'ArrowUp';
            controls["left"] = 'ArrowLeft';
            controls["right"] = 'ArrowRight';
            localStorage['controls'] = JSON.stringify(controls);
        }
        else{
            storageControls = localStorage.getItem('controls');
            controls = JSON.parse(storageControls);
        }

        function changeUpControl(e){
            controls["up"] = e.key;
            document.getElementById("id-thrust").innerHTML = controls["up"] + " : Thrust";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeUpControl);
        }

        function changeLeftControl(e){
            controls["left"] = e.key;
            document.getElementById("id-left-rotate").innerHTML = controls["left"] + " : Rotate Left";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeLeftControl);
        }

        function changeRightControl(e){
            controls["right"] = e.key;
            document.getElementById("id-right-rotate").innerHTML = controls["right"] + " : Rotate Right";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeRightControl);
        }

        document.getElementById('id-controls-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

        document.getElementById('id-thrust').addEventListener(
            'click',
            function() { window.addEventListener('keydown', changeUpControl); });

        document.getElementById('id-left-rotate').addEventListener(
            'click',
            function() { window.addEventListener('keydown', changeLeftControl); });

        document.getElementById('id-right-rotate').addEventListener(
            'click',
            function() { window.addEventListener('keydown', changeRightControl); });
    }

    function run() {

    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
