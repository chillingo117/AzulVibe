import React from 'react';
import styled from 'styled-components';
import { Player } from '../game/types';
import { Tile } from './tile';
import { MosaicComponent } from './mosaic';
import { ActionButton, theme } from '../utils/sharedStyles';

interface Props {
  player: Player;
  isCurrent: boolean;
  onPlaceTiles: (row: number) => void;
}

// Styled Components
const PlayerBoardContainer = styled.div`
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  padding: 20px;
  width: 500px;
  background-color: ${theme.colors.areaBackground};
  `;

const PatternLine = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
  margin-bottom: 10px;
  gap: 5px;
`;

const FloorLine = styled.div`
  margin-top: 10px;
  font-weight: bold;
  display: flex;
  gap: 5px;
`;

const PlaceButton = styled(ActionButton)`  
  padding: 5px 10px;
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
  gap: 3px;
`;

export const PlayerBoardComponent: React.FC<Props> = ({ player, isCurrent, onPlaceTiles }) => {
  const handlePlaceFloor = () => {
    // Trigger the floor placement logic
    onPlaceTiles(-1); // Use -1 to indicate the floor line
  };

  return (
    <PlayerBoardContainer className={isCurrent ? 'current-player' : ''}>
      <h2>{player.name} (Score: {player.score})</h2>

      <BoardContent>
        {/* Pattern Rows */}
        <PatternLinesContainer>
          {player.board.patternLines.map((line, row) => (
            <PatternLine key={row}>
              {isCurrent && (
                <PlaceButton onClick={() => onPlaceTiles(row)}>Place</PlaceButton>
              )}
              {line.map((tile, col) => (
                <Tile key={col} tile={tile} />
              ))}
            </PatternLine>
          ))}

          {/* Floor Line */}
          <FloorLine>
            <strong>Floor:</strong>
            {player.board.floorLine.map((tile, idx) => (
              <Tile key={idx} tile={tile} />
            ))}
            {isCurrent && (
              <PlaceButton onClick={handlePlaceFloor}>Place Floor</PlaceButton>
            )}
          </FloorLine>
        </PatternLinesContainer>

        {/* Mosaic */}
        <MosaicComponent wall={player.board.wall} />
      </BoardContent>
    </PlayerBoardContainer>
  );
};
