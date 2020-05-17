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

//global object
var groceryMap = {
    tileSize: 30,
    tilesHigh: 30,
    tilesWide: 20,
    mouseX: 0,
    mouseY: 0,
    isDragging: false
};

//template for people - @Jordan feel free to change
var personTemp = {
    personRadius: 15,
    personX: 300,
    personY: 300
};

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

//@jordan - this one's all you. Mockup function only
function handlePerson() {
    "use strict";
    var maxX, maxY, velX, velY = 0;
    
    maxX = groceryMap.tilesWide * groceryMap.tileSize;
    maxY = groceryMap.tilesHigh * groceryMap.tileSize;
    velX = 5 - 10 * Math.random();
    velY = 5 - 10 * Math.random();
    if (personTemp.personX > 0 && personTemp.personX < maxX) {
        personTemp.personX = personTemp.personX + velX;
    }
    if (personTemp.personY > 0 && personTemp.personY < maxY) {
        personTemp.personY = personTemp.personY + velY;
    }
    personTemp.personX = Math.max(1, personTemp.personX);
    personTemp.personX = Math.min(maxX - 1, personTemp.personX);
    personTemp.personY = Math.max(1, personTemp.personY);
    personTemp.personY = Math.min(maxY - 1, personTemp.personY);
    
    ctx.beginPath();
    ctx.arc(personTemp.personX, personTemp.personY, personTemp.personRadius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "purple";
    ctx.fill();
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
            tempText = groceryMap.floorPlan[i][j]
            pText += "\"" + tempText + "\""
            if (j === groceryMap.tilesWide - 1) {
                if (i === groceryMap.tilesHigh - 1) {
                    pText += "]]"; //last thing
                } else {
                    pText += "], ["; //end of row
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
    handlePerson();
    window.requestAnimationFrame(gameLoop);
}

window.requestAnimationFrame(gameLoop);
populateMap();
//drawGrid();
