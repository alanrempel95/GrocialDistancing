//following comment lines are linter instructions
/* eslint-env browser*/
/*jslint browser: true*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var bkgrnd = document.getElementById("background");
var bgctx = bkgrnd.getContext("2d");

//set margin to -half_width and left:50% to vertically center
canvas.width = groceryMap.tilesWide * groceryMap.tileSize;
canvas.height = groceryMap.tilesHigh * groceryMap.tileSize;
canvas.style.marginLeft = "-" + canvas.width / 2 + "px";

bkgrnd.width = groceryMap.tilesWide * groceryMap.tileSize;
bkgrnd.height = groceryMap.tilesHigh * groceryMap.tileSize;
bkgrnd.style.marginLeft = "-" + bkgrnd.width / 2 + "px";

ctx.imageSmoothingEnabled = false;
bgctx.imageSmoothingEnabled = false;

//element below absolute positioned canvases needs top margin offset
var bottomDiv = document.getElementById("bottom");
bottomDiv.style.marginTop = 20 + canvas.height + "px";

//i hate event handling - store mouse position in global
canvas.addEventListener('mousemove', function (event) {
    "use strict";
    var rect = canvas.getBoundingClientRect();
    groceryMap.mouseX = event.clientX - rect.left;
    groceryMap.mouseY = event.clientY - rect.top;
}, false);

canvas.addEventListener('mousedown', function (event) {
    "use strict";
    groceryMap.isDragging = true;
    groceryMap.mouseButton = event.button;
}, false);

canvas.addEventListener('mouseup', function (event) {
    "use strict";
    groceryMap.isDragging = false;
    groceryMap.mouseButton = -1; //reset button index 
    //generateMapBlock(); //update paragraph when user finishes line 
}, false);

//disable right click menu in the canvas elements
canvas.addEventListener("contextmenu", function (event) {
    event.preventDefault();
    return false;
}, false);

function toggleScreen() {
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

function showMap(mySelection) {
    "use strict";
    switch (mySelection) {
    case 1:
        groceryMap.floorPlan = map1.map(function (arr) {
            return arr.slice();
        });
        changeMode(2);
        break;
    default:
        groceryMap.floorPlan = map1.map(function (arr) {
            return arr.slice();
        });
    }
}

//initialize background/floor
function populateMap() {
    "use strict";
    var k, l, i, j = 0;
    //array of tile classifications
    groceryMap.floorPlan = new Array(groceryMap.tilesWide);
    for (k = 0; k < groceryMap.floorPlan.length; k++) {
        groceryMap.floorPlan[k] = new Array(groceryMap.tilesHigh);
    }
    
    //array of floor colors so nobody has a seizure
    groceryMap.floorColor = new Array(groceryMap.tilesWide);
    for (l = 0; l < groceryMap.floorColor.length; l++) {
        groceryMap.floorColor[l] = new Array(groceryMap.tilesHigh);
    }
    
    for (i = 0; i < groceryMap.tilesWide; i++) {
        for (j = 0; j < groceryMap.tilesHigh; j++) {
            //floor is different shades of light gray
            groceryMap.floorColor[i][j] = 255 - Math.random() * 50;
            
            if (Math.random() < 1) { //set to less than one to make other color randomly            
                groceryMap.floorPlan[i][j] = 0; //floor
            } else {
                groceryMap.floorPlan[i][j] = 2; //idk not floor or wall
            }
        }
    }
}

//function to fill colors based on contents of groceryMap arrays
function drawGrid() {
    "use strict";
    var i, j = 0,
        bgColor = 128,
        tileType = "";
    for (i = 0; i < groceryMap.tilesWide; i++) {
        for (j = 0; j < groceryMap.tilesHigh; j++) {
            bgctx.beginPath();
            bgctx.rect(i * groceryMap.tileSize, j * groceryMap.tileSize, groceryMap.tileSize, groceryMap.tileSize);
            tileType = groceryMap.floorPlan[i][j];
            
            switch (tileType) {
            case 0:
                bgColor = groceryMap.floorColor[i][j];
                bgctx.fillStyle = "rgb(" + bgColor + ", " + bgColor + ", " + bgColor + ")";
                break;
            case 1:
                bgctx.fillStyle = "green";
                break;
            case 2:
                bgctx.fillStyle = "blue";
                break;
            default:
                bgctx.fillStyle = "black";
            }
            bgctx.fill();
        }
    }
}

//clicking and dragging will draw solid objects
function userPopulateMap() {
    "use strict";
    var k, l = 0;
    if (groceryMap.isDragging) {
        k = Math.floor(groceryMap.mouseX / groceryMap.tileSize);
        l = Math.floor(groceryMap.mouseY / groceryMap.tileSize);
        
        if (groceryMap.mouseButton === 0) {
            groceryMap.floorPlan[k][l] = 1; //wall
        } else if (groceryMap.mouseButton === 2) {
            groceryMap.floorPlan[k][l] = 2; //idk something else
        }
    }
}

//draw square at cursor
function showCursor() {
    "use strict";
    var k, l = 0;
    k = Math.floor(groceryMap.mouseX / groceryMap.tileSize) * groceryMap.tileSize;
    l = Math.floor(groceryMap.mouseY / groceryMap.tileSize) * groceryMap.tileSize;
    //console.log(groceryMap.mouseX);
    //console.log(k);
    ctx.beginPath();
    ctx.rect(k, l, groceryMap.tileSize, groceryMap.tileSize);
    ctx.fillStyle = "red";
    ctx.fill();
}

function drawPerson() {
    "use strict";
    var i = 0;
    for (i = 0; i < groceryMap.numberOfPeople; i++) {
        handlePerson(groceryMap.tilesHigh * groceryMap.tileSize, groceryMap.tilesWide * groceryMap.tileSize, groceryMap.People[i]);
        ctx.beginPath();
        ctx.arc(groceryMap.People[i].personX, groceryMap.People[i].personY, groceryMap.People[i].personRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "purple";
        ctx.fill();
    }
}

function debuggy(myHTML) {
    var debugP = document.getElementById("debug");
    debugP.innerHTML = myHTML;
}

//from existing map, generates static array we can copy into program
function toggleMapBlock() {
    "use strict";
    var i, j = 0,
        pText = "[[",
        tempText = "";
    for (i = 0; i < groceryMap.tilesHigh; i++) {
        for (j = 0; j < groceryMap.tilesWide; j++) {
            tempText = groceryMap.floorPlan[j][i];
            pText += tempText;
            if (j === groceryMap.tilesWide - 1) {
                if (i === groceryMap.tilesHigh - 1) {
                    pText += "]]"; //last thing
                } else {
                    pText += "],<br />["; //end of row
                }
            } else {
                pText += ", "; //continuation of row
            }
        }
    }
    if (groceryMap.showGrid) {
        debuggy(pText);
    } else {
        debuggy("no map");
    }
    groceryMap.showGrid = !groceryMap.showGrid;
}

//clear, update, target 60 fps by default
function gameLoop() {
    "use strict";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (groceryMap.mode === "user") {
        userPopulateMap();
        showCursor();
    }
    drawGrid();
    drawPerson();
    window.requestAnimationFrame(gameLoop);
}

//function to apply parameters and begin simulation
function startSimulation() {
    var populationBox = document.getElementById("population");
    var distanceBox = document.getElementById("distance");
    var otherBox = document.getElementById("placeholder");
    groceryMap.maxShoppers = parseInt(populationBox.value);
    groceryMap.targetSeparation = parseFloat(distanceBox.value);
    groceryMap.otherThing = otherBox.value;
    testAStar();
}

window.requestAnimationFrame(gameLoop);
//functions here run once at the start
populateMap();
createPeople();
//testAStar();
//drawGrid();
