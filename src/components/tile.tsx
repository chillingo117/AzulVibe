import React from 'react';
import styled from 'styled-components';
import { Tile as TileType } from '../game/types';

interface TileProps {
  tile: TileType | null; // Accept a TileType object
  onClick?: () => void; // Optional click handler
  className?: string; // Optional className for additional styling
}

// Styled Component for Tile
const StyledTile = styled.div<{ color?: string; selected?: boolean }>`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 2px;
  background-color: ${(props) => (props.color ? props.color : 'transparent')};
  background-image: ${(props) =>
    props.color
      ? `linear-gradient(
          45deg,
          rgba(200, 200, 200, 0.3) 25%,
          transparent 25%,
          transparent 50%,
          rgba(200, 200, 200, 0.3) 50%,
          rgba(200, 200, 200, 0.3) 75%,
          transparent 75%,
          transparent
        )`
      : 'none'};
  background-size: 10px 10px;
  border: ${(props) => (props.color ? '1px solid #000' : '1px dashed #ccc')};
  border-radius: 5px;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  transition: transform 0.2s, box-shadow 0.2s;

  ${(props) =>
    props.selected &&
    `
    box-shadow: 0 0 10px 2px rgba(255, 215, 0, 0.8); /* Highlight with a glow effect */
    transform: scale(1.1); /* Slightly enlarge the tile */
    border-color: gold; /* Change border color */
  `}

  &:hover {
    transform: ${(props) => (props.onClick ? 'scale(1.1)' : 'none')};
    border-color: ${(props) => (props.onClick ? '#005b99' : '#000')};
  }
`;

export const Tile: React.FC<TileProps> = ({ tile, onClick, className }) => {
  return (
    <StyledTile
      color={tile?.color}
      selected={tile?.selected}
      onClick={onClick}
      className={className}
    />
  );
};