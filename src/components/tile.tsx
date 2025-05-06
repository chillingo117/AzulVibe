import React from 'react';
import styled from 'styled-components';

interface TileProps {
  color: string | null;
  onClick?: () => void; // Optional click handler
  className?: string; // Optional className for additional styling
}

// Styled Component for Tile
const StyledTile = styled.div<{ color: string | null }>`
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
  transition: transform 0.2s;

  &:hover {
    transform: ${(props) => (props.onClick ? 'scale(1.1)' : 'none')};
    border-color: ${(props) => (props.onClick && props.color ? '#005b99' : '#ccc')};
  }
`;

export const Tile: React.FC<TileProps> = ({ color, onClick, className }) => {
  return <StyledTile color={color} onClick={onClick} className={className} />;
};