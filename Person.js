/* eslint-env browser*/
export default class Person {
    constructor(myMap, Radius, X, Y, turn) {
        "use strict";
        this.personRadius = Radius;
        this.personX = X;
        this.personY = Y;
        this.personTurnRad = turn;
        this.direction = 0;
        this.velocity = 1; //px per frame?
        this.grocery_list = [];
        this.myMap = myMap,
        this.currentGoal = 1;
    }

    distance(node, goal) {
        /* function to return Cartesian distance */
        "use strict";
        return Math.sqrt((Math.pow((node[0] - goal[0]), 2) + Math.pow((node[1] - goal[1]), 2)));
    }
    
    makeAGrid(){
        /* Create the initial A* grid from the current map. Give each cell a 6-index array to hold stats during the A* process. (This function creates a diagonal mirror of the floor, but this system is more intuitive then a pure floor array (the former works in [x,y] indices, while the latter works in [y,x])).*/
        "use strict";
        var nodes = [],
            i = 0,
            r = 0,
            c = 0,
            wide = this.myMap.tilesWide,
            high = this.myMap.tilesHigh;
        for(i = 0; i < wide; i += 1){
            nodes[i] = [];
        }
        for(r = 0; r < wide; r += 1){
            for(c = 0; c < high; c += 1){
                nodes[r][c] = [];
            }
        }
        return nodes;
    }
    
    prepAGrid(grid, goal_tile, floor_plan){
        /* Populate the initial A* grid from the current map, with respect to a given goal tile.
        Establish the stats as follows:
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
        "use strict";
        var goal_x = 0,
            goal_y = 0,
            goal = [],
            r = 0,
            c = 0,
            cell_x = 0,
            cell_y = 0;
        
        goal_x = goal_tile[0];
        goal_y = goal_tile[1];
        goal = [goal_x, goal_y];

        for (r = 0; r < grid.length; r += 1) {
            for (c = 0; c < grid[0].length; c += 1) {
                switch (floor_plan[r][c]) {
                case 1:
                    grid[r][c][0] = false;
                    break;
                default:
                    grid[r][c][0] = true;
                }

                cell_x = r;
                cell_y = c;
                grid[r][c][1] = [cell_x, cell_y];

                grid[r][c][2] = Number.MAX_VALUE;
                grid[r][c][3] = this.distance(grid[r][c][1], goal);
                grid[r][c][4] = [0, 0];
                grid[r][c][5] = false;
            }
        }
    }
    
    extend(grid, extend_node){
        /* Mutate the grid to "extend" from the given node. This removes the node from the open set and adds neighbors as needed. */
        "use strict";
        var parent,
            r_var = 0,
            c_var = 0,
            r_dex = 0,
            c_dex = 0,
            next_node,
            new_dist_to;
        
        parent = grid[extend_node[0]][extend_node[1]];
        parent[5] = false;
        for(r_var = -1; r_var <= 1; r_var++){
            for(c_var = -1; c_var <= 1; c_var++){
                r_dex = Math.min(Math.max(0, extend_node[0] + r_var), grid.length - 1);
                c_dex = Math.min(Math.max(0, extend_node[1] + c_var), grid[0].length - 1);
                if((r_dex === extend_node[0] ? c_dex != extend_node[1] : c_dex == extend_node[1]) && grid[r_dex][c_dex][0]){
                    next_node = grid[r_dex][c_dex];
                    new_dist_to = parent[2] + this.myMap.tileSize;
                    if (new_dist_to < next_node[2]) {
                        next_node[2] = new_dist_to;
                        next_node[4] = [extend_node[0], extend_node[1]];
                        next_node[5] = true;
                    }
                }
            }
        }
    }

    find_extend(grid){
        /* Given an A* grid, find the node in the open set with the least f value (This is the node to extend next per the algorithm!) */
        "use strict";
        var least_f = Number.MAX_VALUE,
            extend = [0, 0],
            r = 0,
            c = 0,
            f;
        for(r = 0; r < grid.length; r += 1){
            for(c = 0; c < grid[0].length; c += 1){
                if(grid[r][c][5]){
                    f = grid[r][c][2] + grid[r][c][3];
                    if(f < least_f){
                        least_f = f;
                        extend = [r, c];
                    }
                }
            }
        }
        return extend;
    }
    
    performAStar(grid, start_tile, goal_tile){
        /* Perform the A* procedure on the grid. This mutates it until the final resulting grid from A* is achieved. */
        "use strict";
        var start,
            extend_node,
            while_stopper = 0;
        
        start = grid[start_tile[0]][start_tile[1]];
        start[2] = 0;
        start[5] = true;

        extend_node = [start_tile[0], start_tile[1]];
        while_stopper = 0;

        while(extend_node != goal_tile){
            while_stopper += 1;
            if(while_stopper > 20000){
                break;
            }
            extend_node = this.find_extend(grid);
            this.extend(grid, extend_node);
        }
    }
    
    tracebackPath(grid, start, goal){
        /* Traceback the path that ends at the goal tile via the grid (which should have completed the A* algorithm mutation). */
        "use strict";
        var traceback = [goal[0], goal[1]],
            waypoints = [],
            while_stopper = 0;
        while(JSON.stringify(traceback) != JSON.stringify(start)) {
            while_stopper++;
            if(while_stopper > 20000){
                break;
            }
            waypoints.unshift(grid[traceback[0]][traceback[1]][1]);
            traceback = grid[traceback[0]][traceback[1]][4];
        }
        waypoints.unshift(grid[start[0]][start[1]][1]);
        return waypoints;
    }

    getAPath(start, goal){
        /* This should return a list of x, y waypoints on the optimal path, but this will change based on the Gama Sutra method. Person is the starting tile, goal is the ending tile. */
        "use strict";    
        var nodes = this.makeAGrid(this.myMap.tilesWide, this.myMap.tilesHigh);

        this.prepAGrid(nodes, goal, this.myMap.floorPlan);

        this.performAStar(nodes, start, goal);

        return this.tracebackPath(nodes, start, goal);
    }
    
    handlePerson(maxX, maxY) {
        /* function to return X, Y of person on A* path */
        "use strict";
        //if there's more path to travel, otherwise just stop. *Path* handling, not grocery list handling. 
        if (this.currentPoint < this.currentPath.length - 1) {
            var x_coord = (this.currentPath[this.currentPoint][0] + 0.5) * this.myMap.tileSize;
            var y_coord = (this.currentPath[this.currentPoint][1] + 0.5) * this.myMap.tileSize;
            var x_goal = (this.currentPath[this.currentPoint + 1][0] + 0.5) * this.myMap.tileSize;
            var y_goal = (this.currentPath[this.currentPoint + 1][1] + 0.5) * this.myMap.tileSize;
            var angle = Math.atan2((y_coord - y_goal), (x_coord - x_goal));
            var x_speed = this.velocity * Math.cos(angle);
            var y_speed = this.velocity * Math.sin(angle);
            this.personX -= x_speed;
            this.personY -= y_speed;

            //if close enough to next node, change goal to next node
            if (Math.abs(this.personY - y_goal) < 5 && Math.abs(this.personX - x_goal) < 5) {
                this.currentPoint++;
            }
        } else if (this.current_goal < this.grocery_list.length - 1) {
            //if there's more goals in the grocery list, re-initialize for the next path travel. 
            var myStart = [],
                myGoal = [],
                myPath,
                x_coord = 0,
                y_coord = 0;
            this.current_goal++;

            myStart = this.grocery_list[this.current_goal - 1];
            myGoal = this.grocery_list[this.current_goal];
            myPath = this.getAPath(myStart, myGoal);

            this.currentPath = myPath; //this is a reference, copy if needed
            this.currentPoint = 0; //first element of path
            x_coord = this.currentPath[0][0];
            y_coord = this.currentPath[0][1];
            this.personX = (x_coord + 0.5) * groceryMap.tileSize;
            this.personY = (y_coord + 0.5) * groceryMap.tileSize;
            //debugger;
        }
    }
       
    drawPerson(config, myCanvas) {
        "use strict";
        var i = 0;
        for (i = 0; i < config.numberOfPeople; i++) {
            this.handlePerson(this.myMap.tilesHigh * this.myMap.tileSize, this.myMap.tilesWide * this.myMap.tileSize);
            myCanvas.beginPath();
            myCanvas.arc(this.personX, this.personY, this.personRadius, 0, 2 * Math.PI, false);
            myCanvas.fillStyle = "purple";
            myCanvas.fill();
        }
    }
}
