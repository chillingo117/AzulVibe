import React, { useRef, useState, useEffect } from 'react';
import { GameManager } from '../game/gameManager';
import { FactoryComponent } from './factory';
import { PlayerBoardComponent } from './playerBoard';
import styled from 'styled-components';
import { Tile } from './tile';
import { SelectedTilesComponent } from './selectedTiles';
import { theme } from '../utils/sharedStyles';
import AiMoveButton from './AiMoveButton';

interface GameProps {
  playerNames: string[];
}

// Styled Components
const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background-color: ${theme.colors.background};
`;

const FactoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 20px 0;
`;

const PlayerBoardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  gap: 40px; /* Add spacing between player boards */
  flex-wrap: wrap; /* Allow wrapping if there are many players */
  width: 100%;
`;

const CenterPool = styled.div`
  margin: 20px 0;
  padding: 10px;
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  background-color: ${theme.colors.areaBackground};
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

  // eslint-disable-next-line
  const [_, setVersion] = useState(0); // Add a version state to trigger re-renders

  // AI service availability state
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    // Check if AI backend is available
    const checkAiService = async () => {
      try {
        const res = await fetch('http://localhost:3001/heartbeat', { method: 'GET' });
        setAiAvailable(res.ok);
      } catch {
        setAiAvailable(false);
      }
    };
    checkAiService();
  }, []);

  const handleSelectTile = (color: string, factoryId?: number) => {
    if (game.selected) {
      // If tiles are already selected, clear the selection
      handleClearSelection();
    }
    game.selectTiles(color, factoryId);
    setVersion(v => v + 1);
  };

  const handlePlaceTiles = (row: number) => {
    if (!game.selected) return;

    const currentPlayer = game.currentPlayerIndex;

    if (game.canPlaceTiles(currentPlayer, row)) {
      game.placeTiles(currentPlayer, row);
    }
    setVersion(v => v + 1);
  };

  const handleClearSelection = () => {
    game.unselectTiles();
    setVersion(v => v + 1);
  };

  const preAiMoveHook = () => {
    // Clear any existing tile selection before AI move
    handleClearSelection();
  }

  const handleAiMove = () => {
    // Trigger a re-render after AI move is executed
    setVersion(v => v + 1);
  };

  return (
    <GameContainer>
      <h1>Azul Game</h1>
      <div>Current Round: {game.round}</div>
    
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {aiAvailable && <AiMoveButton gameManager={game} onMoveExecuted={handleAiMove} preMoveHook={preAiMoveHook}/>}        
      </div>

      {/* Center Pool and Selected Tiles */}
      <CenterAndSelectedContainer>
        <SelectedTilesComponent
            tiles={game.selected?.tiles || []}
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
      <PlayerBoardsContainer>
        {game.players.map((player) => (
          <PlayerBoardComponent
            key={player.id}
            player={player}
            isCurrent={player.id === game.currentPlayerIndex}
            onPlaceTiles={handlePlaceTiles}
          />
        ))}
      </PlayerBoardsContainer>
    </GameContainer>
  );
};
