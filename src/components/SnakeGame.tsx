import React, { useState, useEffect, useRef, useCallback } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20; // For canvas drawing
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const GAME_SPEED = 100;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const directionRef = useRef(direction);
  directionRef.current = direction;

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // eslint-disable-next-line no-loop-func
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setFood(generateFood(INITIAL_SNAKE));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;
      
      const { x, y } = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (x !== -1) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          e.preventDefault();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check wall collision
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check self collision
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const intervalId = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(intervalId);
  }, [food, gameOver, isPaused, generateFood]);

  // Draw canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw grid lines (optional, for glitch aesthetic)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= CANVAS_SIZE; i += CELL_SIZE) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, CANVAS_SIZE);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(CANVAS_SIZE, i);
      ctx.stroke();
    }

    // Draw food
    ctx.fillStyle = '#ff00ff'; // Magenta
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#ff00ff';
    ctx.fillRect(food.x * CELL_SIZE + 2, food.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4);

    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#ffffff' : '#00ffff'; // Cyan body, white head
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = index === 0 ? '#ffffff' : '#00ffff';
      ctx.fillRect(segment.x * CELL_SIZE + 1, segment.y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
    });

    // Reset shadow
    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-4 border-2 border-[#00ffff] bg-[#050505] relative overflow-hidden shadow-[0_0_20px_rgba(0,255,255,0.2)]">
      {/* Glitch decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-[#ff00ff] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-1/2 h-1 bg-[#00ffff] opacity-50"></div>
      
      <div className="flex justify-between w-full mb-4 px-2">
        <div className="text-[#00ffff] text-xl uppercase tracking-widest">
          Score: <span className="text-white">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="text-[#ff00ff] text-xl uppercase tracking-widest">
          SYS.OP.SNAKE
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="border border-[#333] bg-black"
        />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm">
            <h2 className="text-4xl text-[#ff00ff] mb-2 glitch font-bold" data-text="SYSTEM FAILURE">SYSTEM FAILURE</h2>
            <p className="text-[#00ffff] mb-6 text-lg">FINAL SCORE: {score}</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 border-2 border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-colors uppercase tracking-widest font-bold cursor-pointer"
            >
              REBOOT_
            </button>
          </div>
        )}

        {isPaused && !gameOver && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <h2 className="text-3xl text-white glitch" data-text="PAUSED">PAUSED</h2>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-gray-500 uppercase tracking-widest flex gap-4">
        <span>[W,A,S,D] / ARROWS : MOVE</span>
        <span>[SPACE] : PAUSE</span>
      </div>
    </div>
  );
}
