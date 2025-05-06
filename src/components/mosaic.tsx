import React from 'react';
import styled from 'styled-components';
import { Tile as TileType, DefaultMosaicColors } from '../game/types';

interface MosaicProps {
  wall: (TileType | null)[][]; // The wall grid from the player's board
}

// Styled Components
const MosaicContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-gap: 5px;
`;

const MosaicTile = styled.div<{ color?: string; filled: boolean }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) => (props.color ? props.color : '#e0e0e0')};
  border: 1px solid #000;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: ${(props) => (props.filled ? 'bold' : 'normal')};
  color: ${(props) => (props.color ? '#fff' : '#000')};
  opacity: ${(props) => (props.filled ? 1 : 0.2)}; /* Dim unfilled tiles */
`;

export const MosaicComponent: React.FC<MosaicProps> = ({ wall }) => {
  return (
    <MosaicContainer>
      {wall.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <MosaicTile
            key={`${rowIndex}-${colIndex}`}
            color={tile?.color || DefaultMosaicColors[rowIndex][colIndex]} // Use default color if tile is null
            filled={tile !== null} // Bold only if the tile is filled
          >
            {tile ? '' : ''}
          </MosaicTile>
        ))
      )}
    </MosaicContainer>
  );
};