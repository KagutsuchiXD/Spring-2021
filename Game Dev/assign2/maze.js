let MazeGen = (function(){
    let canvas = document.getElementById('mazeCanvas');
    let context = canvas.getContext('2d');

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Prim's algorithm

    function generateMazeInfo(width, height){
        let mazeInfo = [];

        // generate grid of cells... I know the setup is wonky but maze[x][y] is easier to understand.
        for (let x = 0; x < width; x++){
            //initialize columns
            mazeInfo[x] = []
            for (let y = 0; y < height; y++){
                // create each cell
                let cell = {
                    x: x,
                    y: y,
                    status: "empty",
                    adjacentCells: [],
                    connectedCells: [],
                    path: false,
                    visited: false,
                    parent: undefined
                };
                mazeInfo[x][y] = cell;

                if (mazeInfo[x - 1]){
                    if(mazeInfo[x-1][y]){
                        let left = mazeInfo[x-1][y];
                        cell.adjacentCells.push(left);
                        left.adjacentCells.push(cell);
                    }
                }
                if (mazeInfo[x][y - 1]) {
                    let up = mazeInfo[x][y - 1];
                    cell.adjacentCells.push(up);
                    up.adjacentCells.push(cell);
                }
            }
        }

        let frontier = [];
        let startX = Math.floor(Math.random() * mazeInfo.length);
        let startY = Math.floor(Math.random() * mazeInfo[startX].length);
        let current = mazeInfo[startX][startY];
        //Set start as current
        current.status = "maze";

        do{
            //add unvisited adjacent cells to frontier
            function addToFrontier(adjCells) {
                for (let c of adjCells) {
                    if (c.status === "empty") {
                        frontier.push(c);
                        c.status = "frontier";
                    }
                }
            }
            addToFrontier(current.adjacentCells);

            let randFrontierCell = frontier.splice(Math.floor(Math.random() * frontier.length), 1)[0];
            let possibleConnections = [];
            for (let cc of randFrontierCell.adjacentCells){
                if (cc.status === "maze"){
                    possibleConnections.push(cc)
                }
            }
            let randConnection = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
            randFrontierCell.connectedCells.push(randConnection);
            randConnection.connectedCells.push(randFrontierCell);
            randFrontierCell.status = "maze";
            current = randFrontierCell;

        }while(frontier.length > 0);
        return mazeInfo;
    }

    function generateMaze(width, height){
        // generate grid of cells... I know the setup is wonky but maze[x][y] is easier to understand.
        let grid = [];
        let mazeInfo = generateMazeInfo(width, height);

        let mazeWidth = width * 2 + 1;
        let mazeHeight = height * 2 + 1;
        for (let x = 0; x < mazeHeight; x++){
            //initialize columns
            grid[x] = []
            for (let y = 0; y < mazeWidth; y++){
                // create each cell
                let cell = {
                    x: x,
                    y: y,
                    status: "wall",
                    adjacentCells: [],
                    connectedCells: [],
                    path: false,
                    visited: false,
                    parent: undefined
                };
                grid[x][y] = cell;
            }
        }

        for (let i = 0; i < width; i++){
            for (let j = 0; j < height; j++){
                grid[i*2 + 1][j*2 + 1] = mazeInfo[i][j];

                for (let cc of mazeInfo[i][j].connectedCells){
                    if (cc.x === mazeInfo[i][j].x){
                        if (cc.y > mazeInfo[i][j].y){
                            grid[i*2 + 1][j*2 + 2].status = "maze";
                            grid[i*2 + 1][j*2 + 2].connectedCells.push(cc);
                            grid[i*2 + 1][j*2 + 2].connectedCells.push(mazeInfo[i][j]);
                            cc.connectedCells.push(grid[i*2 + 1][j*2 + 2]);
                            mazeInfo[i][j].connectedCells.push(grid[i*2 + 1][j*2 + 2]);
                        }
                        else if (cc.y < mazeInfo[i][j].y){
                            grid[i*2 + 1][j*2].status = "maze";
                            grid[i*2 + 1][j*2].connectedCells.push(cc);
                            grid[i*2 + 1][j*2].connectedCells.push(mazeInfo[i][j]);
                            cc.connectedCells.push(grid[i*2 + 1][j*2]);
                            mazeInfo[i][j].connectedCells.push(grid[i*2 + 1][j*2]);
                        }
                    }
                    else if (cc.y === mazeInfo[i][j].y){
                        if (cc.x > mazeInfo[i][j].x){
                            grid[i*2 + 2][j*2 + 1].status = "maze";
                            grid[i*2 + 2][j*2 + 1].connectedCells.push(cc);
                            grid[i*2 + 2][j*2 + 1].connectedCells.push(mazeInfo[i][j]);
                            cc.connectedCells.push(grid[i*2 + 2][j*2 + 1]);
                            mazeInfo[i][j].connectedCells.push(grid[i*2 + 2][j*2 + 1]);
                        }
                        else if (cc.y < mazeInfo[i][j].y){
                            grid[i*2][j*2 + 1].status = "maze";
                            grid[i*2][j*2 + 1].connectedCells.push(cc);
                            grid[i*2][j*2 + 1].connectedCells.push(mazeInfo[i][j]);
                            cc.connectedCells.push(grid[i*2][j*2 + 1]);
                            mazeInfo[i][j].connectedCells.push(grid[i*2][j*2 + 1]);
                        }
                    }

                }
            }
        }

        let maze = {
            grid: grid,
            start: [1, 1],
            current: [1, 1],
            end: [mazeWidth-2, mazeHeight-2]
        };

        return maze;
    }

    function solveMaze(maze){
        for (let x = 0; x < maze.grid.length; x++){
            for (let y = 0; y < maze.grid[0].length; y++){
                maze.grid[x][y].path = false;
            }
        }
        function findPath(){
            let location = maze.grid[maze.current[0]][maze.current[1]];

            let queue = [];
            queue.push(location);
            while(queue.length > 0){
                let current = queue.shift();
                if (current.x === maze.end[0] && current.y === maze.end[1]){
                    return current;
                }
                maze.grid[current.x][current.y].visited = true;
                for (let neighbor of maze.grid[current.x][current.y].connectedCells){
                    if(neighbor.visited === false){
                        queue.push(neighbor);
                        maze.grid[current.x][current.y].parent = current;
                    }
                }
            }
            return false;
        }
        let trailHead = findPath();
        while(true){
            trailHead.path = true;
            if(maze.grid[trailHead.x][trailHead.y].parent){
                trailHead = maze.grid[trailHead.x][trailHead.y].parent;
            }
            else{
                break;
            }

        }
    }

    function drawMaze(maze){
        let cellSize = canvas.width / maze.grid.length;
        for (let x = 0; x < maze.grid.length; x++){
            for (let y = 0; y < maze.grid[0].length; y++){
                if (maze.grid[x][y].status === "maze"){
                    if (maze.grid[x][y].path === true){
                        console.log("maze found at: " + x + "," + y);
                        context.fillStyle = 'rgba(0, 0, 0, .75)';
                        context.fillRect(x*cellSize, y*cellSize,cellSize,cellSize);
                    }
                    else{
                        console.log("maze found at: " + x + "," + y);
                        context.fillStyle = 'rgba(255, 0, 0, .75)';
                        context.fillRect(x*cellSize, y*cellSize,cellSize,cellSize);
                    }
                }
                else if(maze.grid[x][y].status === "wall"){
                    console.log("wall found at: " + x + "," + y);
                    context.fillStyle = 'rgba(0, 0, 255, .75)';
                    context.fillRect(x*cellSize, y*cellSize,cellSize,cellSize);
                }
                else{
                    console.log("error found at: " + x + "," + y);
                }
            }
        }
    }

    return{
        generateMaze: generateMaze,
        solveMaze: solveMaze,
        drawMaze: drawMaze,
        clear: clear
    }
})();
