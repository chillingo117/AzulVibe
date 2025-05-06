import React from 'react';
import styled from 'styled-components';

interface TileProps {
  color: string;
  onClick?: () => void; // Optional click handler
  className?: string; // Optional className for additional styling
}

// Styled Component for Tile
const StyledTile = styled.div<{ color: string }>`
  display: inline-block;
  width: 30px;
  height: 30px;
  margin: 2px;
  background-color: ${(props) => props.color || '#ccc'};
  border: 1px solid #000;
  border-radius: 5px;
  cursor: ${(props) => (props.onClick ? 'pointer' : 'default')};
  transition: transform 0.2s;

  &:hover {
    transform: ${(props) => (props.onClick ? 'scale(1.1)' : 'none')};
    border-color: ${(props) => (props.onClick ? '#005b99' : '#000')};
  }
`;

export const Tile: React.FC<TileProps> = ({ color, onClick, className }) => {
  return <StyledTile color={color} onClick={onClick} className={className} />;
};