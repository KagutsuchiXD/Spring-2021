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
        y: Math.floor(Math.random() * (canvas.height - (canvas.height / 2))) + (canvas.height / 2),
        landing: false
    }
    let b = {
        x: canvas.width,
        y: Math.floor(Math.random() * (canvas.height - (canvas.height / 2))) + (canvas.height / 2),
        landing: false
    }

    function generateLandingZone1(){
        let x1 = Math.floor(Math.random() * (canvas.width - (2 * zoneWidth))) + zoneWidth;
        let y1 = Math.floor(Math.random() * ((canvas.height - zoneHeight) - (canvas.height / 2))) + (canvas.height / 2);
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
            x1 = Math.floor(Math.random() * (canvas.width - (2 * zoneWidth))) + zoneWidth;
            x2 = x1 + zoneWidth;
        }while ((x1 >= landing.xValues[0] && x1 <= landing.xValues[1]) || (x2 >= landing.xValues[0] && x2 <= landing.xValues[1]));
        let y1 = Math.floor(Math.random() * ((canvas.height - zoneHeight) - (canvas.height / 2))) + (canvas.height / 2);
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
        let s = Math.random() * (2) - 1;
        let r = s * rg * Math.abs(end.x - start.x);
        let y = 0.5 * (start.y + end.y) + r;

        if(y <= zoneHeight * 2){
            y = Math.floor(Math.random() * ((zoneHeight * 2) - (canvas.height / 2)) + (canvas.height / 2));
        }
        if(y > canvas.height){
            y = Math.floor(Math.random() * (canvas.height - (canvas.height - zoneHeight)) + (canvas.height - zoneHeight));
        }

        return {
            x: x,
            y: y,
            landing: false
        };
    }

    function generateRMDPoints(start, end){
        if ((end.x - start.x) <= 15){
            points.push(start);
            points.push(end);
            return;
        }
        let mid = rmd(start, end);
        generateRMDPoints(start, mid);
        generateRMDPoints(mid, end);
    }

    if (zones === 1){
        generateLandingZone1();
        let landingPointA = {
            x: landing.xValues[0],
            y: landing.yValues[0],
            landing: true
        }
        let landingPointB = {
            x: landing.xValues[1],
            y: landing.yValues[1],
            landing: true
        }
        generateRMDPoints(a, landingPointA);
        generateRMDPoints(landingPointB, b);
    }
    else if (zones === 2){
        generateLandingZone1();
        generateLandingZone2();
        let landingPoint1A = {
            x: landing.xValues[0],
            y: landing.yValues[0],
            landing: true
        }
        let landingPoint1B = {
            x: landing.xValues[1],
            y: landing.yValues[1],
            landing: true
        }
        let landingPoint2A = {
            x: landing.xValues[2],
            y: landing.yValues[2],
            landing: true
        }
        let landingPoint2B = {
            x: landing.xValues[3],
            y: landing.yValues[3],
            landing: true
        }
        if (landingPoint1A.x < landingPoint2A.x){
            console.log("1A:" + landingPoint1A.x + " 2A:" + landingPoint2A.x);
            generateRMDPoints(a, landingPoint1A);
            generateRMDPoints(landingPoint1B, landingPoint2A);
            generateRMDPoints(landingPoint2B, b);
        }
        else{
            console.log("1A:" + landingPoint1A.x + " 2A:" + landingPoint2A.x);
            generateRMDPoints(a, landingPoint2A);
            generateRMDPoints(landingPoint2B, landingPoint1A);
            generateRMDPoints(landingPoint1B, b);
        }
    }

    return points;
}