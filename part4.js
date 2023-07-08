const readline = require('readline-sync');

let playerBoard = {
    locations: new Set(),
    ships: []
};

let computerBoard = {
    locations: new Set(),
    ships: []
};

let playerStrikes = new Set();
let computerStrikes = new Set();
const letterBoard = [];
const numberBoard = [];
let playerDisplayBoard = [];
let computerDisplayBoard = [];

class Ship {
    constructor(size) {
        this.size = size;
        this.positions = new Set();
    };

    isSunk() {
        return this.positions.size === 0;
    };
};

const generateBoardNumbers = (num) => {
    for (let i = 1; i <= num; i++) {
        numberBoard.push(i);
    };
};

const initializeGameBoard = (size) => {
    playerDisplayBoard = Array(size).fill().map(() => Array(size).fill(' '));
    computerDisplayBoard = Array(size).fill().map(() => Array(size).fill(' '));
};

const generateShip = (size, board) => {
    const ship = new Ship(size);
    while (ship.positions.size < size) {
        let location = generateLocation();
        if (!board.locations.has(location)) {
            board.locations.add(location);
            ship.positions.add(location);
        };
    };

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

const updateGameBoard = (strike, isHit, gameBoard) => {
    const letterIndex = letterBoard.indexOf(strike[0].toUpperCase());
    const numberIndex = parseInt(strike.slice(1, strike.length)) - 1;
    gameBoard[letterIndex][numberIndex] = isHit ? 'X' : 'O';
};

const printGameBoard = (gameBoard) => {
    console.log('  ' + numberBoard.join('|'));
    for (let i = 0; i < gameBoard.length; i++) {
        console.log(letterBoard[i] + '|' + gameBoard[i].join('|'));
    };
};

const printBothGameBoards = () => {
    console.log("\nComputer's Board");
    printGameBoard(computerDisplayBoard);
    console.log("\nPlayer's Board");
    printGameBoard(playerDisplayBoard);
};

const computerMove = () => {
    let strike = generateLocation();
    while (playerStrikes.has(strike)) {
        strike = generateLocation();
    };

    let hitDetected = false;
    for (let ship of playerBoard.ships) {
        if (ship.positions.has(strike)) {
            ship.positions.delete(strike);
            hitDetected = true;
            if (ship.isSunk()) {
                console.log(`Computer hit. It has sunk your battleship. ${playerBoard.ships.filter(ship => !ship.isSunk()).length} ship(s) remaining.`);
            } else {
                console.log("Computer hit.");
            };

            break;
        };
    };

    if (!hitDetected) {
        console.log("Computer missed!");
    };

    updateGameBoard(strike, hitDetected, playerDisplayBoard);
};

const gameLoop = () => {
    while (playerBoard.ships.some(ship => !ship.isSunk()) && computerBoard.ships.some(ship => !ship.isSunk())) {
        let strike = readline.question("Enter a location to strike ie 'A2': ");
        while (!isValidInput(strike)) {
            console.log("Wrong input, try again.");
            strike = readline.question("Enter a location to strike ie 'A2': ");
        };

        if (playerStrikes.has(strike)) {
            console.log("You have already picked this location. Miss!");
            continue;
        }

        playerStrikes.add(strike);

        let hitDetected = false;
        for (let ship of computerBoard.ships) {
            if (ship.positions.has(strike)) {
                ship.positions.delete(strike);
                hitDetected = true;
                if (ship.isSunk()) {
                    console.log(`Hit. You have sunk a battleship. ${computerBoard.ships.filter(ship => !ship.isSunk()).length} ship(s) remaining.`);
                } else {
                    console.log("Hit.");
                };
                break;
            };
        };

        if (!hitDetected) {
            console.log("You missed!");
        };

        updateGameBoard(strike, hitDetected, computerDisplayBoard);
        computerMove();
        printBothGameBoards();
    };

    if (playerBoard.ships.every(ship => ship.isSunk())) {
        console.log("Computer has destroyed all your battleships. You lost the game.");
    } else {
        console.log("You have destroyed all computer's battleships. You won the game.");
    };

    if (readline.keyInYN("Would you like to play again?")) {
        initGame();
    } else {
        console.log("Thanks for playing!");
        process.exit();
    };
};

const generateShipsBasedOnBoardSize = (board) => {
    let size = numberBoard[numberBoard.length - 1];
    switch (size) {
        case 3:
            board.ships.push(generateShip(1, board), generateShip(1, board), generateShip(1, board));
            break;
        case 4:
        case 5:
        case 6:
            board.ships.push(generateShip(2, board), generateShip(2, board), generateShip(2, board));
            break;
        case 7:
        case 8:
            board.ships.push(generateShip(2, board),generateShip(2, board), generateShip(3, board), generateShip(3, board));
            break;
        case 9:
        case 10:
            board.ships.push(generateShip(1, board), generateShip(2, board), generateShip(3, board), generateShip(3, board), generateShip(4, board), generateShip(5, board));
            break;
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

    playerBoard.locations.clear();
    computerBoard.locations.clear();
    playerStrikes.clear();
    computerStrikes.clear();
    numberBoard.length = 0;
    letterBoard.length = 0;

    generateBoardNumbers(size);
    for (let i = 0; i < size; i++) {
        letterBoard.push(String.fromCharCode(65 + i));
    };

    initializeGameBoard(size);

    generateShipsBasedOnBoardSize(playerBoard);
    generateShipsBasedOnBoardSize(computerBoard);

    readline.question('Press any key to start the game.');
    printBothGameBoards();
    gameLoop();
};

initGame();
