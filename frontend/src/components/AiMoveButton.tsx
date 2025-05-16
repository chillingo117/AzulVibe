import React, { useState } from 'react';
import { getAiMove } from '../services/aiService';
import { GameManager } from '../game/gameManager';

interface AiMoveButtonProps {
  gameManager: GameManager;
  onMoveExecuted: () => void;
  preMoveHook?: () => void;
}

const AiMoveButton: React.FC<AiMoveButtonProps> = ({ gameManager, onMoveExecuted, preMoveHook }) => {
  const [loading, setLoading] = useState(false);

  const handleAiMove = async () => {
    try {
      preMoveHook?.();
      setLoading(true);
      
      // Get AI move from Lambda function
      const aiMove = await getAiMove(gameManager);
      
      // Execute the move in the game
      const currentPlayerId = gameManager.currentPlayerIndex;
      
      // Get tiles based on factory or center
      gameManager.selectTiles(
        aiMove.color, 
        aiMove.factoryId !== null ? aiMove.factoryId : undefined
      );
      
      // Place tiles according to AI decision. -1 means floor line
      if (gameManager.canPlaceTiles(currentPlayerId, aiMove.patternLine)) {
        gameManager.placeTiles(currentPlayerId, aiMove.patternLine);
      } else {
        console.warn('AI WARN: Cannot place tiles in the selected pattern line. Adding to floor line instead.');
      }
      
      // Notify parent component that move was executed
      onMoveExecuted();
    } catch (error) {
      console.error('Error executing AI move:', error);
      alert('Failed to get AI move. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      className="ai-move-button" 
      onClick={handleAiMove} 
      disabled={loading}
    >
      {loading ? 'Thinking...' : 'Get AI Move'}
    </button>
  );
};

export default AiMoveButton;