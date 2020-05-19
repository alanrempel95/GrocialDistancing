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