let maze = null;
let mazeSize = 5;
let inputBuffer = [];
let startTime = performance.now();
let timer = {
    min: 0,
    sec: 0
};
let score = 0;
let progressBar = document.getElementById("progress");

let highscores = [];

let myCharacter = function(imageSource) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return image;
}('spidey.png');

function calculateScore(cell){
    if(cell.visited === false && cell.path === true){
        score += 10;
    }
    else if(cell.visited === false && cell.path === false){
        score -= 3;
    }
    else if(cell.visited === true && cell.path === false){
        score -= 2;
    }
}

function moveCharacter(key) {
    maze.grid[maze.current[0]][maze.current[1]].visited = true;
    if (key === 'ArrowDown' || key === 's' || key === 'k') {
        if (maze.grid[maze.current[0]][maze.current[1]+1].status === "maze") {
            calculateScore(maze.grid[maze.current[0]][maze.current[1]+1]);
            maze.current[1] += 1;
        }
    }
    if (key === 'ArrowUp' || key === 'w' || key === 'i') {
        if (maze.grid[maze.current[0]][maze.current[1]-1].status === "maze") {
            calculateScore(maze.grid[maze.current[0]][maze.current[1]-1]);
            maze.current[1] -= 1;
        }
    }
    if (key === 'ArrowRight' || key === 'd' || key === 'l') {
        if (maze.grid[maze.current[0]+1][maze.current[1]].status === "maze") {
            calculateScore(maze.grid[maze.current[0]+1][maze.current[1]]);
            maze.current[0] += 1;
        }
    }
    if (key === 'ArrowLeft' || key === 'a' || key === 'j') {
        if (maze.grid[maze.current[0]-1][maze.current[1]].status === "maze") {
            calculateScore(maze.grid[maze.current[0]-1][maze.current[1]]);
            maze.current[0] -= 1;
        }
    }
    if (key === 'h'){
        if (maze.showHint === false){
            maze.showHint = true;
        }
        else{
            maze.showHint = false;
        }
    }
    if (key === 'b'){
        if (maze.breadCrumbs === false){
            maze.breadCrumbs = true;
        }
        else{
            maze.breadCrumbs = false;
        }
    }
    if (key === 'p'){
        if (maze.pathToFinish === false){
            maze.pathToFinish = true;
        }
        else{
            maze.pathToFinish = false;
        }
    }
}

function processInput() {
    moveCharacter(inputBuffer[0])
    inputBuffer = [];
}

function calculateElapsedTime(time){
    timer.min = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    timer.sec = Math.floor((time % (1000 * 60)) / 1000);
}

function renderProgressData(){
    progressBar.innerHTML = "Time: " + timer.min + ":" + timer.sec + "          Score: " + score;
}

function update(elapsedTime){
    calculateElapsedTime(elapsedTime);
    processInput();
}

function render() {
    renderProgressData();
    MazeGen.clear();
    MazeGen.renderMaze(maze);
    MazeGen.renderCharacter(myCharacter, maze.current);
}

function gameLoop() {
    elapsedTime = performance.now() - startTime;
    update(elapsedTime);
    render();

    requestAnimationFrame(gameLoop);
}

function changeSize(){
    let radioCtn = document.getElementById("radio-ctn");
    for (let i = 0; i < radioCtn.children.length; i++){
        if(radioCtn.children[i].checked){
            mazeSize = radioCtn.children[i].value;
        }
    }
}

function newGame(){
    initialize();
}

function initialize() {
    maze = MazeGen.generateMaze(mazeSize,mazeSize);
    window.addEventListener('keydown', function(event) {
        inputBuffer.push(event.key);
    });

    requestAnimationFrame(gameLoop);
}