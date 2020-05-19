//constructor for people
function Person(Radius, X, Y, turn) {
    "use strict";
    this.personRadius = Radius;
    this.personX = X;
    this.personY = Y;
    this.personTurnRad = turn
}

function createPeople() {
    "use strict";
    var i = 0;
    groceryMap.People = new Array(groceryMap.numberOfPeople);
    for (i = 0; i < groceryMap.numberOfPeople; i++) {
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
    for(i = 0; i < 2; i++){
        if(i == 0){
            var init_ang = (initdir - (Math.PI / 2)) % (2 * Math.PI);
        }
        else{
            var init_ang = (initdir + (Math.PI / 2)) % (2 * Math.PI);
        }

        var O = [init[0] + turn_rad * Math.cos(init_ang), init[1] - turn_rad * Math.sin(init_ang)];
        var h = distance(O, end);
        if(h < turn_rad){
            return false;
        }
        
        var straight = Math.sqrt(h ** 2 - r ** 2);
        var theta = Math.acos(turn_rad / h);
        var phi = Math.atan2(end[0] - O[0], O[1] - end[1]);
        if(i == 0){
            var turn_ang = (phi + theta) % (2 * Math.PI);
        }
        else{
            var turn_ang = (phi - theta) % (2 * Math.PI);
        }
        var curve = ((2 * Math.PI - turn_ang) / 2 * Math.PI) * Math.PI * turn_rad * 2;
        var length = straight + curve;
        paths[i] = length;
    }
    return min(paths[0], paths[1])
}

function distance(node, goal){
    return ((node[0] - goal[0]) ** 2 + (node[1] - goal[1]) ** 2) ** 0.5;
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

function getBlocked(person){
    var blocks = [];
    for(r = 0; r < groceryMap.tilesWide; r++){
        for(c = 0; c < groceryMap.tilesHigh; c++){
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

/* This should return a list of x, y waypoints on the optimal path, but this
will change based on the Gama Sutra method. 
*/
function getAPath(person, goal){
    "use strict";

    // Create the 60 by 60 grid. Then, for each node, create an array that 
    // holds node stats. 
    var nodes = new Array(60);
    for(i = 0; i < 60; i++){
        nodes[i] = new Array(60);
    }
    for(r = 0; r < 60; r++){
        for(c = 0; c < 60; c++){
            nodes[r][c] = new Array(6);
        }
    }

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
    var x_unit = (goal[0] - person.personX) / 59.0;
    var y_unit = (goal[1] - person.personY) / 59.0;
    var blocks = getBlocked(player);
    for(r = 0; r < 60; r++){
        for(c = 0; c < 60; c++){
            var x_dist = c * x_unit;
            var x_pos = person.personX + x_dist;
            var y_dist = r * y_unit;
            var y_pos = person.personY + y_dist;
            nodes[r][c][1] = [x_pos, y_pos];

            nodes[r][c][0] = true;
            for (b = 0; b < blocks.length; block++){
                if (x_pos > blocks[0] && x_pos < blocks[1]
                    && y_pos > blocks[2] && y_pos < blocks[3]){
                        nodes[r][c][0] = false;
                }
            }

            if(nodes[r][c][0]){
                nodes[r][c][2] = Number.MAX_VALUE;
                nodes[r][c][3] = distance([x_pos, y_pos], [person.personX, person.personY]);
                nodes[r][c][4] = [0, 0];
                nodes[r][c][5] = false;
            }
        }
    }

    var x_len = abs(x_unit);
    var y_len = abs(y_unit);
    var d_len = distance([0,0], [x_unit, y_unit]);

    nodes[0][0][2] = 0;
    nodes[0][0][5] = true;

    var extend_node = [0, 0];
    var extend_parent = [0, 0];

    while(extend_node != [59, 59]){
        var least_f = Number.MAX_VALUE;
        for(r = 0; r < 60; r++){
            for(c = 0; c < 60; c++){
                if(nodes[r][c][5]){
                    var f = nodes[r][c][2] + nodes[r][c][3];
                    if(f < least_f){
                        least_f = f;
                        extend_node = [r, c]
                    }
                }
            }
        }

        nodes[extend_node[0]][extend_node[1]][5] = false;
        
        if(extend_node != [59, 59]){
            for(r_var = -1; r_var <= 1; r_var++){
                for(c_var = -1; c_var <= 1; c_var++){
                    var r_dex = min(max(0, extend_node[0] + r_var), 59);
                    var c_dex = min(max(0, extend_node[1] + c_var), 59);
                    if((r_dex != extend_node[0] || c_dex != extend_node[1]) && nodes[r_dex][c_dex][0]){
                        var next_node = nodes[r_dex][c_dex];
                        if (r_dex == r){
                            var add_dist = y_len;
                        }
                        else if (c_dex == c){
                            var add_dist = x_len;
                        }
                        else{
                            var add_dist = d_len;
                        }
                        var new_dist_to = checking_open[2] + add_dist;
                        if(new_dist_to < next_node[2]){
                            next_node[2] = new_dist_to;
                            next_node[4] = [r, c];
                            next_node[5] = true;
                        }
                    }
                }
            }
        }
    }
    
    var traceback = [59, 59];
    var waypoints = [];
    while(traceback != [0, 0]){
        waypoints.unshift(nodes[traceback[0]][traceback[1]][1]);
        traceback = nodes[traceback[0]][traceback[1]][4];
    }
    waypoints.unshift(nodes[0][0][1]);
    return waypoints;
}