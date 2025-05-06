import React from 'react';
import { Player } from '../game/types';

interface Props {
  player: Player;
  isCurrent: boolean;
  onPlaceTiles: (row: number) => void;
}

export const PlayerBoardComponent: React.FC<Props> = ({ player, isCurrent, onPlaceTiles }) => {
  return (
    <div className={`player-board ${isCurrent ? 'current-player' : ''}`}>
      <h2>{player.name} (Score: {player.score})</h2>

      <div className="pattern-lines">
        {player.board.patternLines.map((line, row) => (
          <div key={row} className="pattern-line">
            <span>Row {row + 1}: </span>
            {line.map((tile, col) => (
              <span key={col} className={`tile ${tile ?? 'empty'}`}>{tile ?? '-'}</span>
            ))}
            {isCurrent && (
                <button onClick={() => onPlaceTiles(row)}>
                    Place Here
                </button>
            )}
          </div>
        ))}
      </div>

      <div className="floor-line">
        <strong>Floor:</strong> {player.board.floorLine.join(', ') || '—'}
      </div>
    </div>
  );
};
