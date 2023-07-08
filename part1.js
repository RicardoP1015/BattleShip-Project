const readline = require('readline-sync');

let board = new Set();
let strikes = new Set();

function generateLocation() {
    const letters = ['A', 'B', 'C'];
    let letter = letters[Math.floor(Math.random()*letters.length)];
    let number = Math.floor(Math.random()*3) + 1;
    return `${letter}${number}`;
};

function isValidInput(input) {
    const validInputs = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3'];
    return validInputs.includes(input.toUpperCase());
};

function gameLoop() {
    while(board.size > 0) {
        let strike = readline.question("Enter a location to strike ie 'A2': ");
        while(!isValidInput(strike)) {
            console.log("Wrong input, try again.");
            gameLoop();
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

function initGame() {
    board.clear();
    strikes.clear();
    for(let i = 0; i < 2; i++) {
        let location = generateLocation();
        while (board.has(location)) {
            location = generateLocation();
        };
        board.add(location);
    }
    readline.question('Press any key to start the game.');
    gameLoop();
};

// Kick off the game
initGame();
