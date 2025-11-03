import { Direction } from './types';
import type { Position } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE_POSITION: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];
export const INITIAL_FOOD_POSITION: Position = { x: 15, y: 10 };
export const INITIAL_DIRECTION = Direction.RIGHT;

export const LEVELS: { level: number; targetScore: number; speed: number; obstacles: Position[] }[] = [
  { level: 1, targetScore: 5, speed: 150, obstacles: [] },
  { level: 2, targetScore: 10, speed: 130, obstacles: [
      {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6},
      {x: 14, y: 13}, {x: 14, y: 14}, {x: 14, y: 15}, {x: 14, y: 16},
  ] },
  { level: 3, targetScore: 15, speed: 110, obstacles: [
      {x: 0, y: 9}, {x: 1, y: 9}, {x: 2, y: 9}, {x: 3, y: 9}, {x: 4, y: 9}, {x: 5, y: 9},
      {x: 19, y: 10}, {x: 18, y: 10}, {x: 17, y: 10}, {x: 16, y: 10}, {x: 15, y: 10}, {x: 14, y: 10},
  ] },
    { level: 4, targetScore: 20, speed: 90, obstacles: [
        ...Array.from({ length: 10 }, (_, i) => ({ x: 4, y: i + 5 })),
        ...Array.from({ length: 10 }, (_, i) => ({ x: 15, y: i + 5 })),
  ] },
  { level: 5, targetScore: 25, speed: 70, obstacles: [
      ...Array.from({ length: 8 }, (_, i) => ({ x: i + 2, y: 4 })),
      ...Array.from({ length: 8 }, (_, i) => ({ x: i + 10, y: 4 })),
      ...Array.from({ length: 8 }, (_, i) => ({ x: i + 2, y: 15 })),
      ...Array.from({ length: 8 }, (_, i) => ({ x: i + 10, y: 15 })),
  ] },
];
