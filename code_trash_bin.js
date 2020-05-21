    //                 var checking_open = nodes[r][c];
    //                 for(r_var = -1; r_var <= 1; r_var++){
    //                     for(c_var = -1; c_var <= 1; c_var++){
    //                         var r_dex = min(max(0, r + r_var), 59);
    //                         var c_dex = min(max(0, c + c_var), 59);
    //                         if((r_dex != r || c_dex != c) && nodes[r_dex][c_dex][0]){
    //                             var next_node = nodes[r_dex][c_dex];
    //                             if (r_dex == r){
    //                                 var add_dist = y_len;
    //                             }
    //                             else if (c_dex == c){
    //                                 var add_dist = x_len;
    //                             }
    //                             else{
    //                                 var add_dist = d_len;
    //                             }
    //                             var new_dist_to = checking_open[2] + add_dist;
    //                             if(new_dist_to < next_node[2]){
    //                                 next_node[2] = new_dist_to;
    //                                 next_node[4] = [r, c];
    //                             }
    //                             var f = next_node[2] + next_node[3];
    //                             if(f < least_f){
    //                                 least_f = f;
    //                                 // extend_node = [r_dex, c_dex];
    //                                 extend_parent = [r, c]
    //                             }
    //                         }
    //                     }
    //                 }
    //             }
    //         }
    //     }
    //     extend_parent[5] = false;
    //     extend_node[5] = true;
    // }

//var x_unit = (goal[0] - person.personX) / 59.0;
//    var y_unit = (goal[1] - person.personY) / 59.0;
//    // var blocks = getBlocked(person);
//    for(var r = 0; r < 60; r++){
//        for(var c = 0; c < 60; c++){
//            var x_dist = c * x_unit;
//            var x_pos = person.personX + x_dist;
//            var y_dist = r * y_unit;
//            var y_pos = person.personY + y_dist;
//            nodes[r][c][1] = [x_pos, y_pos];
//
//            nodes[r][c][0] = true;
//            for (var b = 0; b < blocks.length; b++){
//                if (x_pos > blocks[0] && x_pos < blocks[1]
//                    && y_pos > blocks[2] && y_pos < blocks[3]){
//                        nodes[r][c][0] = false;
//                }
//            }
//
//            if(nodes[r][c][0]){
//                nodes[r][c][2] = Number.MAX_VALUE;
//                nodes[r][c][3] = distance([x_pos, y_pos], [person.personX, person.personY]);
//                nodes[r][c][4] = [0, 0];
//                nodes[r][c][5] = false;
//            }
//        }
//    }

//grid[extend_node[0]][extend_node[1]][5] = false;
//        
//        if(extend_node != goal_tile){
//            for(var r_var = -1; r_var <= 1; r_var++){
//                for(var c_var = -1; c_var <= 1; c_var++){
//                    var r_dex = Math.min(Math.max(0, extend_node[0] + r_var), 59);
//                    var c_dex = Math.min(Math.max(0, extend_node[1] + c_var), 59);
//                    if((r_dex != extend_node[0] || c_dex != extend_node[1]) && nodes[r_dex][c_dex][0]){
//                        var next_node = nodes[r_dex][c_dex];
//                        if (r_dex == r){
//                            var add_dist = y_len;
//                        }
//                        else if (c_dex == c){
//                            var add_dist = x_len;
//                        }
//                        else{
//                            var add_dist = d_len;
//                        }
//                        var new_dist_to = nodes[extend_node[0]][extend_node[1]][2] + add_dist
//                        if (new_dist_to < next_node[2]) {
//                            next_node[2] = new_dist_to;
//                            next_node[4] = [r, c];
//                            next_node[5] = true;
//                        }
//                    }
//                }
//            }
//        }


    
//    var x_len = Math.abs(x_unit);
//    var y_len = Math.abs(y_unit);
//    var d_len = distance([0,0], [x_unit, y_unit]);
//
//    nodes[0][0][2] = 0;
//    nodes[0][0][5] = true;
//
//    var extend_node = [0, 0];
//    var while_stopper = 0;
//    
//    while(extend_node != [59, 59]){
//        while_stopper++;
//        if(while_stopper > 20000){
//            break;
//        }
//        var least_f = Number.MAX_VALUE;
//        for(var r = 0; r < 60; r++){
//            for(var c = 0; c < 60; c++){
//                if(nodes[r][c][5]){
//                    var f = nodes[r][c][2] + nodes[r][c][3];
//                    if(f < least_f){
//                        least_f = f;
//                        extend_node = [r, c]
//                    }
//                }
//            }
//        }
//
//        nodes[extend_node[0]][extend_node[1]][5] = false;
//        
//        if(extend_node != [59, 59]){
//            for(var r_var = -1; r_var <= 1; r_var++){
//                for(var c_var = -1; c_var <= 1; c_var++){
//                    var r_dex = Math.min(Math.max(0, extend_node[0] + r_var), 59);
//                    var c_dex = Math.min(Math.max(0, extend_node[1] + c_var), 59);
//                    if((r_dex != extend_node[0] || c_dex != extend_node[1]) && nodes[r_dex][c_dex][0]){
//                        var next_node = nodes[r_dex][c_dex];
//                        if (r_dex == r){
//                            var add_dist = y_len;
//                        }
//                        else if (c_dex == c){
//                            var add_dist = x_len;
//                        }
//                        else{
//                            var add_dist = d_len;
//                        }
//                        var new_dist_to = nodes[extend_node[0]][extend_node[1]][2] + add_dist
//                        if (new_dist_to < next_node[2]) {
//                            next_node[2] = new_dist_to;
//                            next_node[4] = [r, c];
//                            next_node[5] = true;
//                        }
//                    }
//                }
//            }
//        }
//    }

// Test makeAGrid
function test_makeAGrid(){
    if (JSON.stringify(makeAGrid(1, 1)) == JSON.stringify([[Array(6)]]) &&
       (JSON.stringify(makeAGrid(3, 3)) == JSON.stringify([[Array(6), Array(6), Array(6)],
                                                           [Array(6), Array(6), Array(6)],
                                                           [Array(6), Array(6), Array(6)]])) &&
       (JSON.stringify(makeAGrid(2, 3)) == JSON.stringify([[Array(6), Array(6), Array(6)],
                                                           [Array(6), Array(6), Array(6)]])) &&
       (JSON.stringify(makeAGrid(3, 2)) == JSON.stringify([[Array(6), Array(6)],
                                                           [Array(6), Array(6)],
                                                           [Array(6), Array(6)]]))){
        console.log("pass");
    }
    else{
        console.log("fail");
    }
}

function test_prepAGrid(){
    var MAX = Number.MAX_VALUE;
    var card = 1;
    var diag = Math.sqrt(2);
    
    var grid = makeAGrid(2, 3);
    prepAGrid(grid, [1, 1], [[0, 0, 0], [0, 0, 0]]);
    var func_test = JSON.stringify(grid);
    var control = JSON.stringify([[[true, [0,0], MAX, diag, [0, 0], false], [true, [0,1], MAX, card, [0, 0], false], [true, [0,2], MAX, diag, [0, 0], false]],
                              [[true, [1,0], MAX, card, [0, 0], false], [true, [1,1], MAX, 0, [0, 0], false], [true, [1,2], MAX, card, [0, 0], false]]]);
    if (func_test == control){
        console.log("pass");
    }
    else{
        console.log("fail");
    }
}