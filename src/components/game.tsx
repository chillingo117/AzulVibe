import React, { useRef, useState } from 'react';
import { GameManager } from '../game/gameManager';
import { FactoryComponent } from './factory';
import { PlayerBoardComponent } from './playerBoard';
import styled from 'styled-components';
import { Color } from '../game/types';

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
  gap: 20px;
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
  const [version, setVersion] = useState(0);
  const game = gameManagerRef.current;

  const [selectedTiles, setSelectedTiles] = useState<{ tiles: Color[]; color: string } | null>(null);

  const handleSelectTile = (color: string, factoryId: number) => {
    const { selected, leftover } = game.selectTiles(factoryId, color); // Get selected and leftover tiles
    setSelectedTiles({ tiles: selected, color });

    // Move leftover tiles to the center pool
    game.center = [...game.center, ...leftover];

    // Remove tiles from the factory
    game.factories = game.factories.map((factory) =>
      factory.id === factoryId ? { ...factory, tiles: [] } : factory
    );

    setVersion((v) => v + 1); // Trigger re-render
  };

  const handlePlaceTiles = (row: number) => {
    if (!selectedTiles) return;
    const currentPlayer = game.getCurrentPlayer();
    game.placeTiles(currentPlayer.id, row, [...selectedTiles.tiles]);
    game.nextTurn();
    setSelectedTiles(null);
    setVersion((v) => v + 1); // Trigger re-render
  };

  const handleEndRound = () => {
    game.updateScores(); // Update player scores
    game.nextRound(); // Move to the next round
    setVersion((v) => v + 1); // Trigger re-render
  };

  return (
    <GameContainer>
      <h1>Azul Game</h1>
      <div>Current Round: {game.round}</div>
      <Button onClick={handleEndRound}>End Round</Button>

      {/* Center Pool */}
      <CenterPool>
        <h3>Center Pool:</h3>
        {game.center.map((tile, idx) => (
          <div key={idx} className="tile" style={{ backgroundColor: tile }}>
            {tile}
          </div>
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
