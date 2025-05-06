import React from 'react';
import { Factory } from '../game/types';

interface Props {
  factory: Factory;
  onSelectTile: (color: string, factoryId: number) => void;
}

export const FactoryComponent: React.FC<Props> = ({ factory, onSelectTile }) => {
  const handleClick = (tile: string) => {
    onSelectTile(tile, factory.id);
  };

  return (
    <div className="factory">
      {factory.tiles.map((tile, idx) => (
        <button key={idx} onClick={() => handleClick(tile)}>{tile}</button>
      ))}
    </div>
  );
};
