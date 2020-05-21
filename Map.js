import {map1, map2} from "./globals.js";
export default class storeMap {
    constructor(tileSize, tilesWide, tilesHigh) {
        this.tileSize = tileSize;
        this.tilesWide = tilesWide;
        this.tilesHigh = tilesHigh;
        this.list = [];
        this.floorPlan = [];
        this.floorColor = [];
        this.goals = [];
    }
    populateMap() {
        //function to initialize map tiles and floor colors
        "use strict";
        var k = 0,
            l = 0,
            i = 0,
            j = 0;
        //array of tile classifications
        for (k = 0; k < this.tilesWide; k += 1) {
            this.floorPlan[k] = [];
        }
        //array of floor colors so nobody has a seizure
        for (l = 0; l < this.tilesWide; l += 1) {
            this.floorColor[l] = [];
        }

        for (i = 0; i < this.tilesWide; i += 1) {
            for (j = 0; j < this.tilesHigh; j += 1) {
                //floor is different shades of light gray
                this.floorColor[i][j] = 255 - Math.random() * 50;

                if (Math.random() < 1) { //set to less than one to make other color randomly            
                    this.floorPlan[i][j] = 0; //floor
                } else {
                    this.floorPlan[i][j] = 2; //idk not floor or wall
                }
            }
        }
    }
    drawGrid(myCanvas) {
        //function to fill colors based on contents of map arrays
        "use strict";
        var i, j = 0,
            bgColor = 128,
            tileType = "";
        for (i = 0; i < this.tilesWide; i += 1) {
            for (j = 0; j < this.tilesHigh; j += 1) {
                myCanvas.beginPath();
                myCanvas.rect(i * this.tileSize, j * this.tileSize, this.tileSize, this.tileSize);
                tileType = this.floorPlan[i][j];

                switch (tileType) {
                case 0:
                    bgColor = this.floorColor[i][j];
                    myCanvas.fillStyle = "rgb(" + bgColor + ", " + bgColor + ", " + bgColor + ")";
                    break;
                case 1:
                    myCanvas.fillStyle = "green";
                    break;
                case 2:
                    myCanvas.fillStyle = "blue";
                    break;
                default:
                    myCanvas.fillStyle = "black";
                }
                myCanvas.fill();
            }
        }
    }
    
    showMap(mySelection) {
        "use strict";
        var myMap;
        switch (mySelection) {
        case 1:
            myMap = map1;
            break;
        case 2:
            myMap = map2;
            break;
        default:
            myMap = map1;
        }
        this.floorPlan = myMap.map(function (arr) {
            return arr.slice();
        });
        //changeMode(2);
    }
    
    get_goals() {
        "use strict";
        var i = 0,
            j = 0;
        for (i = 0; i < this.tilesWide; i += 1) {
            for (j = 0; j < this.tilesHigh; j += 1) {
                if (this.floorPlan[i][j] === 2) {
                    this.goals.push([i, j]);
                }
            }
        }
    }
}