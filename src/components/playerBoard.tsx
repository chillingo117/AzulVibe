import React from 'react';
import styled from 'styled-components';
import { Player } from '../game/types';

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
  margin-bottom: 10px;
`;

const Tile = styled.span<{ color: string }>`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 2px;
  background-color: ${(props) => props.color || '#ccc'};
  border: 1px solid #000;
  border-radius: 5px;
`;

const FloorLine = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

export const PlayerBoardComponent: React.FC<Props> = ({ player, isCurrent, onPlaceTiles }) => {
  return (
    <PlayerBoardContainer className={isCurrent ? 'current-player' : ''}>
      <h2>{player.name} (Score: {player.score})</h2>

      <div className="pattern-lines">
        {player.board.patternLines.map((line, row) => (
          <PatternLine key={row}>
            <span>Row {row + 1}: </span>
            {line.map((tile, col) => (
              <Tile key={col} color={tile || 'transparent'}>{tile || '-'}</Tile>
            ))}
            {isCurrent && (
              <button onClick={() => onPlaceTiles(row)}>Place Here</button>
            )}
          </PatternLine>
        ))}
      </div>

      <FloorLine>
        <strong>Floor:</strong> {player.board.floorLine.map((tile, idx) => (
          <Tile key={idx} color={tile}>{tile}</Tile>
        )) || '—'}
      </FloorLine>
    </PlayerBoardContainer>
  );
};
