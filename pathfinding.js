import Person from "./Person.js";
function createPeople() {
    "use strict";
    var i = 0,
        myGoal = [0, 0],
        myStart = [0, 0],
        x_coord = 0,
        y_coord = 0,
        entrance = [12, 18],
        myPath;
    groceryMap.People = new Array(groceryMap.numberOfPeople);
    for (i = 0; i < groceryMap.numberOfPeople; i += 1) {
        groceryMap.People[i] = new Person(groceryMap, 15 + 3 * Math.random(), 0, 0);
        
        myGoal = [10, 10];
        myStart = [1, 1];
        myPath = groceryMap.People[i].getAPath(myStart, myGoal);
        
        groceryMap.People[i].grocery_list.push(entrance);
        for (var g = 0; g < groceryMap.goals.length; g++){
            var goal = groceryMap.goals[g];
            if (Math.random() < 0.5 && JSON.stringify(goal) != JSON.stringify(entrance)) {
                groceryMap.People[i].grocery_list.push(goal);
            }
        }
        groceryMap.People[i].grocery_list.push(entrance);
//        console.log(JSON.stringify(groceryMap.People[i].grocery_list))
//        debugger;
        
        groceryMap.People[i].currentPath = myPath; //this is a reference, copy if needed
        groceryMap.People[i].currentPoint = 0; //first element of path
        x_coord = groceryMap.People[i].currentPath[0][0];
        y_coord = groceryMap.People[i].currentPath[0][1];
        groceryMap.People[i].personX = (x_coord + 0.5) * groceryMap.tileSize;
        groceryMap.People[i].personY = (y_coord + 0.5) * groceryMap.tileSize;
    }
}

function testAStar() {
    var myPerson = groceryMap.People[0];
    var myGoal = [10, 15];
    var myStart = [5, 5];
    var myPath = myPerson.getAPath(myStart, myGoal);
//    for (var i = 0; i < myPath.length; i++) {
//        console.log(myPath[i]);
//    }
    myPerson.currentPath = myPath; //this is a reference, copy if needed
    myPerson.currentPoint = 0; //first element of path
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

// Turn the (x, y) waypoints into (x, y, d) waypoints. This smoothed path should 
// have at most as many points as the initial. 
function smooth48(path){
    
}

// Perform a D-8 A* search between two points. Returns (x, y, d) waypoints. 
function getD8APath(person, goal){
    
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

/* Traceback the path that ends at the goal tile via the grid (which should have
completed the A* algorithm mutation). */
function tracebackPath(grid, start, goal){
    var traceback = [goal[0], goal[1]];
    var waypoints = [];
    var while_stopper = 0;
    while(JSON.stringify(traceback) != JSON.stringify(start)) {
        while_stopper++;
        if(while_stopper > 20000){
            break;
        }
        waypoints.unshift(grid[traceback[0]][traceback[1]][1]);
        traceback = grid[traceback[0]][traceback[1]][4];
        // debugger;
    }
    waypoints.unshift(grid[start[0]][start[1]][1]);
    //debugger;
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
    
    var path = tracebackPath(nodes, start, goal);
    debugger;
    
    smooth_path(path, 10);
    
    return path;
}

// Takes in a tile index, and returns the x, y of the tile's center. 
function ind_to_xy(tile){
    var x = (tile[0] + 0.5) * groceryMap.tileSize;
    var y = (tile[1] + 0.5) * groceryMap.tileSize;
    return [x, y];
}

// Takes in ANY x, y and returns the tile that the point would fall in. 
function xy_to_ind(tile){
    var x_ind = Math.floor(tile[0] / groceryMap.tileSize);
    var y_ind = Math.floor(tile[1] / groceryMap.tileSize);
    return [x_ind, y_ind];
}

// Given a start and end [x, y] tile index and a person radius, determine if the 
// person would collide in a direct path between the two tiles. Steps are *approximately* made 
// in fifth-of-a-tile increments; although these increments can be smaller. 
function checkCollide(start, goal, radius){
    var collide = false;
    
    var tile_dist = distance(start, goal) * groceryMap.tileSize;
    var step = groceryMap.tileSize / 5;
    var steps_num = Math.ceil(tile_dist / step);
    
    var start_xy = ind_to_xy(start);
    var goal_xy = ind_to_xy(goal);
    
    var x_step = (goal_xy[0] - start_xy[0]) / steps_num;
    var y_step = (goal_xy[1] - start_xy[1]) / steps_num;
    
    for (var i = 0; i <= steps_num; i++){
        var point_x = start_xy[0] + i * x_step;
        var point_y = start_xy[1] + i * y_step;
        
        var sense_points = [[point_x - radius, point_y], 
                            [point_x + radius, point_y], 
                            [point_x, point_y - radius], 
                            [point_x, point_y + radius]];
        
        var sense_tiles = sense_points.map(xy_to_ind);
        
        for (var j = 0; j < 4; j++){
            if (groceryMap.floorPlan[sense_tiles[j][0]][sense_tiles[j][1]] == 1){
                collide = true;
            }
        }
    }
    
    return collide;
}

function smooth_path(path, radius){
    var kept = 0;
    var legal = false;
    
    while (kept < path.length - 2) {
        legal = !checkCollide(path[kept], path[kept + 2], radius);
        if (legal) {
            path.splice(kept + 1, 1);
        }
        else {
            kept++;
        }
    }
    debugger;
}



// These are unused, for now. 
//// Turn the (x, y) waypoints into (x, y, d) waypoints. This smoothed path should 
//// have at most as many points as the initial. 
//function smooth48(path){
//    
//}
//
//// Perform a D-8 A* search between two points. Returns (x, y, d) waypoints. 
//function getD8APath(person, goal){
//    
//}
