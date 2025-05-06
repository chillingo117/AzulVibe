import React from 'react';
import styled from 'styled-components';
import { Player } from '../game/types';
import { Tile } from './tile';
import { MosaicComponent } from './mosaic';

interface Props {
  player: Player;
  isCurrent: boolean;
  onPlaceTiles: (row: number) => void;
}

// Styled Components
const PlayerBoardContainer = styled.div`
  border: 2px solid #003366;
  border-radius: 10px;
  padding: 20px;
  width: 300px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PatternLine = styled.div`
  display: flex;
  justify-content: flex-end; /* Align rows to the right */
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
`;

const FloorLine = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const PlaceButton = styled.button`
  background-color: #003366;
  color: white;
  font-size: 12px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #005b99;
  }
`;

const BoardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px; /* Space between pattern rows and mosaic */
`;

const PatternLinesContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* Align rows to the right */
  gap: 10px;
`;

export const PlayerBoardComponent: React.FC<Props> = ({ player, isCurrent, onPlaceTiles }) => {
  return (
    <PlayerBoardContainer className={isCurrent ? 'current-player' : ''}>
      <h2>{player.name} (Score: {player.score})</h2>

      <BoardContent>
        {/* Pattern Rows */}
        <PatternLinesContainer>
          {player.board.patternLines.map((line, row) => (
            <PatternLine key={row}>
              {line.map((tile, col) => (
                <Tile key={col} tile={tile} />
              ))}
              {isCurrent && (
                <PlaceButton onClick={() => onPlaceTiles(row)}>Place</PlaceButton>
              )}
            </PatternLine>
          ))}

          {/* Floor Line */}
          <FloorLine>
            <strong>Floor:</strong> {player.board.floorLine.map((tile, idx) => (
              <Tile key={idx} tile={tile} />
            ))}
          </FloorLine>
        </PatternLinesContainer>

        {/* Mosaic */}
        <MosaicComponent wall={player.board.wall} />
      </BoardContent>
    </PlayerBoardContainer>
  );
};
