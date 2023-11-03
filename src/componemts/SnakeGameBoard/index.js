import React, { useState, useEffect } from 'react';
import './style.css';

const numRows = 10;
const numCols = 10;
const cellSize = 40;

const getRandomPosition = () => ({
  row: Math.floor(Math.random() * numRows),
  col: Math.floor(Math.random() * numCols),
});

const SnakeGameBoard = () => {
  const [snake, setSnake] = useState([{ row: numRows - 1, col: 0 }]);
  const [food, setFood] = useState(getRandomPosition());
  const [direction, setDirection] = useState('right');
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key) {
        case 'ArrowUp':
          if (direction !== 'down') setDirection('up');
          break;
        case 'ArrowDown':
          if (direction !== 'up') setDirection('down');
          break;
          case 'ArrowLeft':
            if (direction !== 'right' || snake.length === 1) setDirection('left');
            break;
          case 'ArrowRight':
            if (direction !== 'left' || snake.length === 1) setDirection('right');
            break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  useEffect(() => {
    if (!gameOver) {
      const gameInterval = setInterval(() => {
        moveSnake();
        checkCollision();
      }, 500);

      return () => clearInterval(gameInterval);
    }
  }, [gameOver, snake, direction]);

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'up':
        head.row -= 1;
        break;
      case 'down':
        head.row += 1;
        break;
      case 'left':
        head.col -= 1;
        break;
      case 'right':
        head.col += 1;
        break;
      default:
        break;
    }

    newSnake.unshift(head);

    if (head.row === food.row && head.col === food.col) {
      setFood(getRandomPosition());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const checkCollision = () => {
    const head = snake[0];
    if (
      head.row < 0 ||
      head.row >= numRows ||
      head.col < 0 ||
      head.col >= numCols ||
      snake.slice(1).some((segment) => segment.row === head.row && segment.col === head.col)
    ) {
      setGameOver(true);
    }
  };

  return (
    <div className="game">
    <h1 className='heading' >Snake Game</h1>
    <div className="snake-game">
      {snake.map((segment, index) => (
        <div
          key={index}
          className={`snake-segment ${index === 0 ? 'snake-head' : ''}`}
          style={{
            top: `${segment.row * cellSize}px`,
            left: `${segment.col * cellSize}px`,
          }}
        />
      ))}

      <div
        className="food"
        style={{
          top: `${food.row * cellSize}px`,
          left: `${food.col * cellSize}px`,
        }}
      />

    </div>
    {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default SnakeGameBoard;
