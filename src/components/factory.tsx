import React from 'react';
import styled from 'styled-components';
import { Factory } from '../game/types';
import { Tile } from './tile';

interface Props {
  factory: Factory;
  onSelectTile: (color: string, factoryId: number) => void;
}

// Styled Components
const FactoryContainer = styled.div`
  border: 2px solid #003366;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px;
  width: 120px;
  height: 120px;
`;

export const FactoryComponent: React.FC<Props> = ({ factory, onSelectTile }) => {
  const handleClick = (tileColor: string) => {
    onSelectTile(tileColor, factory.id);
  };

  return (
    <FactoryContainer>
      {factory.tiles.map((tile, idx) => (
        <Tile
          key={idx}
          tile={tile} // Pass the entire TileType object
          onClick={() => handleClick(tile.color)}
        />
      ))}
    </FactoryContainer>
  );
};
