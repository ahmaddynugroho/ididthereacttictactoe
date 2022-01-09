import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      style={{
        backgroundColor: props.winnerLocation.includes(props.location)
          ? "red"
          : null,
      }}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        key={i}
        location={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winnerLocation={this.props.winnerLocation}
      />
    );
  }

  render() {
    return (
      <div>
        {[...Array(3)].map((_, i) => {
          return (
            <div key={i} className="board-row">
              {[...Array(3)].map((_, j) => this.renderSquare(3 * i + j))}
            </div>
          );
        })}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let moves = history.map((step, move) => {
      let location = null;
      if (move) {
        step.squares.forEach((el, i) => {
          if (el !== history[move - 1].squares[i]) {
            location = i + 1;
          }
        });
      }

      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button
            style={{
              fontWeight: move === this.state.stepNumber ? "bold" : "normal",
            }}
            onClick={() => this.jumpTo(move)}
          >
            {location} {desc}
          </button>
        </li>
      );
    });

    const reverseMoves = () => {
      this.setState({
        history: [...history].reverse(),
      });
      this.jumpTo(0);
    };

    let status;
    if (winner) {
      status = "Winner: " + winner.winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerLocation={winner ? winner.location : ["Winner not found"]}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={reverseMoves}>Reverse!</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        location: [a, b, c],
      };
    }
  }
  return null;
}
