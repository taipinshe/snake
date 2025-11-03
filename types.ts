export interface Position {
  x: number;
  y: number;
}

export enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export enum GameState {
  START,
  RUNNING,
  PAUSED,
  GAME_OVER,
  LEVEL_CLEARED,
  VICTORY,
}
