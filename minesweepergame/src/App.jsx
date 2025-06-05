import { useState, useEffect } from 'react'
import Tile from './components/Tile'


function App() {
  // const [ revealed, setRevealed ] = useState(Array(100).fill(false));
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);

  function createEmptyBoard(rows = 10, cols = 10) {
    const board = [];
    for (let row = 0; row < rows; row++) {
      const currentRow = [];
      for (let col = 0; col < cols; col++) {
        currentRow.push({ row, col, isMine: false, isRevealed: false, adjacentMines: 0, })
      }
      board.push(currentRow);
    }
    return board;

  }

  function plantMines(board, mineCount = 10){
    let placedMines = 0;

    while (placedMines < mineCount) {
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);

      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        placedMines++;
      }
    }
    return board;
  }

  function countAdjacentMines(board) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [0, -1],
      [ 1, -1], [ 1, 0], [ 1, 1],
    ];

    for (let row = 0; row < 10; row++) {
      for (let col = 0; col < 10; col++) {
        if (board[row][col].isMine) continue;

        let count = 0;
        for (const [dx, dy] of directions) {
          const newRow = row + dx;
          const newCol = col + dy;

          if (
            newRow >= 0 &&
            newRow < 10 &&
            newCol >= 0 &&
            newCol < 10 &&
            board[newRow][newCol].isMine
          ) {
            count++;
          }
        }
        board[row][col].adjacentMines = count;
      }
    }
    return board;
  }
  function generateNewBoard() {
    let newBoard = createEmptyBoard()
    newBoard = plantMines(newBoard, 10)
    newBoard = countAdjacentMines(newBoard)
    return newBoard;
  }


  useEffect(() => {
    setBoard(generateNewBoard())
  }, []);

  function handleTileClick(row, col) {
    if (gameOver) return;

    const newBoard = board.map(row => row.map(tile => ({...tile})));
    const clickedTile = newBoard[row][col];

    if (clickedTile.isRevealed) return;

    if (clickedTile.isMine){
      clickedTile.isRevealed = true;
      setBoard(newBoard);
      setGameOver(true);
      return;
    }

    if (clickedTile.adjacentMines === 0){
      setBoard(revealEmptyTiles(newBoard, row, col));
    } else {
      clickedTile.isRevealed = true;
      setBoard(newBoard);
    }
  }

  function revealEmptyTiles(board, row, col) {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [ 0, -1],          [ 0, 1],
      [ 1, -1], [ 1, 0], [ 1, 1],
    ]
    const stack = [[row, col]];
    while (stack.length > 0){
      const [r, c] = stack.pop();

      if (
        r < 0 || r >= 10 || c < 0 || c >= 10 ||
        board[r][c].isRevealed ||
        board[r][c].isMine
      ) {
        continue;
      }
      board[r][c].isRevealed = true;

      if (board[r][c].adjacentMines === 0) {
        for (const [dx, dy] of directions) {
          const newRow = r + dx;
          const newCol = c + dy;
          stack.push([newRow, newCol]);
        }
      }
    }
    return board;
  }

  const renderBoard = (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(10, 30px)',
      gridTemplateRows: 'repeat(10, 30px)',
      gap: '0px',
      width: 'max-content'
    }}>
      {board.flat().map((tile, index) => (
        <Tile key={index} isRevealed={tile.isRevealed} value={tile.isMine ? '💣' : tile.adjacentMines}
        onClick={() => handleTileClick(tile.row, tile.col)}/>
      ))}
    </div>
  );


  // } handleTileClick (row, col){
  //   const updated = [...revealed];
  //   updated[index] = true;
  //   setRevealed(updated);
  // };

  // const board = [];


  // for (let i = 0; i < 100; i++){
  //   board.push(<Tile key={i} isRevealed={revealed[i]} onClick={() => handleClick(i)} />)
  // };

  // const gridStyle = {
  //   display: 'grid',
  //   gridTemplateColumns: 'repeat(10, 30px)',
  //   width: 'max-content',
  //   margin: '20px auto'
  // };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh'
    }}>
      <h1 style={{ marginBottom: '20px' }}>Minesweeper</h1>
      <button onClick={() => {
        setBoard(generateNewBoard())
        setGameOver(false)}}
      style={{ marginBottom: '20px', padding: '8px 16px', fontSize: '16px', cursor: 'pointer' }}>Reset Game</button>
      {gameOver && (
        <div style={{ color: 'red', fontSize: '20px', marginBottom: '10px'}}>
          💥 Game Over! You Fucked Up!
        </div>
      )}
      {renderBoard}
    </div>
  )
}

export default App;
