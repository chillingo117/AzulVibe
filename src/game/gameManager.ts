import { AllColors, Factory, Player, PlayerBoard, Tile, DefaultMosaicColors } from './types';

/**
 * GameManager managers the game state
 */
export class GameManager {
  players: Player[];
  factories: Factory[];
  tileBag: Tile[];
  center: Tile[];
  currentPlayerIndex: number = 0;
  round: number;

  constructor(playerNames: string[]) {
    this.round = 1; // Start at round 1
    this.tileBag = this.generateTileBag();
    this.center = [];
    this.players = playerNames.map((name, i) => ({
      id: i,
      name,
      score: 0,
      board: this.initializeBoard(),
    }));
    this.factories = this.initializeFactories();
    this.fillFactories();
  }

  getCurrentPlayer(): Player {
    return this.players[this.currentPlayerIndex];
  }
  
  nextTurn(): void {
    this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
  }  

  generateTileBag(): Tile[] {
    const colors = AllColors;
    let bag: Tile[] = [];
    for (const color of colors) {
      for (let i = 0; i < 20; i++) bag.push({color, selected: false}); // 100 total
    }
    return this.shuffle(bag);
  }

  shuffle<T>(array: T[]): T[] {
    return array.sort(() => Math.random() - 0.5);
  }

  initializeFactories(): Factory[] {
    const numFactories = this.players.length === 2 ? 5 : 7;
    return Array.from({ length: numFactories }, (_, i) => ({
      id: i,
      tiles: [],
    }));
  }

  fillFactories(): void {
    for (let factory of this.factories) {
      factory.tiles = this.tileBag.splice(0, 4);
    }
    this.center = [];
  }

  initializeBoard(): PlayerBoard {
    return {
      wall: DefaultMosaicColors.map((row) => row.map((color) => null)),
      patternLines: Array.from({ length: 5 }, (_, i) => Array(i + 1).fill(null)),
      floorLine: [],
    };
  }

  //Tile Management
  selectTiles(color: string, factoryId?: number): { selected: Tile[]; leftover: Tile[] } {
    if(factoryId === undefined) {
      const selected = this.center.filter((tile) => tile.color === color).map((tile) => ({ ...tile, selected: true }));
      this.center = this.center.filter((tile) => tile.color !== color);
      return { selected, leftover: [] };
    }

    const factory = this.factories.find((f) => f.id === factoryId);
    if (!factory) throw new Error(`Factory with ID ${factoryId} not found`);

    const selected = factory.tiles.filter((tile) => tile.color === color).map((tile) => ({ ...tile, selected: true }));
    const leftover = factory.tiles.filter((tile) => tile.color !== color).map((tile) => ({ ...tile, selected: true }));

    return { selected, leftover };
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
    const wallRow = player.board.wall[row];

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

  resetFloorLines() {
    this.players.forEach((player) => {
      player.board.floorLine = [];
    });
  }
  

  shuffleTileBag() {
    for (let i = this.tileBag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.tileBag[i], this.tileBag[j]] = [this.tileBag[j], this.tileBag[i]];
    }
  }
  
  refillFactories() {
    // Empty current factories and reset them with 4 tiles each
    this.factories.forEach(factory => factory.tiles = []);
    this.center = [];
  
    this.shuffleTileBag();
    
    this.factories.forEach((factory) => {
      for (let i = 0; i < 4; i++) {
        factory.tiles.push(this.tileBag.pop()!);
      }
    });
  
    // Fill the center with the leftover tiles
    this.center.push(...this.tileBag.splice(0, 4));
  }
  
  resetRound() {
    this.resetFloorLines();
    this.refillFactories();
  }

  calculateScore(player: Player) {
    let score = 0;
  
    // Calculate row bonuses
    player.board.patternLines.forEach((line, index) => {
      const consecutiveCount = line.filter(tile => tile !== null).length;
      if (consecutiveCount > 0) {
        score += consecutiveCount;
      }
    });
  
    // Calculate vertical bonuses (column check)
    for (let col = 0; col < 5; col++) {
      let columnCount = 0;
      for (let row = 0; row < 5; row++) {
        if (player.board.patternLines[row][col] !== null) {
          columnCount++;
        }
      }
      if (columnCount > 0) score += columnCount;
    }
  
    // Add other scoring rules (like completed lines, etc.)
    return score;
  }
  
  updateScores() {
    this.players.forEach((player) => {
      // Move tiles to the mosaic wall
      this.moveTilesToMosaic(player);

      // Calculate and update the player's score
      const score = this.calculateScore(player);
      player.score += score;
    });
  }
  
  nextRound() {
    this.currentPlayerIndex = 0; // Reset to first player
    this.round++; // Increment round number
    this.resetRound(); // Reset the board for the new round
  }

  moveTilesToMosaic(player: Player) {
    player.board.patternLines.forEach((line, rowIndex) => {
      const isRowFull = line.every((tile) => tile !== null); // Check if the row is full

      if (isRowFull) {
        // Add the first tile in the row to the mosaic wall
        const tileToAdd = line[0]; // All tiles in the row are the same color
        if (tileToAdd) {
          player.board.wall[rowIndex][rowIndex] = tileToAdd; // Add to the mosaic wall
        }

        // Clear the pattern line
        player.board.patternLines[rowIndex] = Array(line.length).fill(null);
      }
    });
  }
  
}
