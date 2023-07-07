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
    }

    isSunk() {
        return this.positions.size === 0;
    }
}

const generateBoardNumbers = (num) => {
    for (let i = 1; i <= num; i++) {
        numberBoard.push(i);
    }
};

const generateShip = (size) => {
    const ship = new Ship(size);
    while (ship.positions.size < size) {
        let location = generateLocation();
        if (!board.locations.has(location)) {
            board.locations.add(location);
            ship.positions.add(location);
        }
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
    const number = parseInt(input.slice(1));
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

    if (size < 3 || size > 10) {
        console.log("Wrong input, please choose a number between 3 and 10");
        initGame();
    };

    board.locations.clear();
    strikes.clear();
    numberBoard.length = 0;

    generateBoardNumbers(size);
    letterBoard.splice(size);

    switch (size) {
        case 3:
            board.ships.push(generateShip(2), generateShip(2));
            break;
        case 4:
        case 5:
        case 6:
            board.ships.push(generateShip(2), generateShip(2), generateShip(2));
            break;
        case 7:
        case 8:
            board.ships.push(generateShip(1), generateShip(2), generateShip(2), generateShip(3));
            break;
        case 9:
        case 10:
            board.ships.push(generateShip(2), generateShip(3), generateShip(3), generateShip(4), generateShip(5));
            break;
    }

    readline.question('Press any key to start the game.');
    gameLoop();
};

// Kick off the game
initGame();
