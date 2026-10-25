import { useState, useEffect, useCallback, useRef } from 'react';

// Types
type Position = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type GameState = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';
type Difficulty = 'easy' | 'medium' | 'hard';

// Constants
const GRID_SIZE = 20;
const SPEEDS: Record<Difficulty, number> = {
  easy: 180,
  medium: 120,
  hard: 70,
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

// Helper functions
function getRandomFood(snake: Position[]): Position {
  let food: Position;
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
  return food;
}

function getHighScore(difficulty: Difficulty): number {
  try {
    return parseInt(localStorage.getItem(`snake-highscore-${difficulty}`) || '0', 10);
  } catch {
    return 0;
  }
}

function setHighScore(difficulty: Difficulty, score: number): void {
  try {
    localStorage.setItem(`snake-highscore-${difficulty}`, score.toString());
  } catch {
    // localStorage not available
  }
}

export default function App() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Position>(() => getRandomFood(INITIAL_SNAKE));
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [gameState, setGameState] = useState<GameState>('IDLE');
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [highScores, setHighScores] = useState<Record<Difficulty, number>>({
    easy: getHighScore('easy'),
    medium: getHighScore('medium'),
    hard: getHighScore('hard'),
  });
  const [showEatAnimation, setShowEatAnimation] = useState(false);

  const directionRef = useRef<Direction>(direction);
  const gameStateRef = useRef<GameState>(gameState);
  const snakeRef = useRef<Position[]>(snake);
  const foodRef = useRef<Position>(food);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // Sync refs
  useEffect(() => { directionRef.current = direction; }, [direction]);
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { snakeRef.current = snake; }, [snake]);
  useEffect(() => { foodRef.current = food; }, [food]);

  // Game logic
  const moveSnake = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING') return;

    const currentSnake = snakeRef.current;
    const currentFood = foodRef.current;
    const head = currentSnake[0];
    const dir = directionRef.current;

    let newHead: Position;
    switch (dir) {
      case 'UP': newHead = { x: head.x, y: head.y - 1 }; break;
      case 'DOWN': newHead = { x: head.x, y: head.y + 1 }; break;
      case 'LEFT': newHead = { x: head.x - 1, y: head.y }; break;
      case 'RIGHT': newHead = { x: head.x + 1, y: head.y }; break;
    }

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      setGameState('GAME_OVER');
      return;
    }

    // Check self collision
    if (currentSnake.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
      setGameState('GAME_OVER');
      return;
    }

    const newSnake = [newHead, ...currentSnake];

    // Check food collision
    if (newHead.x === currentFood.x && newHead.y === currentFood.y) {
      const newScore = score + (difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1);
      setScore(newScore);
      setFood(getRandomFood(newSnake));
      setShowEatAnimation(true);
      setTimeout(() => setShowEatAnimation(false), 200);

      // Update high score
      if (newScore > highScores[difficulty]) {
        const newHighScores = { ...highScores, [difficulty]: newScore };
        setHighScores(newHighScores);
        setHighScore(difficulty, newScore);
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  }, [score, difficulty, highScores]);

  // Game loop
  useEffect(() => {
    if (gameState === 'PLAYING') {
      gameLoopRef.current = window.setInterval(moveSnake, SPEEDS[difficulty]);
    } else {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameState, difficulty, moveSnake]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;

      // Prevent scrolling with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(key)) {
        e.preventDefault();
      }

      if (key === ' ' || key === 'Escape') {
        if (gameState === 'PLAYING') {
          setGameState('PAUSED');
        } else if (gameState === 'PAUSED') {
          setGameState('PLAYING');
        } else if (gameState === 'IDLE') {
          startGame();
        }
        return;
      }

      if (key === 'r' || key === 'R') {
        resetGame();
        return;
      }

      if (gameState !== 'PLAYING') return;

      const currentDir = directionRef.current;
      switch (key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  // Touch controls
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const minSwipe = 30;

    if (Math.abs(dx) < minSwipe && Math.abs(dy) < minSwipe) return;

    const currentDir = directionRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
      // Horizontal swipe
      if (dx > 0 && currentDir !== 'LEFT') setDirection('RIGHT');
      else if (dx < 0 && currentDir !== 'RIGHT') setDirection('LEFT');
    } else {
      // Vertical swipe
      if (dy > 0 && currentDir !== 'UP') setDirection('DOWN');
      else if (dy < 0 && currentDir !== 'DOWN') setDirection('UP');
    }

    touchStartRef.current = null;
  }, []);

  // Game actions
  const startGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection('RIGHT');
    setScore(0);
    setGameState('PLAYING');
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(getRandomFood(INITIAL_SNAKE));
    setDirection('RIGHT');
    setScore(0);
    setGameState('IDLE');
  };

  const togglePause = () => {
    if (gameState === 'PLAYING') setGameState('PAUSED');
    else if (gameState === 'PAUSED') setGameState('PLAYING');
  };

  // Direction buttons for mobile
  const handleDirectionButton = (dir: Direction) => {
    if (gameState !== 'PLAYING') return;
    const currentDir = directionRef.current;
    if (dir === 'UP' && currentDir !== 'DOWN') setDirection('UP');
    if (dir === 'DOWN' && currentDir !== 'UP') setDirection('DOWN');
    if (dir === 'LEFT' && currentDir !== 'RIGHT') setDirection('LEFT');
    if (dir === 'RIGHT' && currentDir !== 'LEFT') setDirection('RIGHT');
  };

  // Render game board
  const renderBoard = () => {
    const cells = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnakeHead = snake[0].x === x && snake[0].y === y;
        const isSnakeBody = snake.slice(1).some(seg => seg.x === x && seg.y === y);
        const isFood = food.x === x && food.y === y;

        let cellClass = 'w-full h-full rounded-sm transition-all duration-75 ';

        if (isSnakeHead) {
          cellClass += `bg-green-400 shadow-lg shadow-green-400/50 ${showEatAnimation ? 'animate-snake-eat' : ''}`;
        } else if (isSnakeBody) {
          const index = snake.findIndex(seg => seg.x === x && seg.y === y);
          const opacity = Math.max(0.4, 1 - index * 0.03);
          cellClass += 'bg-green-500 rounded-sm';
          cells.push(
            <div
              key={`${x}-${y}`}
              className={cellClass}
              style={{ opacity }}
            />
          );
          continue;
        } else if (isFood) {
          cellClass += 'bg-red-400 rounded-full animate-pulse-food shadow-lg shadow-red-400/50';
        } else {
          cellClass += (x + y) % 2 === 0 ? 'bg-gray-800/30' : 'bg-gray-800/10';
        }

        cells.push(<div key={`${x}-${y}`} className={cellClass} />);
      }
    }
    return cells;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col items-center justify-center p-4 select-none">
      {/* Header */}
      <div className="w-full max-w-lg mb-4 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-green-400 mb-2 tracking-wider">
          🐍 SNAKE
        </h1>

        {/* Score display */}
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Score</div>
            <div className={`text-2xl font-bold text-white ${showEatAnimation ? 'animate-snake-eat' : ''}`}>
              {score}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              {DIFFICULTY_LABELS[difficulty]}
            </div>
            <div className="text-sm text-green-300 font-medium">
              {DIFFICULTY_LABELS[difficulty]}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-400 uppercase tracking-wide">Best</div>
            <div className="text-2xl font-bold text-yellow-400">
              {highScores[difficulty]}
            </div>
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div
        className="relative w-full max-w-lg aspect-square bg-gray-900/80 rounded-xl border-2 border-green-500/30 shadow-2xl shadow-green-500/10 overflow-hidden touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Grid */}
        <div
          className="w-full h-full grid gap-px p-1"
          style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
          }}
        >
          {renderBoard()}
        </div>

        {/* Overlays */}
        {gameState === 'IDLE' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
            <div className="text-6xl mb-4">🐍</div>
            <h2 className="text-2xl font-bold text-white mb-2">Ready to Play?</h2>
            <p className="text-gray-300 text-sm mb-6 text-center px-4">
              Use arrow keys, WASD, or swipe to control
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              Start Game
            </button>
          </div>
        )}

        {gameState === 'PAUSED' && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
            <div className="text-5xl mb-4">⏸️</div>
            <h2 className="text-2xl font-bold text-white mb-4">Paused</h2>
            <button
              onClick={togglePause}
              className="px-8 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30"
            >
              Resume
            </button>
          </div>
        )}

        {gameState === 'GAME_OVER' && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center animate-fade-in backdrop-blur-sm">
            <div className="text-5xl mb-3">💀</div>
            <h2 className="text-2xl font-bold text-red-400 mb-1">Game Over!</h2>
            <p className="text-white text-lg mb-1">Score: <span className="font-bold text-green-400">{score}</span></p>
            {score >= highScores[difficulty] && score > 0 && (
              <p className="text-yellow-400 text-sm mb-3 animate-pulse">🏆 New High Score!</p>
            )}
            <div className="flex gap-3 mt-3">
              <button
                onClick={startGame}
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg shadow-green-500/30"
              >
                Play Again
              </button>
              <button
                onClick={resetGame}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Menu
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="w-full max-w-lg mt-4 animate-slide-up">
        {/* Action buttons */}
        <div className="flex justify-center gap-3 mb-4">
          {gameState === 'PLAYING' && (
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-all text-sm font-medium"
            >
              ⏸ Pause
            </button>
          )}
          {gameState === 'PAUSED' && (
            <button
              onClick={togglePause}
              className="px-4 py-2 bg-green-500/20 border border-green-500/50 text-green-400 rounded-lg hover:bg-green-500/30 transition-all text-sm font-medium"
            >
              ▶ Resume
            </button>
          )}
          {(gameState === 'PLAYING' || gameState === 'PAUSED') && (
            <button
              onClick={resetGame}
              className="px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium"
            >
              🔄 Restart
            </button>
          )}
        </div>

        {/* Difficulty selector */}
        <div className="flex justify-center gap-2 mb-4">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                if (gameState === 'IDLE' || gameState === 'GAME_OVER') {
                  setDifficulty(d);
                }
              }}
              disabled={gameState === 'PLAYING' || gameState === 'PAUSED'}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                difficulty === d
                  ? d === 'easy'
                    ? 'bg-green-500/30 border border-green-500 text-green-400'
                    : d === 'medium'
                    ? 'bg-yellow-500/30 border border-yellow-500 text-yellow-400'
                    : 'bg-red-500/30 border border-red-500 text-red-400'
                  : 'bg-gray-700/50 border border-gray-600 text-gray-400 hover:border-gray-400'
              } ${gameState === 'PLAYING' || gameState === 'PAUSED' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {DIFFICULTY_LABELS[d]}
            </button>
          ))}
        </div>

        {/* Mobile D-pad */}
        <div className="flex justify-center md:hidden">
          <div className="grid grid-cols-3 gap-1 w-40">
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('UP'); }}
              className="w-12 h-12 bg-gray-700/80 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl active:bg-green-500/50 active:border-green-500 transition-all mx-auto"
            >
              ↑
            </button>
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('LEFT'); }}
              className="w-12 h-12 bg-gray-700/80 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl active:bg-green-500/50 active:border-green-500 transition-all mx-auto"
            >
              ←
            </button>
            <div className="w-12 h-12 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500/50 rounded-full" />
            </div>
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('RIGHT'); }}
              className="w-12 h-12 bg-gray-700/80 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl active:bg-green-500/50 active:border-green-500 transition-all mx-auto"
            >
              →
            </button>
            <div />
            <button
              onTouchStart={(e) => { e.preventDefault(); handleDirectionButton('DOWN'); }}
              className="w-12 h-12 bg-gray-700/80 border border-gray-600 rounded-lg flex items-center justify-center text-white text-xl active:bg-green-500/50 active:border-green-500 transition-all mx-auto"
            >
              ↓
            </button>
            <div />
          </div>
        </div>

        {/* Keyboard hints for desktop */}
        <div className="hidden md:flex justify-center gap-4 text-xs text-gray-500 mt-2">
          <span>↑↓←→ / WASD: Move</span>
          <span>Space: Pause</span>
          <span>R: Restart</span>
        </div>
      </div>
    </div>
  );
}
