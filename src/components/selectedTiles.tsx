import React from 'react';
import styled from 'styled-components';
import { Tile } from './tile';
import { Tile as TileType } from '../game/types';

interface SelectedTilesProps {
  tiles: TileType[]; // Array of selected tile colors
  color: string | null; // The color of the selected tiles
  onClearSelection: () => void; // Callback to clear the selection
}

// Styled Components
const SelectedTilesContainer = styled.div`
  border: 2px solid #003366;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 200px;
`;

const TilesRow = styled.div`
  display: flex;
  gap: 5px;
`;

const ClearButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  font-size: 14px;
  padding: 5px 10px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #cc0000;
  }
`;

export const SelectedTilesComponent: React.FC<SelectedTilesProps> = ({ tiles, color, onClearSelection }) => {
  return (
    <SelectedTilesContainer>
      <h3>Selected Tiles</h3>
      {tiles.length > 0 ? (
        <>
          <TilesRow>
            {tiles.map((tile, idx) => (
              <Tile key={idx} color={color} />
            ))}
          </TilesRow>
          <ClearButton onClick={onClearSelection}>Clear Selection</ClearButton>
        </>
      ) : (
        <p>No tiles selected</p>
      )}
    </SelectedTilesContainer>
  );
};