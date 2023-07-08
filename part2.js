const readline = require('readline-sync');

let board = {
    locations: new Set(),
    ships: []
};

let strikes = new Set();
const letterBoard = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const numberBoard = [];

class Ship {
    constructor(size) {
        this.size = size;
        this.positions = new Set();
    };

    isSunk() {
        return this.positions.size === 0;
    };
}

const generateBoardNumbers = (num) => {
    for (let i = 1; i <= num; i++) {
        numberBoard.push(i);
    };
};

const generateShip = (size) => {
    const ship = new Ship(size);
    let startLocation;
    let direction;

    do {
        startLocation = generateLocation();
        direction = Math.floor(Math.random() * 2);

        let startLetterIndex = letterBoard.indexOf(startLocation[0]);
        let startNumberIndex = numberBoard.indexOf(parseInt(startLocation.slice(1)));

        if (direction === 0 && startNumberIndex + size > numberBoard.length) continue;
        if (direction === 1 && startLetterIndex + size > letterBoard.length) continue;

        for (let i = 0; i < size; i++) {
            let position;

            if (direction === 0) {
                position = startLocation[0] + (parseInt(startLocation.slice(1)) + i);
            } else {
                position = letterBoard[startLetterIndex + i] + startLocation.slice(1);
            };

            if (!board.locations.has(position)) {
                ship.positions.add(position);
            } else {
                ship.positions.clear();
                break;
            };
        };

    } while (ship.positions.size < size);

    for (let position of ship.positions) {
        board.locations.add(position);
    }

    return ship;
};


const generateLocation = () => {
    let letter = letterBoard[Math.floor(Math.random() * letterBoard.length)];
    let number = numberBoard[Math.floor(Math.random() * numberBoard.length)];
    return `${letter}${number}`;
};

const isValidInput = (input) => {
    const letter = input[0].toUpperCase();
    const number = parseInt(input.slice(1, input.length));
    return letterBoard.includes(letter) && numberBoard.includes(number);
};

const gameLoop = () => {
    while (board.ships.some(ship => !ship.isSunk())) {
        let strike = readline.question("Enter a location to strike ie 'A2': ");
        while (!isValidInput(strike)) {
            console.log("Wrong input, try again.");
            strike = readline.question("Enter a location to strike ie 'A2': ");
        };

        if (strikes.has(strike)) {
            console.log("You have already picked this location. Miss!");
            continue;
        };

        strikes.add(strike);

        let hitDetected = false;
        for (let ship of board.ships) {
            if (ship.positions.has(strike)) {
                ship.positions.delete(strike);
                hitDetected = true;
                if (ship.isSunk()) {
                    console.log(`Hit. You have sunk a battleship. ${board.ships.filter(ship => !ship.isSunk()).length} ship(s) remaining.`);
                } else {
                    console.log("Hit.");
                };
                break;
            };
        };

        if (!hitDetected) {
            console.log("You missed!");
        };
    };

    if (readline.keyInYN("You have destroyed all battleships. Would you like to play again?")) {
        initGame();
    } else {
        console.log("Thanks for playing!");
        process.exit();
    };
};

const initGame = () => {
    let size = readline.question('Enter the size of the board (3-10): ');
    size = parseInt(size);

    while (isNaN(size) || size < 3 || size > 10) {
        console.log("Invalid input, please choose a number between 3 and 10");
        size = readline.question('Enter the size of the board (3-10): ');
        size = parseInt(size);
    };

    board.locations.clear();
    strikes.clear();
    numberBoard.length = 0;
    letterBoard.length = 0;

    generateBoardNumbers(size);
    for (let i = 0; i < size; i++) {
        letterBoard.push(String.fromCharCode(65 + i));
    };


    switch (size) {
        case 3:
            board.ships.push(generateShip(1), generateShip(1), generateShip(1));
            break;
        case 4:
        case 5:
        case 6:
            board.ships.push(generateShip(2), generateShip(2), generateShip(2), generateShip(2));
            break;
        case 7:
        case 8:
            board.ships.push(generateShip(2), generateShip(2), generateShip(3), generateShip(3));
            break;
        case 9:
        case 10:
            board.ships.push(generateShip(1), generateShip(2), generateShip(3), generateShip(3), generateShip(4), generateShip(5));
            break;
    };

    readline.question('Press any key to start the game.');
    gameLoop();
};

// Kick off the game
initGame();
