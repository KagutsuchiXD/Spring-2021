let Random = (function() {
    'use strict';

    function nextDouble() {
        return Math.random();
    }

    function nextRange(min, max) {
        let range = max - min;
        return Math.floor((Math.random() * range) + min);
    }

    function nextCircleVector() {
        let angle = Math.random() * 2 * Math.PI;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }

    function nextArcVector(rotation) {
        let direction = rotation + Math.PI;
        let max = direction + 0.4;
        let min = direction - 0.4;
        let angle = Math.random() * (max - min) + min;
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    }
    // This is used to give a small performance optimization in generating gaussian random numbers.
    let usePrevious = false;
    let y2;

    // Generate a normally distributed random number.
    function nextGaussian(mean, stdDev) {
        let x1 = 0;
        let x2 = 0;
        let y1 = 0;
        let z = 0;

        if (usePrevious) {
            usePrevious = false;
            return mean + y2 * stdDev;
        }

        usePrevious = true;

        do {
            x1 = 2 * Math.random() - 1;
            x2 = 2 * Math.random() - 1;
            z = (x1 * x1) + (x2 * x2);
        } while (z >= 1);

        z = Math.sqrt((-2 * Math.log(z)) / z);
        y1 = x1 * z;
        y2 = x2 * z;

        return mean + y1 * stdDev;
    }

    return {
        nextDouble : nextDouble,
        nextRange : nextRange,
        nextArcVector: nextArcVector,
        nextCircleVector : nextCircleVector,
        nextGaussian : nextGaussian
    };

}());
