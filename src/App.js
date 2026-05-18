import { useState } from "react";
import "./App.css";

function App() {

  const emptyBoard = Array(9).fill().map(() => Array(9).fill(""));

  const [board, setBoard] = useState(emptyBoard);
  const [invalidCells, setInvalidCells] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const handleChange = (row, col, value) => {
    if (value === "" || /^[1-9]$/.test(value)) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = value;
      setBoard(newBoard);
      checkBoardValidity(newBoard);
    }
  };

  const isSafe = (board, row, col, num) => {
    for (let x = 0; x < 9; x++) {
      if (x !== col && board[row][x] === num) return false;
      if (x !== row && board[x][col] === num) return false;
    }

    let startRow = row - (row % 3);
    let startCol = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let r = startRow + i;
        let c = startCol + j;
        if ((r !== row || c !== col) && board[r][c] === num) return false;
      }
    }
    return true;
  };

  const checkBoardValidity = (board) => {
    let invalid = [];

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        let value = board[row][col];
        if (value !== "" && !isSafe(board, row, col, value)) {
          invalid.push(`${row}-${col}`);
        }
      }
    }

    setInvalidCells(invalid);
    return invalid.length === 0;
  };

  const sleep = (ms) => new Promise(res => setTimeout(res, ms));

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

              if (await solveSudoku(board)) return true;

              board[row][col] = "";
              setBoard(board.map(r => [...r]));
              await sleep(10);
            } else {
              board[row][col] = "";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  const handleSolve = async () => {
    if (!checkBoardValidity(board)) {
      alert("Invalid Sudoku Puzzle!");
      return;
    }

    const newBoard = board.map(r => [...r]);

    if (!(await solveSudoku(newBoard))) {
      alert("No solution exists!");
    }
  };

  const handleClear = () => {
    setBoard(emptyBoard);
    setInvalidCells([]);
  };

  // Difficulty
  const loadEasy = () => {
    setBoard([
      ["5","3","","","7","","","",""],
      ["6","","","1","9","5","","",""],
      ["","9","8","","","","","6",""],
      ["8","","","","6","","","","3"],
      ["4","","","8","","3","","","1"],
      ["7","","","","2","","","","6"],
      ["","6","","","","","2","8",""],
      ["","","","4","1","9","","","5"],
      ["","","","","8","","","7","9"]
    ]);
    setInvalidCells([]);
  };

  const loadMedium = () => {
    setBoard([
  

  ["6","7","3","5","","","9","",""],
  ["","4","","7","6","","8","",""],
  ["","1","","2","","","","","3"],

  ["","","8","","1","","6","",""],
  ["","","6","","8","9","","3",""],
  ["4","","","","3","7","","9",""],

  ["","3","","8","","","","7","4"],
  ["","","","","","","","8","9"],
  ["5","","9","","7","","","1",""]

]
    );
    setInvalidCells([]);
  };

  const loadHard = () => {
    setBoard([
      ["","","1","","4","","","","3"],
      ["","","","","8","","","",""],
      ["","5","","","9","1","","7",""],
      ["","6","9","","","","2","",""],
      ["","","","","","2","","",""],
      ["","","7","6","","","5","",""],
      ["","","","","","","","",""],
      ["8","","","","7","","9","5",""],
      ["9","","","3","","","","6",""]
    ]);
    setInvalidCells([]);
  };

  return (
    <div className={darkMode ? "App dark" : "App"}>

      <h1>Sudoku Solver AI</h1>

      <div className="difficulty-buttons">
        <button onClick={loadEasy}>Easy</button>
        <button onClick={loadMedium}>Medium</button>
        <button onClick={loadHard}>Hard</button>
      </div>

      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {

            let classes = ["cell"];

            // ✅ FIXED BORDERS (no double)
            if (colIndex % 3 === 0) classes.push("left-border");
            if (rowIndex % 3 === 0) classes.push("top-border");
            if (colIndex === 8) classes.push("right-border");
            if (rowIndex === 8) classes.push("bottom-border");

            // 🎨 Box colors
            const boxRow = Math.floor(rowIndex / 3);
            const boxCol = Math.floor(colIndex / 3);

            if ((boxRow + boxCol) % 2 === 0) {
              classes.push("box-light");
            } else {
              classes.push("box-dark");
            }

            if (invalidCells.includes(`${rowIndex}-${colIndex}`)) {
              classes.push("invalid");
            }

            return (
              <input
                key={`${rowIndex}-${colIndex}`}
                className={classes.join(" ")}
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
        <button onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
        <button onClick={handleSolve}>Solve</button>
        <button onClick={handleClear}>Clear</button>
      </div>

    </div>
  );
}

export default App;