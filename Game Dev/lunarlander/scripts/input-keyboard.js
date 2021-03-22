MyGame.input.Keyboard = function () {
    let that = {
        keys: {},
        handlers: {}
    };

    function keyPress(e) {
        that.keys[e.key] = e.timeStamp;
        if(e.key === controls["up"] && !MyGame.screens['game-play'].cancelNextRequest){
            MyGame.sounds.thruster.play();
        }
    }

    function keyRelease(e) {
        delete that.keys[e.key];
        if(e.key === controls["up"]){
            MyGame.sounds.thruster.pause();
        }
    }

    that.update = function (elapsedTime, spec) {
        for (let key in that.keys) {
            if (that.keys.hasOwnProperty(key)) {
                if (that.handlers[key]) {
                    that.handlers[key](elapsedTime, spec);
                }
            }
        }
    };

    that.register = function (key, handler) {
        that.handlers[key] = handler;
    };

    window.addEventListener('keydown', keyPress);
    window.addEventListener('keyup', keyRelease);

    return that;
};