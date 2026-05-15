// src/App.js

import { useState } from "react";
import "./App.css";

function App() {

  // Empty Board
  const emptyBoard = Array(9)
    .fill()
    .map(() => Array(9).fill(""));

  const [board, setBoard] = useState(emptyBoard);

  const [invalidCells, setInvalidCells] = useState([]);

  const [darkMode, setDarkMode] = useState(false);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Handle Input
  const handleChange = (row, col, value) => {

    if (value === "" || /^[1-9]$/.test(value)) {

      const newBoard = board.map(r => [...r]);

      newBoard[row][col] = value;

      setBoard(newBoard);

      checkBoardValidity(newBoard);
    }
  };

  // Check Safe Position
  const isSafe = (board, row, col, num) => {

    // Row Check
    for (let x = 0; x < 9; x++) {

      if (x !== col && board[row][x] === num) {
        return false;
      }
    }

    // Column Check
    for (let x = 0; x < 9; x++) {

      if (x !== row && board[x][col] === num) {
        return false;
      }
    }

    // Box Check
    let startRow = row - (row % 3);
    let startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {

      for (let j = 0; j < 3; j++) {

        let currentRow = startRow + i;
        let currentCol = startCol + j;

        if (
          (currentRow !== row || currentCol !== col) &&
          board[currentRow][currentCol] === num
        ) {
          return false;
        }
      }
    }

    return true;
  };

  // Validate Board
  const checkBoardValidity = (board) => {

    let invalid = [];

    for (let row = 0; row < 9; row++) {

      for (let col = 0; col < 9; col++) {

        let value = board[row][col];

        if (value !== "") {

          if (!isSafe(board, row, col, value)) {

            invalid.push(`${row}-${col}`);
          }
        }
      }
    }

    setInvalidCells(invalid);

    return invalid.length === 0;
  };

  // Delay
  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  // Animated Solver
  const solveSudoku = async (board) => {

    for (let row = 0; row < 9; row++) {

      for (let col = 0; col < 9; col++) {

        if (board[row][col] === "") {

          for (let num = 1; num <= 9; num++) {

            const number = num.toString();

            board[row][col] = number;

            if (isSafe(board, row, col, number)) {

              setBoard(board.map(r => [...r]));

              await sleep(10);

              if (await solveSudoku(board)) {
                return true;
              }

              // Backtrack
              board[row][col] = "";

              setBoard(board.map(r => [...r]));

              await sleep(10);
            }
            else {
              board[row][col] = "";
            }
          }

          return false;
        }
      }
    }

    return true;
  };

  // Solve Button
  const handleSolve = async () => {

    const valid = checkBoardValidity(board);

    if (!valid) {

      alert("Invalid Sudoku Puzzle!");

      return;
    }

    const newBoard = board.map(row => [...row]);

    const solved = await solveSudoku(newBoard);

    if (!solved) {
      alert("No solution exists!");
    }
  };

  // Clear Board
  const handleClear = () => {

    setBoard(emptyBoard);

    setInvalidCells([]);
  };

  // EASY PUZZLE
  const loadEasy = () => {

    const easy = [
      ["5","3","","","7","","","",""],
      ["6","","","1","9","5","","",""],
      ["","9","8","","","","","6",""],
      ["8","","","","6","","","","3"],
      ["4","","","8","","3","","","1"],
      ["7","","","","2","","","","6"],
      ["","6","","","","","2","8",""],
      ["","","","4","1","9","","","5"],
      ["","","","","8","","","7","9"]
    ];

    setBoard(easy);

    setInvalidCells([]);
  };

  // MEDIUM PUZZLE
  const loadMedium = () => {

    const medium = [
      ["7","5","","4","","","9","6",""],
      ["","4","","7","6","","8","",""],
      ["","1","","2","5","","","","3"],
      ["","","8","","1","","6","",""],
      ["","","6","","8","9","","3",""],
      ["4","","","","3","7","","9",""],
      ["6","3","","8","","","","7","4"],
      ["","","","","","","7","8","9"],
      ["5","","9","2","7","","","4",""]
    ];

    setBoard(medium);

    setInvalidCells([]);
  };

  // HARD PUZZLE
  const loadHard = () => {

    const hard = [
      ["","","1","","4","","","","3"],
      ["","","","","8","","","",""],
      ["","5","","","9","1","","7",""],
      ["","6","9","","","","2","",""],
      ["","","","","","2","","",""],
      ["","","7","6","","","5","",""],
      ["","","","","","","","",""],
      ["8","","","","7","","9","5",""],
      ["9","","","3","","","","6",""]
    ];

    setBoard(hard);

    setInvalidCells([]);
  };

  // CUSTOM MODE
  const loadCustom = () => {

    setBoard(emptyBoard);

    setInvalidCells([]);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>

      <h1>Sudoku Solver AI</h1>

      {/* Difficulty Buttons */}

      <div className="difficulty-buttons">

        <button onClick={loadEasy} className="easy-btn">
          Easy
        </button>

        <button onClick={loadMedium} className="medium-btn">
          Medium
        </button>

        <button onClick={loadHard} className="hard-btn">
          Hard
        </button>

        <button onClick={loadCustom} className="custom-btn">
          Custom
        </button>

      </div>

      <div className="board">

        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {

            let extraClass = "";

            // Thick Borders
            if ((colIndex + 1) % 3 === 0 && colIndex !== 8) {
              extraClass += " right-border";
            }

            if ((rowIndex + 1) % 3 === 0 && rowIndex !== 8) {
              extraClass += " bottom-border";
            }

            // Invalid Cells
            if (
              invalidCells.includes(`${rowIndex}-${colIndex}`)
            ) {
              extraClass += " invalid";
            }

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={`cell ${extraClass}`}
                type="text"
                value={cell}
                maxLength="1"
                onChange={(e) =>
                  handleChange(rowIndex, colIndex, e.target.value)
                }
              />
            );
          })
        )}

      </div>

      <div className="buttons">

        <button onClick={toggleDarkMode} className="dark-btn">
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={handleSolve} className="solve-btn">
          Solve
        </button>

        <button onClick={handleClear} className="clear-btn">
          Clear
        </button>

      </div>

    </div>
  );
}

export default App;