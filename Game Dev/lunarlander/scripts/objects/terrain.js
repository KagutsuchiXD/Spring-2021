MyGame.objects.Terrain = function(zones, canvas){
    'use strict';
    let zoneWidth = canvas.width * 0.15;
    let zoneHeight = canvas.height / 10;
    let landing = {
        xValues: [],
        yValues: []
    };
    let points = [];
    let landingZones = [];
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
        let platFormWidth = zoneWidth;
        if (zones === 1){
            platFormWidth = zoneWidth / 2;
        }
        let x1 = Math.floor(Math.random() * (canvas.width - (2 * platFormWidth))) + platFormWidth;
        let y1 = Math.floor(Math.random() * ((canvas.height - zoneHeight) - (canvas.height / 2))) + (canvas.height / 2);
        let x2 = x1 + platFormWidth;
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
        let dist = end.x - start.x;
        if (dist > 10){
            dist = 10;
        }
        let x = (start.x + end.x) / 2;
        let rg = Random.nextGaussian(0, Math.sqrt(1));
        let s = Math.random() * (dist / 5) - 1;
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
        if ((end.x - start.x) <= 2){
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
        let zone = {
            pt1: landingPointA,
            pt2: landingPointB,
            width: landingPointB.x - landingPointA.x
        };
        landingZones.push(zone);
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
        let zone1 = {
            pt1: landingPoint1A,
            pt2: landingPoint1B,
            width: landingPoint1B.x - landingPoint1A.x
        };
        landingZones.push(zone1);
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
        let zone2 = {
            pt1: landingPoint2A,
            pt2: landingPoint2B,
            width: landingPoint2B.x - landingPoint2A.x
        };
        landingZones.push(zone2);
        if (landingPoint1A.x < landingPoint2A.x){
            generateRMDPoints(a, landingPoint1A);
            generateRMDPoints(landingPoint1B, landingPoint2A);
            generateRMDPoints(landingPoint2B, b);
        }
        else{
            generateRMDPoints(a, landingPoint2A);
            generateRMDPoints(landingPoint2B, landingPoint1A);
            generateRMDPoints(landingPoint1B, b);
        }
    }

    let terrain = {
        points: points,
        landingZones: landingZones
    }

    return terrain;
}