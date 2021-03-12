let Mammal = function(spec){
    let that = {};
    that.name = function(){
        return spec.name;
    }

    that.says = function(){
        return spec.sound || '';
    }

    return that;
};

let Cat = function(spec){
    spec.sound = 'meow';
    let that = Mammal(spec);

    that.purr = function(times){
        let sound = '';
        for (let i = 0; i < times; i++){
            if (sound.length % 2 === 1){
                sound += '-';
            }
            sound += 'r';
        }

        return sound;
    }

    return that;
};

let myCat = Cat({name: 'Catly'});
console.log(myCat.name());
console.log(myCat.says());
console.log(myCat.purr(10));