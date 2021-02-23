function generateMaze2(width, height){
    let mazeInfo = [];

    // generate grid of cells... I know the setup is wonky but maze[x][y] is easier to understand.
    for (let x = 0; x < width; x++){
        //initialize columns
        mazeInfo[x] = []
        for (let y = 0; y < height; y++){
            // create each cell
            mazeInfo[x][y] = {
                x: x,
                y: y,
                status: "empty",
                adjacentCells: [],
                connectedCells: [],
                path: false,
                edges: {
                    n: null,
                    s: null,
                    w: null,
                    e: null
                }
            };

            if (mazeInfo[x - 1]){
                if(mazeInfo[x-1][y]){
                    let left = mazeInfo[x-1][y];
                    mazeInfo[x][y].adjacentCells.push(left);
                    left.adjacentCells.push(mazeInfo[x][y]);
                }
            }
            if (mazeInfo[x][y - 1]) {
                let up = mazeInfo[x][y - 1];
                mazeInfo[x][y].adjacentCells.push(up);
                up.adjacentCells.push(mazeInfo[x][y]);
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

        if (randFrontierCell.x === randConnection.x){
            if (randFrontierCell.y > randConnection.y){

            }
            else if (randFrontierCell.y < randConnection.y){

            }
        }
        else if (randFrontierCell.y === randConnection.y){
            if (randFrontierCell.x > randConnection.x){

            }
            else if (randFrontierCell.x < randConnection.x){

            }
        }

        randFrontierCell.status = "maze";
        current = randFrontierCell;

    }while(frontier.length > 0);
    return mazeInfo;
    return {
        grid: grid,
        start: [1,1],
        current: [1,1],
        end: [mazeWidth-2,mazeHeight-2],
        hint: false,
        breadCrumbs: false,
        pathToFinish: false
    };
}