//constructor for people
function Person(Radius, X, Y, turn) {
    "use strict";
    this.personRadius = Radius;
    this.personX = X;
    this.personY = Y;
    this.personTurnRad = turn;
    this.direction = 0;
    this.velocity = 0;
}

function createPeople() {
    "use strict";
    var i = 0;
    groceryMap.People = new Array(groceryMap.numberOfPeople);
    for (var i = 0; i < groceryMap.numberOfPeople; i++) {
        groceryMap.People[i] = new Person(15 + 3 * Math.random(), 300 + 200 * Math.random(), 300 + 200 * Math.random());
    }
}

//@jordan - this one's all you. Mockup function only. Brownian motion lol.
function handlePerson(maxX, maxY, myPerson) {
    "use strict";
    var velX, velY = 0;

    velX = 5 - 10 * Math.random();
    velY = 5 - 10 * Math.random();
    if (myPerson.personX > 0 && myPerson.personX < maxX) {
        myPerson.personX = myPerson.personX + velX;
    }
    if (myPerson.personY > 0 && myPerson.personY < maxY) {
        myPerson.personY = myPerson.personY + velY;
    }
    myPerson.personX = Math.max(1, myPerson.personX);
    myPerson.personX = Math.min(maxX - 1, myPerson.personX);
    myPerson.personY = Math.max(1, myPerson.personY);
    myPerson.personY = Math.min(maxY - 1, myPerson.personY);
}

function testAStar() {
    var myPerson = [5,5];
    var myGoal = [18, 19];
    var myPath = getAPath(myPerson, myGoal);
    for (var i = 0; i < myPath.length; i++) {
        console.log(myPath[i]);
    }
}

/* Returns the length of the least curved path (curve, then straight) from 
   initial to end point given a starting orientation on the initial point and 
   a turn radius for the initial curve. Acts only as the heuristic, and hence, 
   only returns a numeric result. 

   init is the (x,y) of the initial position
   initdir is the initial direction (in radians) of the traveller
   turn_rad is the turn radius to consider in this algorithm
   end is the (x,y) of the end position
*/
function heuristicCurve(init, initdir, end, turn_rad){
    var paths = new Array(2);
    for(var i = 0; i < 2; i++){
        var init_ang = 0;
        if(i == 0){
            init_ang = (initdir - (Math.PI / 2)) % (2 * Math.PI);
        }
        else{
            init_ang = (initdir + (Math.PI / 2)) % (2 * Math.PI);
        }

        var O = [init[0] + turn_rad * Math.cos(init_ang), init[1] - turn_rad * Math.sin(init_ang)];
        var h = distance(O, end);
        if(h < turn_rad){
            return false;
        }
        
        var straight = Math.sqrt(Math.pow(h, 2) - Math.pow(turn_rad, 2));
        var theta = Math.acos(turn_rad / h);
        var phi = Math.atan2(end[0] - O[0], O[1] - end[1]);
        var turn_ang = 0;
        if(i == 0){
            turn_ang = (phi + theta) % (2 * Math.PI);
        }
        else{
            turn_ang = (phi - theta) % (2 * Math.PI);
        }
        var curve = ((2 * Math.PI - turn_ang) / 2 * Math.PI) * Math.PI * turn_rad * 2;
        var length = straight + curve;
        paths[i] = length;
    }
    return Math.min(paths[0], paths[1])
}

function distance(node, goal){
    return Math.pow((Math.pow((node[0] - goal[0]), 2) + Math.pow((node[1] - goal[1]), 2)), 0.5);
}

/* Returns the least curved path (curve, then straight, then curve) between two points 
   given a starting and ending direction for each (respectively). Paths are returned 
   as an array as follows:
    [0] is the path length.
    [1] is "L" or "R", indicating if the first curve should start by turning left or right.
    [2] is the point at which the first curve should end, and the traveller should begin moving
    straight. 
    [3] is "L" or "R", indicating if the last curve should start by turning left or right. 
    [4] is the point at which the last curve should start. The traveller stops moving straight
    and starts making the last turn. 
*/
function nodePath(init, init_dir, end, end_dir, turn_rad){
    //Write this. 
}

// Would translate blocked nodes on the old 60 x 60 structure. Currently unused. 
function getBlocked(person){
    var blocks = [];
    for(var r = 0; r < groceryMap.tilesWide; r++){
        for(var c = 0; c < groceryMap.tilesHigh; c++){
            if(groceryMap.floorPlan[r][c] != 0){
                var left = groceryMap.tileSize * r - person.personRadius;
                var right = groceryMap.tileSize * (r + 1) + person.personRadius;
                var up = groceryMap.tileSize * c - person.personRadius;
                var down = groceryMap.tileSize * (c + 1) + person.personRadius;
                blocks.push([left, right, up, down]);
            }
        }
    }
    return blocks;
}

// Create the initial A* grid from the current map. Give each cell a 6-index array to hold 
// stats during the A* process. (This function creates a diagonal mirror of the floor, but this
// system is more intuitive then a pure floor array (the former works in [x,y] indices, while 
// the latter works in [y,x])). 
function makeAGrid(wide, high){
    var nodes = new Array(wide);
    for(var i = 0; i < wide; i++){
        nodes[i] = new Array(high);
    }
    for(var r = 0; r < wide; r++){
        for(var c = 0; c < high; c++){
            nodes[r][c] = new Array(6);
        }
    }
    return nodes;
}

// Populate the initial A* grid from the current map, with respect to a given goal tile.
/* Establish the stats as follows:
            - In 0, hold a boolean declaring if this node is reachable (not within 
                or too close to an obstacle). After 1 (below) is calculated, 
                this stat also determines if any of the others will be calculated or 
                used in the algorithm ahead. 
            - In 1, hold the x, y node position. 
            - In 2, hold the cost to reach the node from start. (This will change as 
                the selection progresses! As more efficient paths are found.)
            - In 3, hold the heuristic result of the node. 
            - In 4, hold the reference to the parent node (the node before this one 
                on the path.)
            - In 5, hold a boolean declaring if this node is in the open (searched)
                list. 
        Also declare diagonal (the diagonal distance between neighboring nodes) here. 
        It's just convenient to do it in this part of the function.
    */
function prepAGrid(grid, goal_tile, floor_plan){
    var goal_x = goal_tile[0]
    var goal_y = goal_tile[1]
    var goal = [goal_x, goal_y]
    
    for (var r = 0; r < grid.length; r++) {
        for (var c = 0; c < grid[0].length; c++) {
            switch (floor_plan[r][c]) {
                case 0:
                    grid[r][c][0] = true;
                    break;
                default:
                    grid[r][c][0] = false;
            }
            var cell_x = r;
            var cell_y = c;
            grid[r][c][1] = [cell_x, cell_y]
            
            grid[r][c][2] = Number.MAX_VALUE;
            grid[r][c][3] = distance(grid[r][c][1], goal);
            grid[r][c][4] = [0, 0];
            grid[r][c][5] = false;
        }
    }
}

// Given an A* grid, find the node in the open set with the least f value. (This is the node to
// extend next per the algorithm!)
function find_extend(grid){
    var least_f = Number.MAX_VALUE;
    var extend = [0, 0];
    for(var r = 0; r < grid.length; r++){
        for(var c = 0; c < grid[0].length; c++){
            if(grid[r][c][5]){
                var f = grid[r][c][2] + grid[r][c][3];
                if(f < least_f){
                    least_f = f;
                    extend = [r, c];
                }
            }
        }
    }
    return extend;
}

// Mutate the grid to "extend" from the given node. This removes the node from the open set and adds 
// neighbors as needed. 
function extend(grid, extend_node){
    var parent = grid[extend_node[0]][extend_node[1]];
    parent[5] = false;
    for(var r_var = -1; r_var <= 1; r_var++){
        for(var c_var = -1; c_var <= 1; c_var++){
            var r_dex = Math.min(Math.max(0, extend_node[0] + r_var), grid.length - 1);
            var c_dex = Math.min(Math.max(0, extend_node[1] + c_var), grid[0].length - 1);
            if((r_dex == extend_node[0] ? c_dex != extend_node[1] : c_dex == extend_node[1]) && grid[r_dex][c_dex][0]){
                var next_node = grid[r_dex][c_dex];
                var new_dist_to = parent[2] + groceryMap.tileSize;
                if (new_dist_to < next_node[2]) {
                    next_node[2] = new_dist_to;
                    next_node[4] = [extend_node[0], extend_node[1]];
                    next_node[5] = true;
                }
            }
        }
    }
}

// Perform the A* procedure on the grid. This mutates it until the final resulting grid from A*
// is achieved. 
function performAStar(grid, start_tile, goal_tile){
    var start = grid[start_tile[0]][start_tile[1]]
    start[2] = 0;
    start[5] = true;
    
    var extend_node = [start_tile[0], start_tile[1]];
    var while_stopper = 0;
    
    while(extend_node != goal_tile){
        while_stopper++;
        if(while_stopper > 20000){
            break;
        }
        extend_node = find_extend(grid);
        extend(grid, extend_node);
    }
}

/* Traceback the path that ends at the goal tile via the grid (which should have)
completed the A* algorithm mutation. */
function tracebackPath(grid, start, goal){
    var traceback = [goal[0], goal[1]];
    var waypoints = [];
    var while_stopper = 0
    while(JSON.stringify(traceback) != JSON.stringify(start)){
        while_stopper++;
        if(while_stopper > 20000){
            break;
        }
        waypoints.unshift(grid[traceback[0]][traceback[1]][1]);
        traceback = grid[traceback[0]][traceback[1]][4];
        debugger;
    }
    waypoints.unshift(grid[start[0]][start[1]][1]);
    return waypoints;
}

/* This should return a list of x, y waypoints on the optimal path, but this
will change based on the Gama Sutra method. Person is the starting tile, goal is 
the ending tile. 
*/
function getAPath(start, goal){
    "use strict";    
    var nodes = makeAGrid(groceryMap.tilesWide, groceryMap.tilesHigh);
//    debuggy("here i am");
//    debugger;
    prepAGrid(nodes, goal, groceryMap.floorPlan);
    
    performAStar(nodes, start, goal);
    
    return tracebackPath(nodes, start, goal);
}

// Turn the (x, y) waypoints into (x, y, d) waypoints. This smoothed path should 
// have at most as many points as the initial. 
function smooth48(path){
    
}

// Perform a D-8 A* search between two points. Returns (x, y, d) waypoints. 
function getD8APath(person, goal){
    
}