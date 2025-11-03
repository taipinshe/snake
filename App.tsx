import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Direction } from './types';
import type { Position } from './types';
import { 
  GRID_SIZE, 
  INITIAL_SNAKE_POSITION, 
  INITIAL_FOOD_POSITION, 
  INITIAL_DIRECTION, 
  LEVELS
} from './constants';

const FoodIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-red-500 animate-pulse">
    <path fillRule="evenodd" d="M12.963 2.286a.75.75 0 00-1.071 1.052A9.75 9.75 0 0118 15.75a9.75 9.75 0 01-5.037 8.464.75.75 0 00-1.071-1.052 8.25 8.25 0 004.037-7.414 8.25 8.25 0 00-8.25-8.25 8.25 8.25 0 00-1.002.082.75.75 0 00.994 1.49c.338-.055.68-.082 1.03-.082a6.75 6.75 0 016.75 6.75 6.75 6.75 0 01-6.75 6.75c-.35 0-.692-.027-1.03-.082a.75.75 0 00-.994 1.49 8.25 8.25 0 001.002.082 8.25 8.25 0 008.25-8.25 8.25 8.25 0 00-4.037-7.414z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v6a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM4.72 12.69a.75.75 0 011.06 0L9 15.94l-1.97-1.97a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

interface GameOverlayProps {
  gameState: GameState;
  score: number;
  level: number;
  onStart: () => void;
  onRestart: () => void;
  onResume: () => void;
  onNextLevel: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({ gameState, score, level, onStart, onRestart, onResume, onNextLevel }) => {
  if (gameState === GameState.RUNNING) {
    return null;
  }

  const getOverlayContent = () => {
    switch (gameState) {
      case GameState.START:
        return {
          title: "貪食蛇遊戲",
          subtitle: "準備好開始了嗎？",
          buttonText: "開始遊戲",
          action: onStart,
        };
      case GameState.PAUSED:
        return {
          title: "遊戲暫停",
          subtitle: `目前分數: ${score}`,
          buttonText: "繼續遊戲",
          action: onResume,
        };
      case GameState.GAME_OVER:
        return {
          title: "遊戲結束",
          subtitle: `最終分數: ${score}`,
          buttonText: "重新開始",
          action: onRestart,
        };
      case GameState.LEVEL_CLEARED:
        return {
            title: `關卡 ${level} 完成！`,
            subtitle: `目前分數: ${score}`,
            buttonText: "下一關",
            action: onNextLevel,
        };
      case GameState.VICTORY:
        return {
            title: "恭喜過關！",
            subtitle: `最終分數: ${score}`,
            buttonText: "重新開始",
            action: onRestart,
        };
      default:
        return null;
    }
  };

  const content = getOverlayContent();
  if (!content) return null;

  return (
    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-lg z-10">
      <h2 className="text-4xl font-bold text-green-400 mb-2">{content.title}</h2>
      <p className="text-lg text-gray-300 mb-6">{content.subtitle}</p>
      <button
        onClick={content.action}
        className="px-6 py-3 bg-green-500 text-gray-900 font-bold rounded-lg hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
      >
        {content.buttonText}
      </button>
    </div>
  );
};


const App: React.FC = () => {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE_POSITION);
  const [food, setFood] = useState<Position>(INITIAL_FOOD_POSITION);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [gameState, setGameState] = useState<GameState>(GameState.START);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    const savedScore = localStorage.getItem('snakeHighScore');
    return savedScore ? parseInt(savedScore, 10) : 0;
  });
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

  const directionRef = useRef<Direction>(direction);
  
  const currentLevel = LEVELS[currentLevelIndex];

  const generateFood = useCallback((currentSnake: Position[], currentObstacles: Position[]): Position => {
    while (true) {
      const newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const onSnake = currentSnake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y);
      const onObstacle = currentObstacles.some(obs => obs.x === newFoodPosition.x && obs.y === newFoodPosition.y);
      
      if (!onSnake && !onObstacle) {
        return newFoodPosition;
      }
    }
  }, []);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE_POSITION);
    setFood(generateFood(INITIAL_SNAKE_POSITION, LEVELS[0].obstacles));
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setScore(0);
    setCurrentLevelIndex(0);
    setGameState(GameState.START);
  }, [generateFood]);
  
  const handleNextLevel = () => {
      const nextLevelIndex = currentLevelIndex + 1;
      if (nextLevelIndex < LEVELS.length) {
          setCurrentLevelIndex(nextLevelIndex);
          setSnake(INITIAL_SNAKE_POSITION);
          setFood(generateFood(INITIAL_SNAKE_POSITION, LEVELS[nextLevelIndex].obstacles));
          setDirection(INITIAL_DIRECTION);
          directionRef.current = INITIAL_DIRECTION;
          setGameState(GameState.RUNNING);
      }
  };

  const startGame = () => {
    setGameState(GameState.RUNNING);
  }
  
  const pauseGame = () => {
    if (gameState === GameState.RUNNING) {
      setGameState(GameState.PAUSED);
    }
  };
  
  const resumeGame = () => {
    if (gameState === GameState.PAUSED) {
      setGameState(GameState.RUNNING);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === GameState.START) {
        if(e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      let newDirection: Direction | null = null;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction !== Direction.DOWN) newDirection = Direction.UP;
          break;
        case 'ArrowDown':
        case 's':
          if (direction !== Direction.UP) newDirection = Direction.DOWN;
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction !== Direction.RIGHT) newDirection = Direction.LEFT;
          break;
        case 'ArrowRight':
        case 'd':
          if (direction !== Direction.LEFT) newDirection = Direction.RIGHT;
          break;
        case 'Escape':
        case 'p':
            if (gameState === GameState.RUNNING) pauseGame();
            else if (gameState === GameState.PAUSED) resumeGame();
            break;
      }
      if (newDirection !== null) {
        setDirection(newDirection);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, gameState]);

  useEffect(() => {
    if (gameState !== GameState.RUNNING) {
      return;
    }

    const gameInterval = setInterval(() => {
      setSnake(prevSnake => {
        const newSnake = [...prevSnake];
        const head = { ...newSnake[0] };

        switch (direction) {
          case Direction.UP: head.y -= 1; break;
          case Direction.DOWN: head.y += 1; break;
          case Direction.LEFT: head.x -= 1; break;
          case Direction.RIGHT: head.x += 1; break;
        }

        // Wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameState(GameState.GAME_OVER);
          return prevSnake;
        }

        // Obstacle collision
        if (currentLevel.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
          setGameState(GameState.GAME_OVER);
          return prevSnake;
        }

        // Self collision
        for (let i = 1; i < newSnake.length; i++) {
          if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setGameState(GameState.GAME_OVER);
            return prevSnake;
          }
        }
        
        newSnake.unshift(head);

        // Food consumption
        if (head.x === food.x && head.y === food.y) {
          const newScore = score + 1;
          setScore(newScore);

          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('snakeHighScore', newScore.toString());
          }
          
          if (newScore >= currentLevel.targetScore) {
              if (currentLevelIndex < LEVELS.length - 1) {
                  setGameState(GameState.LEVEL_CLEARED);
              } else {
                  setGameState(GameState.VICTORY);
              }
          }
          setFood(generateFood(newSnake, currentLevel.obstacles));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, currentLevel.speed);

    return () => clearInterval(gameInterval);
  }, [gameState, direction, food, score, highScore, generateFood, currentLevelIndex, currentLevel]);
  
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE });
  const snakePositions = new Set(snake.map(p => `${p.x}-${p.y}`));


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 font-mono">
      <h1 className="text-4xl font-bold text-green-400 mb-2 tracking-widest">SNAKE</h1>
      <div className="flex justify-between w-full max-w-md mb-4 text-lg">
        <div>Level: <span className="text-yellow-400 font-bold">{currentLevel.level}</span></div>
        <div>Score: <span className="text-yellow-400 font-bold">{score}</span> / <span className="text-cyan-400">{currentLevel.targetScore}</span></div>
        <div>High Score: <span className="text-yellow-400 font-bold">{highScore}</span></div>
      </div>

      <div className="relative border-4 border-green-700 bg-gray-800 shadow-lg rounded-lg">
        <GameOverlay 
            gameState={gameState} 
            score={score} 
            level={currentLevel.level}
            onStart={startGame} 
            onRestart={resetGame} 
            onResume={resumeGame}
            onNextLevel={handleNextLevel}
        />
        <div className="grid grid-cols-20 gap-px aspect-square w-[320px] sm:w-[400px] md:w-[500px] lg:w-[600px]">
          {gridCells.map((_, index) => {
            const x = index % GRID_SIZE;
            const y = Math.floor(index / GRID_SIZE);
            const isSnake = snakePositions.has(`${x}-${y}`);
            const isSnakeHead = snake[0].x === x && snake[0].y === y;
            const isFood = food.x === x && food.y === y;
            const isObstacle = currentLevel.obstacles.some(o => o.x === x && o.y === y);

            return (
              <div
                key={index}
                className={`w-full h-full ${
                  isObstacle
                    ? 'bg-gray-600 rounded-sm'
                    : isSnakeHead
                    ? 'bg-green-300 rounded-sm'
                    : isSnake
                    ? 'bg-green-500 rounded-sm'
                    : 'bg-gray-800'
                }`}
              >
               {isFood && !isSnake && (
                 <div className="w-full h-full transform scale-125">
                  <FoodIcon />
                 </div>
               )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 text-center text-gray-400 text-sm">
        <p>Use Arrow Keys or WASD to move.</p>
        <p>Use 'P' or 'Escape' to pause/resume.</p>
      </div>
    </div>
  );
};

export default App;
