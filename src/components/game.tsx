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

const PlayerArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  width: 100%;
`;

const PlayerBoardsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px; /* Add spacing between player boards */
  flex-wrap: wrap; /* Allow wrapping if there are many players */
  width: 100%;
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

const CenterAndSelectedContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 20px; /* Space between center pool and selected tiles */
  margin: 20px 0;
`;

export const Game: React.FC<GameProps> = ({ playerNames }) => {
  const gameManagerRef = useRef(new GameManager(playerNames));
  const game = gameManagerRef.current;

  const [selectedTiles, setSelectedTiles] = useState<{
    tiles: TileType[];
    color: string;
    factoryId?: number;
  } | null>(null);

  // eslint-disable-next-line
  const [_, setVersion] = useState(0); // Add a version state to trigger re-renders

  const handleSelectTile = (color: string, factoryId?: number) => {
    if (selectedTiles) {
      // If tiles are already selected, clear the selection
      handleClearSelection();
    }
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

    let tilesWerePlaced = false;
    if (row === -1) {
      // Handle floor line placement
      game.addToFloorLine(currentPlayer.id, tilesToPlace);
      tilesWerePlaced = true;
    } else if (game.canPlaceTiles(currentPlayer.id, row, tilesToPlace)) {
      game.placeTiles(currentPlayer.id, row, tilesToPlace);
      game.addToFloorLine(currentPlayer.id, tilesToPlace);
      tilesWerePlaced = true;
    }

    if(tilesWerePlaced) {
        game.nextTurn();
        setSelectedTiles(null);
    }
  };

  const handleEndRound = () => {
    const allFactoriesEmpty = game.factories.every((factory) => factory.tiles.length === 0);
    const centerPoolEmpty = game.center.length === 0;
    const noSelectedTiles = selectedTiles === null;

    if (!allFactoriesEmpty || !centerPoolEmpty || !noSelectedTiles) {
      alert("You cannot end the round until all tiles are taken!");
      return;
    }

    game.updateScores();
    game.nextRound();
    setVersion((v) => v + 1); // Trigger a re-render
  };

  const handleClearSelection = () => {
    if (!selectedTiles) return;

    const { tiles, factoryId } = selectedTiles;

    if (factoryId !== undefined) {
      const factory = game.factories.find((f) => f.id === factoryId);
      if (factory) {
        factory.tiles.push(...tiles);
        const toSendBackToFactory = game.center.filter((tile) => tile.selected);
        game.center = game.center.filter((tile) => !tile.selected);

        toSendBackToFactory.forEach((tile) => (tile.selected = false));
        factory.tiles.push(...toSendBackToFactory);
      }
    } else {
      game.center.push(...tiles);
    }
    tiles.forEach((tile) => (tile.selected = false));

    setSelectedTiles(null);
  };

  const canEndRound = () => {
    const allFactoriesEmpty = game.factories.every((factory) => factory.tiles.length === 0);
    const centerPoolEmpty = game.center.length === 0;
    const noSelectedTiles = selectedTiles === null;
    return allFactoriesEmpty && centerPoolEmpty && noSelectedTiles;
  };

  return (
    <GameContainer>
      <h1>Azul Game</h1>
      <div>Current Round: {game.round}</div>

      {canEndRound() && <Button onClick={handleEndRound}>End Round</Button>}

      {/* Center Pool and Selected Tiles */}
      <CenterAndSelectedContainer>
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
      </CenterAndSelectedContainer>

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

      {/* Player Area */}
      <PlayerArea>
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
      </PlayerArea>
    </GameContainer>
  );
};
