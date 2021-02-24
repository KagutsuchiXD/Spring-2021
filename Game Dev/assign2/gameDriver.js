let maze = null;

let inputBuffer = {};

let myCharacter = function(imageSource) {
    let image = new Image();
    image.isReady = false;
    image.onload = function() {
        this.isReady = true;
    };
    image.src = imageSource;
    return image;
}('spidey.png');

function moveCharacter(key) {
    maze.grid[maze.current[0]][maze.current[1]].visited = true;
    if (key === 'ArrowDown' || key === 's' || key === 'k') {
        if (maze.grid[maze.current[0]][maze.current[1]+1].status === "maze") {
            maze.current[1] += 1;
        }
    }
    if (key === 'ArrowUp' || key === 'w' || key === 'i') {
        if (maze.grid[maze.current[0]][maze.current[1]-1].status === "maze") {
            maze.current[1] -= 1;
        }
    }
    if (key === 'ArrowRight' || key === 'd' || key === 'l') {
        if (maze.grid[maze.current[0]+1][maze.current[1]].status === "maze") {
            maze.current[0] += 1;
        }
    }
    if (key === 'ArrowLeft' || key === 'a' || key === 'j') {
        if (maze.grid[maze.current[0]-1][maze.current[1]].status === "maze") {
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

function render() {
    MazeGen.clear();

    MazeGen.renderMaze(maze);
    MazeGen.renderCharacter(myCharacter, maze.current);
}

function processInput() {
    for (input in inputBuffer) {
        moveCharacter(inputBuffer[input]);
    }
    inputBuffer = {};
}

function update(){
    processInput();
}

function gameLoop() {
    update();
    render();

    requestAnimationFrame(gameLoop);
}

function initialize() {
    maze = MazeGen.generateMaze(10,10);
    window.addEventListener('keydown', function(event) {
        inputBuffer[event.key] = event.key;
    });

    requestAnimationFrame(gameLoop);
}