function Gameboard() {
    const rows = 3;
    const columns = 3;
    
    const board = [];
    
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            row.push(Cell());
        }
        board.push(row);
    }
    
    const getBoard = () => board;
    
    const printBoard = () => {
        const boardWithCellValues = board.map((row) =>
        row.map((cell) => cell.getValue())
        );
        return boardWithCellValues;
    };
    
    const getCellValue = (row, column) => {
        return board[row][column].getValue();
    };
    
    const setCellValue = (row, column, value) => {
        board[row][column].setValue(value);
    };
    
    return { printBoard, getCellValue, setCellValue, getBoard };
}
// printBoard, setCellValue, getBoard, getCellValue

function Cell() {
    let value = " ";
    
    const setValue = (newValue) => {
        value = newValue;
    };
    
    const getValue = () => value;
    
    return {
        setValue,
        getValue,
    };
}
// setValue, getValue,

function gameround(){
    
    let activePlayer = "Player 1";
    
    
    const switchActivePlayer = () => {
        activePlayer = activePlayer === "Player 1" ? "Player 2" : "Player 1";
    };
    
    const getActivePlayer = () => {
        return activePlayer;
    };
    
    return { getActivePlayer, switchActivePlayer, };
}
// getActivePlayer, switchActivePlayer

function checkWin(board) {
    
    // Check rows
    for (let row = 0; row < 3; row++) {
        if (
            board[row][0].getValue() === board[row][1].getValue() &&
            board[row][1].getValue() === board[row][2].getValue() &&
            board[row][0].getValue() !== ' '
            ) {
                return "roWin";
            }
        }
        
        // Check columns
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col].getValue() === board[1][col].getValue() &&
                board[1][col].getValue() === board[2][col].getValue() &&
                board[0][col].getValue() !== ' '
                ) {
                    
                    return "colWin";
                }
            }
            
            // Check diagonals
            if (
                (board[0][0].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][2].getValue() && board[0][0].getValue() !== ' ') ||
                (board[0][2].getValue() === board[1][1].getValue() && board[1][1].getValue() === board[2][0].getValue() && board[0][2].getValue() !== ' ')
                ) {
                    return "diagWin";
                }
                
                // No winning condition found
                return false;
            }
    // returns true or false
            const screenController = (gameboard) => {
                const board = gameboard.getBoard();
                const players = gameround();
                const activePlayer = document.querySelector('.turn');
                activePlayer.textContent = players.getActivePlayer();
                let playerToken = "X";
                
                const createCellDiv = (row, column) => {
                    const cellDiv = document.createElement("div");
                    cellDiv.classList.add("cell");
                    
                    // Check if the cell is empty before setting the cell value
                    if (gameboard.getCellValue(row, column) === " ") {
                        // Set up event listener for cell click
                        cellDiv.addEventListener("click", () => {
                            // Handle cell click event
                            handleCellClick(row, column);
                        });
                    }
                    const cell = board[row][column];
                    cell.cellDiv = cellDiv; // Store a reference to cellDiv in the cell object
                    
                    return cellDiv;
                };
                
                const renderBoard = () => {
                    const container = document.querySelector(".board");
                    container.innerHTML = ""; // Clear existing content
                    
                    for (let row = 0; row < board.length; row++) {
                        for (let column = 0; column < board[row].length; column++) {
                            const cell = board[row][column];
                            const cellDiv = createCellDiv(row, column);
                            cellDiv.textContent = cell.getValue(); // Set the cell value in the div
                            container.appendChild(cellDiv);
                        }
                    }
                };
                
                let winConditionReached = false;

                
                const handleCellClick = (row, column) => {
                    // Check if a win condition has been reached
                    if (winConditionReached) {
                        return; // Exit the function if a win condition has already been reached
                    }
                    if (gameboard.getCellValue(row, column) === " ") {
                        gameboard.setCellValue(row, column, playerToken);
                        renderBoard();
                        const isWin = checkWin(gameboard.getBoard());
                        
                        // Check if there is a win and set the win condition flag
                        if (isWin) {
                            winConditionReached = true;
                            const container = document.querySelector(".container");
                            // Close the game actions
                            const replayButton = document.createElement("button");
                            replayButton.textContent = "Replay ?";
                            replayButton.classList.add("replay");
                            replayButton.addEventListener("click", () => {
                                // Clear the board and restart the game
                                gameboard.getBoard().forEach(row => {
                                    row.forEach(cell => {
                                        cell.setValue(" ");
                                    });
                                });
                                winConditionReached = false;
                                if (playerToken == "O") {
                                    players.switchActivePlayer();
                                    activePlayer.textContent = players.getActivePlayer();
                                    playerToken = "X";}
                                    container.removeChild(replayButton);
                                    container.removeChild(win);
                                renderBoard();
                            });
                            // Append the "Replay" button to the container

                            const win = document.createElement("span");
                            if (isWin == "roWin") {
                                win.textContent = activePlayer.textContent  + " won. Triple " + playerToken + " in row " + parseInt(row + 1);
                                container.appendChild(win);
                            } else if (isWin == "colWin") {
                                win.textContent = activePlayer.textContent  + " won. Triple " + playerToken + " in column " + parseInt(column + 1);
                                container.appendChild(win);
                            } else if (isWin == "diagWin") {
                                win.textContent = activePlayer.textContent  + " won. Diagonal " + playerToken;
                                container.appendChild(win);
                            }
                            container.appendChild(replayButton);

                        }
                        // Check whose turn it is
                        if (playerToken == "O") {
                            players.switchActivePlayer();
                            activePlayer.textContent = players.getActivePlayer();
                            playerToken = "X";
                        } else {
                            playerToken = "O";
                            players.switchActivePlayer();
                            activePlayer.textContent = players.getActivePlayer();
                        }
                    }
                    
                };
                renderBoard();
            };
            
            const gameboard = Gameboard();
            const controller = screenController(gameboard);