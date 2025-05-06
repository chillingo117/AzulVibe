/**
 * This file contains object types used in the Azul game
 */
export type Color = 'blue' | 'yellow' | 'red' | 'black' | 'white';
export const AllColors: Color[] = ['blue', 'yellow', 'red', 'black', 'white'];
export type Tile = {color: Color, selected: boolean};

export interface Factory {
  id: number;
  tiles: Tile[];
}

export interface Player {
  id: number;
  name: string;
  board: PlayerBoard;
  score: number;
}

export interface PlayerBoard {
  wall: (Tile | null)[][];
  patternLines: (Tile | null)[][];
  floorLine: Tile[];
}
