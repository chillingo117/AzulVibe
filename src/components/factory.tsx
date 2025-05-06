import React from 'react';
import styled from 'styled-components';
import { Factory } from '../game/types';

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

const Tile = styled.button<{ color: string }>`
  display: inline-block;
  width: 30px;
  height: 30px;
  background-color: ${(props) => props.color || '#ccc'};
  border: 1px solid #000;
  border-radius: 5px;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.1);
    border-color: #005b99;
  }
`;

export const FactoryComponent: React.FC<Props> = ({ factory, onSelectTile }) => {
  const handleClick = (tile: string) => {
    onSelectTile(tile, factory.id); // Pass the selected tile and factory ID
  };

  return (
    <FactoryContainer>
      {factory.tiles.map((tile, idx) => (
        <Tile
          key={idx}
          color={tile}
          onClick={() => handleClick(tile)}
        >
          {tile}
        </Tile>
      ))}
    </FactoryContainer>
  );
};
