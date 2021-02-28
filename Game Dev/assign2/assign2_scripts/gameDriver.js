let maze = null;
let mazeSize = 5;
let inputBuffer = [];
let gameOver = false;
let startTime = performance.now();
let timer = {
    min: 0,
    sec: 0
};
let score = 0;
let progressBar = document.getElementById("progress");
let scoreBoard = document.getElementById("score-board");
let keyReceived = null;

let highscores = [];

let myCharacter = function(imageSource) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return image;
}('images/spidey.png');

function calculateScore(cell){
    if(cell.visited === false && cell.path === true){
        score += 5;
    }
    else if(cell.visited === false && cell.path === false){
        score -= 3;
    }
    else if(cell.visited === true && cell.path === false){
        score -= 1;
    }
}

function moveCharacter(key) {
    maze.grid[maze.current[0]][maze.current[1]].visited = true;
    if (inputBuffer.includes(key) === false && (key === 'ArrowDown' || key === 's' || key === 'k')) {
        if (maze.grid[maze.current[0]][maze.current[1]+1].status === "maze") {
            calculateScore(maze.grid[maze.current[0]][maze.current[1]+1]);
            maze.current[1] += 1;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'ArrowUp' || key === 'w' || key === 'i')) {
        if (maze.grid[maze.current[0]][maze.current[1]-1].status === "maze") {
            calculateScore(maze.grid[maze.current[0]][maze.current[1]-1]);
            maze.current[1] -= 1;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'ArrowRight' || key === 'd' || key === 'l')) {
        if (maze.grid[maze.current[0]+1][maze.current[1]].status === "maze") {
            calculateScore(maze.grid[maze.current[0]+1][maze.current[1]]);
            maze.current[0] += 1;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'ArrowLeft' || key === 'a' || key === 'j')) {
        if (maze.grid[maze.current[0]-1][maze.current[1]].status === "maze") {
            calculateScore(maze.grid[maze.current[0]-1][maze.current[1]]);
            maze.current[0] -= 1;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'h')){
        if (maze.showHint === false){
            maze.showHint = true;
        }
        else{
            maze.showHint = false;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'b')){
        if (maze.breadCrumbs === false){
            maze.breadCrumbs = true;
        }
        else{
            maze.breadCrumbs = false;
        }
    }
    if (inputBuffer.includes(key) === false && (key === 'p')){
        if (maze.pathToFinish === false){
            maze.pathToFinish = true;
        }
        else{
            maze.pathToFinish = false;
        }
    }
    if(inputBuffer.indexOf(key) === -1){
        inputBuffer.push(key);
    }
}

function processInput(e) {
    if(keyReceived !== null){
        moveCharacter(e)
    }
}

function keyUp(){
    inputBuffer = [];
    keyReceived = null;
}

function calculateElapsedTime(time){
    timer.min = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    timer.sec = Math.floor((time % (1000 * 60)) / 1000);
}

function renderProgressData(){
    progressBar.innerHTML = "Time: " + timer.min + ":" + timer.sec + " ******* " + "Score: " + score;
}

function showScoreBoard(){
    let head = document.createElement("h3");
    let headNode = document.createTextNode("High Scores:")
    head.appendChild(headNode);
    scoreBoard.appendChild(head);

    for(let i = 0; i < highscores.length; i++){
        let score = document.createElement("p");
        let scoreInfo = document.createTextNode("Score: " + highscores[i].cscore + " Time: " +
            highscores[i].ctime.min + ":" + highscores[i].ctime.sec + " Size: " + highscores[i].size +
            "x" + highscores[i].size);
        score.appendChild(scoreInfo);
        scoreBoard.appendChild(score);
    }
}

function endGame(){
    if(gameOver === false){
        let minutes = timer.min;
        let seconds = timer.sec;
        let currentScore = {
            ctime: {
                min: minutes,
                sec: seconds
            },
            cscore: score,
            size: mazeSize
        }
        highscores.push(currentScore);
        highscores.sort((a, b) => (a.cscore < b.cscore) ? 1 : (a.cscore === b.cscore) ?
            ((a.size < b.size) ? 1 : -1) : -1);
        showScoreBoard();
        gameOver = true;
    }
}

function update(elapsedTime){
    if (maze.current[0] === maze.end[0] && maze.current[1] === maze.end[1]){
        endGame();
    }
    else{
        calculateElapsedTime(elapsedTime);
        processInput(keyReceived);
    }
}

function render() {
    if (gameOver){
        MazeGen.renderEnd();
    }
    else{
        renderProgressData();
        MazeGen.clear();
        MazeGen.renderMaze(maze);
        MazeGen.renderCharacter(myCharacter, maze.current);
    }
}

function gameLoop() {
    let elapsedTime = performance.now() - startTime;
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
    newGame();
}

function newGame(){
    gameOver = false;
    scoreBoard.innerHTML = "";
    startTime = performance.now();
    score = 0;
    initialize();
}

function initialize() {
    maze = MazeGen.generateMaze(mazeSize,mazeSize);
    window.addEventListener('keydown', function(event) {
        keyReceived = event.key;
    });
    window.addEventListener('keyup', keyUp);

    requestAnimationFrame(gameLoop);
}