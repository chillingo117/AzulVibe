/**
 * This file contains object types used in the Azul game
 */
export type Color = 'blue' | 'yellow' | 'red' | 'black' | 'white';
export const AllColors: Color[] = ['blue', 'yellow', 'red', 'black', 'white'];
export type Tile = {color: Color, selected: boolean};

export const DefaultMosaicColors: Color[][] = [
  ['blue', 'yellow', 'red', 'black', 'white'],
  ['white', 'blue', 'yellow', 'red', 'black'],
  ['black', 'white', 'blue', 'yellow', 'red'],
  ['red', 'black', 'white', 'blue', 'yellow'],
  ['yellow', 'red', 'black', 'white', 'blue'],
];

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
