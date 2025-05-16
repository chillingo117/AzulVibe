import { shuffle } from '../utils/utils';
import { AllColors, Factory, Player, PlayerBoard, Tile, DefaultMosaicColors, FloorLinePenalties } from './types';

/**
 * GameManager managers the game state
 */
export class GameManager {
  players: Player[];
  factories!: Factory[];
  private tileBag!: Tile[];
  center: Tile[];
  currentPlayerIndex: number = 0;
  round: number;

  constructor(playerNames: string[]) {
    this.round = 1; // Start at round 1

    this.players = playerNames.map((name, i) => ({
      id: i,
      name,
      score: 0,
      board: this.initializeBoard(),
    }));

    this.refillTileBag();

    this.center = [];
    this.initializeFactories();
  }

  // #region initialization
  /**
   * Initializes the factories with tiles from the tile bag
   */
  private initializeFactories() {
    const numFactories = this.players.length === 2 ? 5 : 7;
    this.factories = Array.from({ length: numFactories }, (_, i) => ({
      id: i,
      tiles: [],
    }));
    this.fillFactories();
  }

  private initializeBoard(): PlayerBoard {
    return {
      wall: DefaultMosaicColors.map((row) => row.map((color) => null)),
      patternLines: Array.from({ length: 5 }, (_, i) => Array(i + 1).fill(null)),
      floorLine: [],
    };
  }
  // #endregion initialization

  // #region end game management
  isGameOver(): boolean {
    return this.players.some((player) =>     // if any player
        player.board.wall.some((row) =>      // has any row
          row.every((tile) => tile !== null  // that is completely filled
        )
      )
    ); // Check if any player has completed any row of the wall
  }

  // #region round management

  nextRound() {
    this.players.forEach((player) => {
      this.moveTilesToMosaicAndScore(player);
      this.clearFloorAndPenalise(player);
    });

    if(this.isGameOver()) {
      const winner = this.players.reduce((prev, curr) => (prev.score > curr.score ? prev : curr));
      alert(`Game Over! ${winner.name} wins with ${winner.score} points!`); // Handle game over logic here
      return;
    }
    this.currentPlayerIndex = 0; // Reset to first player

    this.fillFactories();  
    this.round++; // Increment round number
  }

  private moveTilesToMosaicAndScore(player: Player) {
    player.board.patternLines.forEach((line, rowIndex) => {
      const isRowFull = line.every((tile) => tile !== null); // Check if the row is full

      if (isRowFull) {
        const tileToAdd = line[0]; // Take one of the tiles to add to the wall
        // Clear the rest
        player.board.patternLines[rowIndex] = Array(line.length).fill(null);

        const colIndex = DefaultMosaicColors[rowIndex].indexOf(tileToAdd!.color); // Get the column index for the wall based on tile color

        if (player.board.wall[rowIndex][colIndex] !== null) { // If the wall position is already occupied
          player.board.floorLine.concat(line as Tile[]); // Move the entire pattern to the floor line
          // floor penalties are applied later
        } else {
          player.board.wall[rowIndex][colIndex] = tileToAdd; // Add to the mosaic wall
          player.score++; // Increment score for placing a tile

          // Calc and add additional score

          // Starting with the tile to the left of the current tile, check if it is there, if so, increment score and move left
          if(colIndex > 0){
            for (let i = colIndex-1; i >= 0 && player.board.wall[rowIndex][i] !== null; i--) {
              player.score++;
            }
          }
          // Ditto for the right side
          if(colIndex < 4) {
            for (let i = colIndex + 1; i < 5 && player.board.wall[rowIndex][i] !== null; i++) {
              player.score++;
            }
          }
          // Ditto for upwards
          if(rowIndex > 0) {
            for (let i = rowIndex-1; i >= 0 && player.board.wall[i][colIndex] !== null; i--) {
              player.score++;
            }
          }
          // Ditto for downwards
          if(rowIndex < 4) {
            for (let i = rowIndex+1; i < 5 && player.board.wall[i][colIndex] !== null; i++) {
              player.score++;
            }
          }
        }

        // The pattern line has been moved to floor or cleared by adding to mosiac, so clear the pattern line
        player.board.patternLines[rowIndex] = Array(line.length).fill(null);
      }
    });
  }

  private clearFloorAndPenalise(player: Player) {
    const floorLine = player.board.floorLine;
    const penaltyCount = Math.min(floorLine.length, FloorLinePenalties.length); // Max penalty is 7 tiles
    const penalty = FloorLinePenalties.slice(0, penaltyCount).reduce((sum, p) => sum + p, 0);

    player.score += penalty; // Deduct points (penalty is negative)
    if (player.score < 0) player.score = 0; // Ensure score doesn't go below 0

    // Clear the floor line
    player.board.floorLine = [];
  }

  /**
   * Fills the factories with tiles from the tile bag
   * Each factory gets 4 tiles
   */
  private fillFactories(): void {
    for (let factory of this.factories) {
      // Technically speaking this can cause the tile bag to have more tiles than it should
      // but since the extras will immediately be sliced onto the factory, it doesn't matter
      if(this.tileBag.length < 4) {
        this.refillTileBag(); // Refill the tile bag if it's empty
      }
      factory.tiles = this.tileBag.splice(0, 4);
    }
  }

  // #endregion round management

  // #region tile bag management

  /**
   * Refills the tile bag with 20 tiles of each color
   */
  private refillTileBag() {
    const colors = AllColors;
    let bag: Tile[] = [];
    for (const color of colors) {
      for (let i = 0; i < 20; i++) bag.push({color, selected: false}); // 100 total
    }
    this.tileBag = shuffle(bag);
  }

  // #endregion tile bag management

  // #region action management
  advanceToNextPlayer(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }  

  selectTiles(color: string, factoryId?: number): Tile[] {
    if(factoryId === undefined) {
      const selected = this.center.filter((tile) => tile.color === color).map((tile) => ({ ...tile, selected: true }));
      this.center = this.center.filter((tile) => tile.color !== color);
      return selected;
    }

    const factory = this.factories.find((f) => f.id === factoryId);
    if (!factory) throw new Error(`Factory with ID ${factoryId} not found`);

    const selected = factory.tiles.filter((tile) => tile.color === color).map((tile) => ({ ...tile, selected: true }));
    const leftover = factory.tiles.filter((tile) => tile.color !== color).map((tile) => ({ ...tile, selected: true }));

    // Remove tiles from the factory
    this.factories = this.factories.map((factory) =>
      factory.id === factoryId ? { ...factory, tiles: [] } : factory
    );

    // Move leftover tiles to the center pool
    this.center = [...this.center, ...leftover];
    return selected;
  }

  canPlaceTiles(playerId: number, row: number, tiles: Tile[]): boolean {
    const player = this.players[playerId];
    const line = player.board.patternLines[row];
    const wallRow = player.board.wall[row];

    // Rule: Prevent placing tiles if the color is already completed in the mosaic row
    const tileColor = tiles[0].color;
    if (wallRow.some((tile) => tile?.color === tileColor)) {
      alert(`You cannot place tiles of color ${tileColor} in this row as it is already completed in the mosaic wall.`);
      return false;
    }

    // Rule: All tiles in a line must match the same color
    if (line.some((t) => t !== null && t.color !== tileColor)) {
      alert(`You cannot place tiles of different colors in the same line.`);
      return false;
    }

    // Rule: Line must not be full
    if (line.every((t) => t !== null)) {
      alert(`You cannot place tiles in a full line.`);
      return false;
    }

    return true;
  }

  placeTiles(playerId: number, row: number, tiles: Tile[]): void {
    const player = this.players[playerId];
    const line = player.board.patternLines[row];

    // Place tiles in the pattern line
    for (let i = 0; i < line.length && tiles.length > 0; i++) {
      if (line[i] === null) {
        line[i] = tiles.shift()!;
      }
    }

    // Leftovers go to the floor line
    player.board.floorLine.push(...tiles);

    // Reset selected state for tiles in the center
    this.center = this.center.map((t) => ({ ...t, selected: false }));
  }

  addToFloorLine(playerId: number, tiles: Tile[]): void {
    const player = this.players[playerId];
    const floorLine = player.board.floorLine;

    // Add tiles to the floor line
    floorLine.push(...tiles);
    // Penalties are applied in the updateScores method
  }

  // #endregion action management
}
