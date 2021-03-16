MyGame.objects.Terrain = function(zones, canvas){
    'use strict';
    let zoneWidth = canvas.width / 10;
    let zoneHeight = canvas.height / 10;
    let landing = {
        xValues: [],
        yValues: []
    };
    let points = [];
    let a = {
        x: 0,
        y: Math.floor(Math.random() * canvas.height)
    }
    points.push(a);
    let b = {
        x: canvas.width,
        y: Math.floor(Math.random() * canvas.height)
    }

    function generateLandingZone1(){
        let x1 = Math.floor(Math.random() * (canvas.width - (2 * zoneWidth))) + zoneWidth;
        let y1 = Math.floor(Math.random() * (canvas.height - zoneHeight)) + zoneHeight;
        let x2 = x1 + zoneWidth;
        let y2 = y1;
        landing.xValues.push(x1);
        landing.xValues.push(x2);
        landing.yValues.push(y1);
        landing.yValues.push(y2);
    }

    function generateLandingZone2(){
        let x1;
        let x2;
        do {
            let x1 = Math.floor(Math.random() * (canvas.width - (2 * zoneWidth))) + zoneWidth;
            let x2 = x1 + zoneWidth;
        }while ((x1 < landing.xValues[0] || x1 > landing.xValues[1]) && (x2 < landing.xValues[0] || x2 > landing.xValues[1]));
        let y1 = Math.floor(Math.random() * (canvas.height - zoneHeight)) + zoneHeight;
        let y2 = y1;
        landing.xValues.push(x1);
        landing.xValues.push(x2);
        landing.yValues.push(y1);
        landing.yValues.push(y2);

    }

    function rmd(start, end){
        let x = (start.x + end.x) / 2;
        let rg = Math.floor(((Math.random() + Math.random() +
            Math.random() + Math.random() + Math.random()) / 5) - 0.5) * 2;
        let r = rg * Math.abs(end.x - start.x);
        let y = 0.5 * (start.y + end.y) + r;

        return {x: x, y: y};
    }
}