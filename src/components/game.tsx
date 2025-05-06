import React, { useRef, useState } from 'react';
import { GameManager } from '../game/gameManager';
import { FactoryComponent } from './factory';
import { PlayerBoardComponent } from './playerBoard';
import styled from 'styled-components';
import { Tile as TileType } from '../game/types';
import { Tile } from './tile';
import { SelectedTilesComponent } from './selectedTiles';

interface GameProps {
  playerNames: string[];
}

// Styled Components
const GameContainer = styled.div`
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f8ff;
`;

const FactoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const PlayerBoardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 40px; /* Add spacing between player boards */
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: #003366;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005b99;
  }
`;

const CenterPool = styled.div`
  margin: 20px 0;
  padding: 10px;
  border: 2px solid #003366;
  border-radius: 10px;
  background-color: #f9f9f9;
  display: flex;
  gap: 10px;
  justify-content: center;
`;

export const Game: React.FC<GameProps> = ({ playerNames }) => {
  const gameManagerRef = useRef(new GameManager(playerNames));
  const game = gameManagerRef.current;

  const [selectedTiles, setSelectedTiles] = useState<{
    tiles: TileType[];
    color: string;
    factoryId?: number;
  } | null>(null);

  const [version, setVersion] = useState(0); // Add a version state to trigger re-renders

  const handleSelectTile = (color: string, factoryId?: number) => {
    console.log('Selected tile color:', color);
    console.log('Selected factory ID:', factoryId);
    const { selected, leftover } = game.selectTiles(color, factoryId);
    setSelectedTiles({ tiles: selected, color, factoryId });

    // Move leftover tiles to the center pool
    game.center = [...game.center, ...leftover];

    // Remove tiles from the factory
    game.factories = game.factories.map((factory) =>
    factory.id === factoryId ? { ...factory, tiles: [] } : factory
    );
  };

  const handlePlaceTiles = (row: number) => {
    if (!selectedTiles) return;

    const currentPlayer = game.getCurrentPlayer();
    const tilesToPlace = selectedTiles.tiles;

    game.placeTiles(currentPlayer.id, row, tilesToPlace);
    game.nextTurn();
    setSelectedTiles(null);
  };

  const handleEndRound = () => {
    // Check if all tiles are taken
    const allFactoriesEmpty = game.factories.every((factory) => factory.tiles.length === 0);
    const centerPoolEmpty = game.center.length === 0;

    if (!allFactoriesEmpty || !centerPoolEmpty) {
      alert("You cannot end the round until all tiles are taken!");
      return;
    }

    // Update player scores and move to the next round
    game.updateScores();
    game.nextRound();
    setVersion((v) => v + 1); // Trigger a re-render
  };

  const handleClearSelection = () => {
    if (!selectedTiles) return;

    const { tiles, factoryId } = selectedTiles;

    if (factoryId !== undefined) {
      // Return tiles to the original factory
      const factory = game.factories.find((f) => f.id === factoryId);
      if (factory) {
        factory.tiles.push(...tiles);
        const toSendBackToFactory = game.center.filter((tile) => tile.selected);
        game.center = game.center.filter((tile) => !tile.selected);

        toSendBackToFactory.forEach((tile) => (tile.selected = false)); // Reset selected state
        factory.tiles.push(...toSendBackToFactory);
      }
    } else {
      // Return tiles to the center pool
      game.center.push(...tiles);
    }
    tiles.forEach((tile) => (tile.selected = false)); // Reset selected state

    setSelectedTiles(null); // Clear the selection
  };

  const canEndRound = () => {
    const allFactoriesEmpty = game.factories.every((factory) => factory.tiles.length === 0);
    const centerPoolEmpty = game.center.length === 0;
    return allFactoriesEmpty && centerPoolEmpty;
  };

  return (
    <GameContainer>
      <h1>Azul Game</h1>
      <div>Current Round: {game.round}</div>

      {/* Conditionally render the End Round button */}
      {canEndRound() && <Button onClick={handleEndRound}>End Round</Button>}

      {/* Selected Tiles */}
      <SelectedTilesComponent
        tiles={selectedTiles?.tiles || []}
        color={selectedTiles?.color || null}
        onClearSelection={handleClearSelection}
      />

      {/* Center Pool */}
      <CenterPool>
        <h3>Center Pool:</h3>
        {game.center.map((tile, idx) => (
          <Tile
            key={idx}
            tile={tile}
            onClick={() => handleSelectTile(tile.color)} // Handle tile selection
          />
        ))}
      </CenterPool>

      {/* Factories */}
      <FactoriesContainer>
        {game.factories.map((factory, idx) => (
          <FactoryComponent
            key={idx}
            factory={factory}
            onSelectTile={handleSelectTile}
          />
        ))}
      </FactoriesContainer>

      {/* Player Boards */}
      <PlayerBoardsContainer>
        {game.players.map((player) => (
          <PlayerBoardComponent
            key={player.id}
            player={player}
            isCurrent={player.id === game.getCurrentPlayer().id}
            onPlaceTiles={handlePlaceTiles}
          />
        ))}
      </PlayerBoardsContainer>
    </GameContainer>
  );
};
