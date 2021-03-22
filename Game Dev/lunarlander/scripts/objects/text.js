MyGame.objects.Text = function(spec) {
    'use strict';

    function updateValue(number) {
        spec.value = number;
    }

    let api = {
        updateValue: updateValue,
        get position() { return spec.position; },
        get text() { return spec.text; },
        get value() { return spec.value; },
        get units() { return spec.units; },
        get font() { return spec.font; },
        get fillStyle() { return spec.fillStyle; },
        get strokeStyle() { return spec.strokeStyle; },
        set strokeStyle(style) {spec.strokeStyle = style;},
        set text(string) {spec.text = string;},
        set font(string) {spec.font = string;}
    };

    return api;
}
