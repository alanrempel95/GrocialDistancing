//following comment lines are linter instructions
/* eslint-env browser*/
/*jslint browser: true*/
import Person from "./Person.js";
import {groceryMap} from "./globals.js";
//import {createPeople} from "./pathfinding.js";
import storeMap from "./Map.js";

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var bkgrnd = document.getElementById("background");
var bgctx = bkgrnd.getContext("2d");

function debuggy(myHTML) {
    "use strict";
    var debugP = document.getElementById("debug");
    debugP.innerHTML = myHTML;
}

function setupCanvas(config, currentMap) {
    //set margin to -half_width and left:50% to vertically center
    canvas.width = currentMap.tilesWide * currentMap.tileSize;
    canvas.height = currentMap.tilesHigh * currentMap.tileSize;
    canvas.style.marginLeft = "-" + canvas.width / 2 + "px";

    bkgrnd.width = currentMap.tilesWide * currentMap.tileSize;
    bkgrnd.height = currentMap.tilesHigh * currentMap.tileSize;
    bkgrnd.style.marginLeft = "-" + bkgrnd.width / 2 + "px";

    ctx.imageSmoothingEnabled = false;
    bgctx.imageSmoothingEnabled = false;

    //element below absolute positioned canvases needs top margin offset
    var bottomDiv = document.getElementById("bottom");
    bottomDiv.style.marginTop = 20 + canvas.height + "px";

    canvas.addEventListener('mousemove', function (event) {
        //i hate event handling - store mouse position in global
        "use strict";
        var rect = canvas.getBoundingClientRect();
        config.mouseX = event.clientX - rect.left;
        config.mouseY = event.clientY - rect.top;
    }, false);

    canvas.addEventListener('mousedown', function (event) {
        "use strict";
        config.isDragging = true;
        config.mouseButton = event.button;
    }, false);

    canvas.addEventListener('mouseup', function (event) {
        "use strict";
        config.isDragging = false;
        config.mouseButton = -1; //reset button index 
    }, false);


    canvas.addEventListener("contextmenu", function (event) {
        //disable right click menu in the canvas elements
        "use strict";
        event.preventDefault();
        return false;
    }, false);
    
    //link non-map related buttons
    document.querySelector("#toggleMapBlock").addEventListener('click', toggleMapBlock);
    document.querySelector("#toggleScreen").addEventListener('click', toggleScreen);
    document.querySelector("#startSimulation").addEventListener('click', startSimulation);
    
    //input copyright
    debuggy(config.copyright);
}

function linkButtons(currentMap) {
    //function to add javascript to buttons - must run after map is initialized
    document.querySelector("#changeMode").addEventListener('click', changeMode(1));
    document.querySelector("#populateMap").addEventListener('click', currentMap.populateMap);
    document.querySelector("#showMap").addEventListener('click', currentMap.showMap(2));
}

function toggleScreen() {
    "use strict";
    var elem = document.documentElement;
    if (document.fullscreenElement === null) {
        elem.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

function changeMode(myMode) {
    "use strict";
    if (myMode === 1) {
        groceryMap.mode = "user";
    } else {
        groceryMap.mode = "fixed";
    }
}

function userPopulateMap(config, currentMap) {
    //clicking and dragging will draw solid objects
    "use strict";
    var k, l = 0;
    if (config.isDragging) {
        k = Math.floor(config.mouseX / currentMap.tileSize);
        l = Math.floor(config.mouseY / currentMap.tileSize);
        
        if (config.mouseButton === 0) {
            currentMap.floorPlan[k][l] = 1; //wall
        } else if (config.mouseButton === 2) {
            currentMap.floorPlan[k][l] = 2; //idk something else
        }
    }
}

function showCursor(config, currentMap, myCanvas) {
    //draw square at cursor
    "use strict";
    var k, l = 0;
    k = Math.floor(config.mouseX / currentMap.tileSize) * currentMap.tileSize;
    l = Math.floor(config.mouseY / currentMap.tileSize) * currentMap.tileSize;
    myCanvas.beginPath();
    myCanvas.rect(k, l, currentMap.tileSize, currentMap.tileSize);
    myCanvas.fillStyle = "red";
    myCanvas.fill();
}

function toggleMapBlock() {
    toggleMapBlockReal(groceryMap, newMap);
}

function toggleMapBlockReal(config, currentMap) {
    //from existing map, generates static array we can copy into program
    "use strict";
    var i, j = 0,
        pText = "[[",
        tempText = "";
    for (i = 0; i < currentMap.tilesWide; i += 1) {
        for (j = 0; j < currentMap.tilesHigh; j += 1) {
            tempText = currentMap.floorPlan[i][j];
            pText += tempText;
            if (j === currentMap.tilesHigh - 1) {
                if (i === currentMap.tilesWide - 1) {
                    pText += "]]"; //last thing
                } else {
                    pText += "],<br />["; //end of row
                }
            } else {
                pText += ", "; //continuation of row
            }
        }
    }
    if (config.showGrid) {
        debuggy(pText);
    } else {
        debuggy(config.copyright);
    }
    config.showGrid = !config.showGrid;
}

function gameLoop() {
    //clear, update, target 60 fps by default
    "use strict";
    var i = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    newMap.drawGrid(ctx);
    if (groceryMap.mode === "user") {
        userPopulateMap(groceryMap, newMap);
        showCursor(groceryMap, newMap, ctx);
    }
    for (i = 0; i < groceryMap.numberOfPeople; i += 1) {
        groceryMap.People[i].drawPerson(groceryMap, ctx);
    }
    window.requestAnimationFrame(gameLoop);
}

function startSimulation() {
    startSimulationReal(groceryMap, newMap);
}

function startSimulationReal(config, currentMap) {
    //function to apply parameters and begin simulation
    "use strict";
    var populationBox,
        distanceBox,
        otherBox;
    populationBox = document.getElementById("population");
    distanceBox = document.getElementById("distance");
    otherBox = document.getElementById("placeholder");
    config.maxShoppers = parseInt(populationBox.value, 10);
    config.targetSeparation = parseFloat(distanceBox.value);
    config.otherThing = otherBox.value;
    
    currentMap.showMap(2);
    currentMap.get_goals();
    createPeople(config, currentMap);
    
    linkButtons(currentMap);
    
    window.requestAnimationFrame(gameLoop);
}

function createPeople(config, currentMap) {
    "use strict";
    var i = 0,
        myGoal = [0, 0],
        myStart = [0, 0],
        x_coord = 0,
        y_coord = 0,
        entrance = [12, 18],
        myPath,
        g = 0,
        goal = [];
    config.People = new Array(config.numberOfPeople);
    for (i = 0; i < config.numberOfPeople; i += 1) {
        config.People[i] = new Person(currentMap, 15 + 3 * Math.random(), 0, 0);
        
        //Construct grocery list
        config.People[i].grocery_list.push(entrance);
        for (g = 0; g < currentMap.goals.length; g += 1){
            goal = currentMap.goals[g];
            if (Math.random() < 0.5 && JSON.stringify(goal) != JSON.stringify(entrance)) {
                config.People[i].grocery_list.push(goal);
            }
        }
        config.People[i].grocery_list.push(entrance);
        console.log(JSON.stringify(config.People[i].grocery_list))
        
        myStart = config.People[i].grocery_list[0];
        myGoal = config.People[i].grocery_list[1];
        myPath = config.People[i].getAPath(myStart, myGoal);
        
        config.People[i].currentPath = myPath; //this is a reference, copy if needed
        config.People[i].currentPoint = 0; //first element of path
        x_coord = config.People[i].currentPath[0][0];
        y_coord = config.People[i].currentPath[0][1];
        config.People[i].personX = (x_coord + 0.5) * currentMap.tileSize;
        config.People[i].personY = (y_coord + 0.5) * currentMap.tileSize;
        
    }
}

//functions here run once at the start
var newMap = new storeMap(30, 30, 20);
setupCanvas(groceryMap, newMap);
newMap.populateMap();