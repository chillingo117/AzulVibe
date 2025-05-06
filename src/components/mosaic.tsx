import React from 'react';
import styled from 'styled-components';
import { Tile } from './tile';
import { Tile as TileType } from '../game/types';

interface MosaicProps {
  wall: (TileType | null)[][]; // The wall grid from the player's board
}

// Styled Components
const MosaicContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 40px);
  grid-gap: 5px;
  margin-top: 20px;
`;

const MosaicTile = styled.div<{ color?: string }>`
  width: 40px;
  height: 40px;
  background-color: ${(props) => (props.color ? props.color : '#e0e0e0')};
  border: 1px solid #000;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: ${(props) => (props.color ? '#fff' : '#000')};
`;

export const MosaicComponent: React.FC<MosaicProps> = ({ wall }) => {
  return (
    <MosaicContainer>
      {wall.map((row, rowIndex) =>
        row.map((tile, colIndex) => (
          <MosaicTile key={`${rowIndex}-${colIndex}`} color={tile?.color || undefined}>
            {tile ? '' : ''}
          </MosaicTile>
        ))
      )}
    </MosaicContainer>
  );
};