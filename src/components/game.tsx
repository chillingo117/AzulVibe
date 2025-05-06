import React, { useRef, useState } from 'react';
import { GameManager } from '../game/gameManager';
import { FactoryComponent } from './factory';
import { PlayerBoardComponent } from './playerBoard';
import { Color } from '../game/types';
import styled from 'styled-components';

// Game Container
const GameContainer = styled.div`
  font-family: 'Arial', sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: #f0f8ff;
`;

// Button with Hover Effect
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

// Player Display
const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Player = styled.div`
  background-color: #f0f8ff;
  padding: 10px;
  border: 1px solid #003366;
  border-radius: 5px;
  width: 200px;
  text-align: center;
`;

interface TileProps {
    color: string; // Tile is just a color, so we expect a string for color
  }
  

// Factory Tile
const Tile = styled.div<TileProps>`
  width: 50px;
  height: 50px;
  border-radius: 5px;
  background-color: ${(props) => props.color};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #ffb84d; /* Yellow highlight on hover */
  }
`;


export const Game: React.FC = () => {
  const playerNames = ['Alice', 'Bob'];
  const gameManagerRef = useRef(new GameManager(playerNames));
  const [version, setVersion] = useState(0);
  const game = gameManagerRef.current;

  const [selectedTiles, setSelectedTiles] = useState<{ tiles: Color[]; color: string } | null>(null);

  const handleSelectTile = (color: string, factoryId: number) => {
    const { selected } = game.selectTiles(factoryId, color);
    setSelectedTiles({ tiles: selected, color });
    setVersion(v => v + 1); // Trigger re-render
  };
  
  const handlePlaceTiles = (row: number) => {
    if (!selectedTiles) return;
    const currentPlayer = game.getCurrentPlayer();
    game.placeTiles(currentPlayer.id, row, [...selectedTiles.tiles]);
    game.nextTurn();
    setSelectedTiles(null);
    setVersion(v => v + 1); // Trigger re-render
  };

  const handleEndRound = () => {
    game.updateScores();  // Update player scores
    game.nextRound();     // Move to the next round
    setVersion((v) => v + 1);  // Trigger re-render by incrementing version
  };
  

  return (
    <GameContainer>
      <h1>Azul Game</h1>
      <div>Current Round: {game.round}</div>
      <Button onClick={handleEndRound}>End Round</Button>

      <PlayerList>
        {game.players.map((player) => (
          <Player key={player.id}>
            {player.name}: {player.score} points
          </Player>
        ))}
      </PlayerList>

      <div className="factory-container">
        {game.factories.map((factory, idx) => (
          <div key={idx} className="factory">
            {factory.tiles.map((tile, tileIdx) => (
              <Tile key={tileIdx} color={tile} />
            ))}
          </div>
        ))}
      </div>
    </GameContainer>
  );
};
