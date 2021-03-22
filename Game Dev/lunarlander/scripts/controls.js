MyGame.screens['controls'] = (function(game) {
    'use strict';

    let storageControls;

    function newKeyText(string){
        let keyText = string;
        if(keyText === " "){
            keyText = "Space";
        }
        else if(keyText === "ArrowUp"){
            keyText = "&uarr;";
        }
        else if(keyText === "ArrowLeft"){
            keyText = "&larr;";
        }
        else if(keyText === "ArrowRight"){
            keyText = "&rarr;";
        }
        else if(keyText === "ArrowDown"){
            keyText = "&darr;";
        }
        return keyText;
    }

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
        document.getElementById("id-thrust").innerHTML = newKeyText(controls["up"]) + " : Thrust";
        document.getElementById("id-left-rotate").innerHTML = newKeyText(controls["left"]) + " : Rotate Left";
        document.getElementById("id-right-rotate").innerHTML = newKeyText(controls["right"]) + " : Rotate Right";

        function changeUpControl(e){
            controls["up"] = e.key;
            let keyText = newKeyText(controls["up"]);
            document.getElementById("id-thrust").innerHTML = keyText + " : Thrust";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeUpControl);
        }

        function changeLeftControl(e){
            controls["left"] = e.key;
            let keyText = newKeyText(controls["left"]);
            document.getElementById("id-left-rotate").innerHTML = keyText + " : Rotate Left";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeLeftControl);
        }

        function changeRightControl(e){
            controls["right"] = e.key;
            let keyText = newKeyText(controls["right"]);
            document.getElementById("id-right-rotate").innerHTML = keyText + " : Rotate Right";
            localStorage['controls'] = JSON.stringify(controls);
            window.removeEventListener('keydown', changeRightControl);
        }

        document.getElementById('id-controls-back').addEventListener(
            'click',
            function() { game.showScreen('main-menu'); });

        document.getElementById('id-thrust').addEventListener(
            'click',
            function() {
                document.getElementById("id-thrust").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeUpControl); });

        document.getElementById('id-left-rotate').addEventListener(
            'click',
            function() {
                document.getElementById("id-left-rotate").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeLeftControl); });

        document.getElementById('id-right-rotate').addEventListener(
            'click',
            function() {
                document.getElementById("id-right-rotate").innerHTML = "Awaiting Input";
                window.addEventListener('keydown', changeRightControl); });
    }

    function run() {
        MyGame.sounds.menu.play();
    }

    return {
        initialize : initialize,
        run : run
    };
}(MyGame.game));
