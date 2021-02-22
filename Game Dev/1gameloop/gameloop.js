var events = [];
var prevTime = performance.now()
let output = document.getElementById("output");

window.requestAnimationFrame(gameLoop);


function gameLoop(){
    elapsedTime = performance.now() - prevTime;
    prevTime = performance.now();
    update(elapsedTime);
    render();

    window.requestAnimationFrame(gameLoop);
}

function update(elapsedTime){
    for(let i = 0; i < events.length; i++){
        if(events[i].times === 0){
            events.splice(i,1);
        }
        else{
            events[i].timeSinceRendered += elapsedTime;
            console.log(events[i].timeSinceRendered, events[i].iterator)
            if(events[i].timeSinceRendered >= events[i].iterator){
                events[i].needToRender = true;
                events[i].times -= 1;
                events[i].timeSinceRendered = 0;
            }
        }
    }
}

function render(){
    for(let i = 0; i < events.length; i++){
        if(events[i].needToRender === true){
            events[i].needToRender = false;
            let para = document.createElement("p");
            let node = document.createTextNode("Event: "+ events[i].name + " (" + (events[i].times+1) + " remaining)");
            para.appendChild(node);
            output.appendChild(para);
            output.scrollTop = output.scrollHeight;
        }
    }
}

function addNewEventElement(){
    let newEvent = {
        name: document.getElementById("name").value,
        iterator: Number(document.getElementById("interval").value),
        times: Number(document.getElementById("times").value),
        timeSinceRendered: 0,
        needToRender: false
    };

    events.push(newEvent);
}