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