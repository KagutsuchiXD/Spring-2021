var canvas = document.getElementById('canvas'),
    ctx = canvas.getContext('2d'),
    w = window.innerWidth,
    h = window.innerHeight;
canvas.width = w;
canvas.height = h;
window.onresize = function(){
    canvas.width = w = window.innerWidth;
    canvas.height = h = window.innerHeight;
}

var spaceship = {
    x: w / 2, y: h / 2,
    vx: 0, vy: 0,
    ax: 0, ay: 0,
    r: 0,
    draw: function(){
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.r);
        ctx.fillStyle = 'white';
        ctx.fillRect(-10, -5, 20, 10);
        ctx.restore();
    }
};

var friction = 0.97;

function updatePosition(obj){
    //update velocity
    obj.vx += obj.ax;
    obj.vy += obj.ay;

    applyFriction(obj);

    //update position
    obj.x += obj.vx;
    obj.y += obj.vy;
}

//user interactivity

var keys = [];
document.addEventListener('keydown', function(e){
    keys[e.which] = true;
});
document.addEventListener('keyup', function(e){
    keys[e.which] = false;
});

function applyFriction(obj){
    obj.vx *= friction;
    obj.vy *= friction;
}

(function animloop(){
    requestAnimationFrame(animloop, canvas);
    ctx.clearRect(0, 0, w, h);

    //rotation
    if(keys[37]) spaceship.r -= 0.05;
    if(keys[39]) spaceship.r += 0.05;

    //thrust
    if(keys[38]){
        spaceship.ax = Math.cos(spaceship.r) * 0.05;
        spaceship.ay = Math.sin(spaceship.r) * 0.05;
    }else{
        spaceship.ax = spaceship.ay = 0;
    }

    //friction is applied inside the updatePosition function
    updatePosition(spaceship);
    spaceship.draw();
})();