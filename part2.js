const readline = require('readline-sync');

let board = new Set();
let strikes = new Set();

const valInputsOp = [ ['A1', 'A2', 'A3'], ['B1', 'B2', 'B3'], ['C1', 'C2', 'C3'], ['D1', 'D2', 'D3'], ['E1', 'E2', 'E3'], ['F1', 'F2', 'F3'], ['G1', 'G2', 'G3'], ['H1', 'H2', 'H3'], ['I1', 'I2', 'I3']];
const validNumbers = [3,4,5,6,7,8,9,10];
const valInputs = []
const letterBoard = []; 
const numberBoard = [];

const lettSize = (size) => {
    const lettBoard = ['A', 'B', 'C', 'D', 'E', 'F', 'J', 'H', 'I'];
    for (let i = 0; i < size; i++) {
        if(i < lettBoard.length) {
            letterBoard.push(lettBoard[i]);
        } else {
            console.log(`Size requested exceeds lettBoard length. Maximum size is ${lettBoard.length}`);
            break;
        };
    };
};

const validNum = (num) => {
    if (validNumbers.includes(num)) {
        numberBoard.push(num);
    };
};

const boardSizeMaker = (size) => {
    if (validNumbers.includes(size)) {
        lettSize(size);
        validNum(size);
        validBoard(size);
    } else {
        console.log('Wrong input please pick a number from 3 to 10');
        initGame();
    };
};

const generateLocation = () => {
    const letters = letterBoard;
    let letter = letters[Math.floor(Math.random()*letters.length)];
    let number = Math.floor(Math.random()*numberBoard.length) + 1;
    return `${letter}${number}`;
};

const boardSize = (size) => {
    for(let i = 0; i < size; i++) {
        let location = generateLocation();
        while (board.has(location)) {
            location = generateLocation();
        };
        board.add(location);
    };
};

const validBoard = (size) => {
    for (let i = 0; i < size; i++) {
        valInputs.push(...valInputsOp[i]);
    };
};

const isValidInput = (input) => {
    const validInputs = valInputs;
    return validInputs.includes(input.toUpperCase());
};

const gameLoop = () => {
    while(board.size > 0) {
        let strike = readline.question("Enter a location to strike ie 'A2': ");
        while(!isValidInput(strike)) {
            console.log("Wrong input, try again.");
            strike = readline.question("Enter a location to strike ie 'A2': ");
        };
        if(strikes.has(strike)) {
            console.log("You have already picked this location. Miss!");
            continue;
        };

        strikes.add(strike);
        
        if(board.has(strike)) {
            board.delete(strike);
            console.log(`Hit. You have sunk a battleship. ${board.size} ship(s) remaining.`);
        } else {
            console.log("You have missed!");
        };
    };

    if(readline.keyInYN("You have destroyed all battleships. Would you like to play again?")) {
        initGame();
    } else {
        console.log("Thanks for playing!");
        process.exit();
    };
};

const initGame = () => {
    board.clear();
    strikes.clear();
    let size = readline.question('Enter the size of the board: ');
    size = parseInt(size);
    boardSizeMaker(size);
    boardSize(size);
    readline.question('Press any key to start the game.');
    gameLoop();
};

// Kick off the game
initGame();