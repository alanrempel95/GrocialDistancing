//following comment lines are linter instructions
/* eslint-env browser*/
/*jslint browser: true*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var bkgrnd = document.getElementById("background");
var bgctx = bkgrnd.getContext("2d");

canvas.width = document.documentElement.clientWidth - 50;
canvas.height = document.documentElement.clientHeight - 100;

bkgrnd.width = document.documentElement.clientWidth - 50;
bkgrnd.height = document.documentElement.clientHeight - 100;

ctx.imageSmoothingEnabled = false;
bgctx.imageSmoothingEnabled = false;

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
}, false);

canvas.addEventListener('mouseup', function (event) {
    "use strict";
    groceryMap.isDragging = false;
    generateMapBlock(); //update paragraph when user finishes line 
}, false);

//initialize background/floor
function populateMap() {
    "use strict";
    var k, l, i, j = 0;
    //array of tile classifications
    groceryMap.floorPlan = new Array(groceryMap.tilesHigh);
    for (k = 0; k < groceryMap.floorPlan.length; k++) {
        groceryMap.floorPlan[k] = new Array(groceryMap.tilesWide);
    }
    
    //array of floor colors so nobody has a seizure
    groceryMap.floorColor = new Array(groceryMap.tilesHigh);
    for (l = 0; l < groceryMap.floorColor.length; l++) {
        groceryMap.floorColor[l] = new Array(groceryMap.tilesWide);
    }
    
    for (i = 0; i < groceryMap.tilesHigh; i++) {
        for (j = 0; j < groceryMap.tilesWide; j++) {
            //floor is different shades of light gray
            groceryMap.floorColor[i][j] = 255 - Math.random() * 50;
            
            if (Math.random() < 1) { //set to less than one to make other color randomly            
                groceryMap.floorPlan[i][j] = "floor";
            } else {
                groceryMap.floorPlan[i][j] = "unspecified";
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
    for (i = 0; i < groceryMap.tilesHigh; i++) {
        for (j = 0; j < groceryMap.tilesWide; j++) {
            bgctx.beginPath();
            bgctx.rect(i * groceryMap.tileSize, j * groceryMap.tileSize, groceryMap.tileSize, groceryMap.tileSize);
            tileType = groceryMap.floorPlan[i][j];
            
            switch (tileType) {
            case "floor":
                bgColor = groceryMap.floorColor[i][j];
                bgctx.fillStyle = "rgb(" + bgColor + ", " + bgColor + ", " + bgColor + ")";
                break;
            case "wall":
                bgctx.fillStyle = "green";
                break;
            case "unspecified":
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

        groceryMap.floorPlan[k][l] = "wall";
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
        handlePerson(groceryMap.tilesWide * groceryMap.tileSize, groceryMap.tilesHigh * groceryMap.tileSize, groceryMap.People[i]);
        ctx.beginPath();
        ctx.arc(groceryMap.People[i].personX, groceryMap.People[i].personY, groceryMap.People[i].personRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle = "purple";
        ctx.fill();
    }
}

//from existing map, generates static array we can copy into program
function generateMapBlock() {
    "use strict";
    var i, j = 0,
        pText = "[[",
        debugP = document.getElementById("debug"),
        tempText = "";
    for (i = 0; i < groceryMap.tilesHigh; i++) {
        for (j = 0; j < groceryMap.tilesWide; j++) {
            tempText = groceryMap.floorPlan[i][j];
            pText += "\"" + tempText + "\"";
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
    debugP.innerHTML = pText;
}

//clear, update, target 60 fps by default
function gameLoop() {
    "use strict";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    userPopulateMap();
    showCursor();
    drawGrid();
    drawPerson();
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
//functions here run once at the start
populateMap();
createPeople();
//drawGrid();
