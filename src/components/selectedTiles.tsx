import React from 'react';
import styled from 'styled-components';
import { Tile } from './tile';
import { Tile as TileType } from '../game/types';
import { ActionButton, theme } from '../utils/sharedStyles';

interface SelectedTilesProps {
  tiles: TileType[]; // Array of selected tile colors
  onClearSelection: () => void; // Callback to clear the selection
}

// Styled Components
const SelectedTilesContainer = styled.div`
  border: 2px solid ${theme.colors.border};
  border-radius: 10px;
  padding: 10px;
  background-color: ${theme.colors.areaBackground};
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

const ClearButton = styled(ActionButton)`
  background-color: ${theme.colors.warning};
  &:hover {
    background-color: ${theme.colors.danger};
  }
`;

export const SelectedTilesComponent: React.FC<SelectedTilesProps> = ({ tiles, onClearSelection }) => {
  return (
    <SelectedTilesContainer>
      <h3>Selected Tiles</h3>
      {tiles.length > 0 ? (
        <>
          <TilesRow>
            {tiles.map((tile, idx) => (
              <Tile key={idx} tile={tile} /> // Pass the entire TileType object
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