import { useState } from "react";
import confetti from "canvas-confetti";
import Square from "./components/Square";
import { checkEndGasme, checkWinnerFrom } from "./logic/board";
import { TURNS } from "./constants";
import { WinnerModal } from "./components/WinnerModal";

//! componente
const App = () => {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    return boardFromStorage ? JSON.parse(boardFromStorage) : Array(9).fill(null)
  });
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ? JSON.parse(turnFromStorage) : TURNS.X
  });
  const [winner, setWinner] = useState(null)
  
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(TURNS.X)
    setWinner(null)

    // resetGameStorage()
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }


  const updateBoard = (index) => {
    //si ya tengo algo
    if (board[index] || winner) return
    // si ya tengo algo
    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);
    // cambiar el turno
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);
    // guardar partida
    window.localStorage.setItem('board', JSON.stringify(newBoard) )
    window.localStorage.setItem('turn', JSON.stringify(newTurn) )
    // revisar si hay ganador
    const newWinner = checkWinnerFrom(newBoard)
    if (newWinner) {
      confetti()
      setWinner(newWinner)
    } else if (checkEndGasme(newBoard)) {
      setWinner(false) // empate
    }
  };

  return (
    <main className="board">
      <h1>Tic Tac</h1>
      <button onClick={resetGame}>Reset Game</button>
      <section className="game">
        {
          board.map((square, index) => {
            return (
              <Square index={index} key={index} updateBoard={updateBoard}>
                {square}
              </Square>
            );
          })
        }
      </section>
      <section className="turn">
        <Square isSelected={turn === TURNS.X}>
          {TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>
          {TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner}/>

    </main>
  );
};

export default App;
