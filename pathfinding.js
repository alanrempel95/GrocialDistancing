//constructor for people
function Person(Radius, X, Y) {
    "use strict";
    this.personRadius = Radius;
    this.personX = X;
    this.personY = Y;
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

function distance(node, goal){
    return ((node[0] - goal[0]) ** 2 + (node[1] - goal[1]) ** 2) ** 0.5;
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
            nodes[r][c] = new Array(7);
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
            - In 6, hold a boolean declaring if this node has yet been visited (at all)
                by the algorithm. 
        Also declare diagonal (the diagonal distance between neighboring nodes) here. 
        It's just convenient to do it in this part of the function.
    */
    var x_unit = (goal[0] - person.personX) / 60.0;
    var y_unit = (goal[1] - person.personY) / 60.0;
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
                nodes[r][c][2] = 0;
                nodes[r][c][3] = distance([x_pos, y_pos], [person.personX, person.personY]);
                nodes[r][c][4] = [0, 0];
                nodes[r][c][5] = false;
                nodes[r][c][6] = false;
            }
        }
    }

    x_len = abs(x_unit);
    y_len = abs(y_unit);
    var d_len = distance([0,0], [x_unit, y_unit]);

    nodes[0][0][5] = true
}