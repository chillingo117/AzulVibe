import React, { use, useEffect, useState } from 'react';
import { GameManager } from '../game/gameManager';
import { getAiMove } from '../services/aiService';

interface AiMoveButtonProps {
  gameManager: GameManager;
  onMoveExecuted: () => void;
  preMoveHook?: () => void;
}

const AiMoveButton: React.FC<AiMoveButtonProps> = ({
  gameManager,
  onMoveExecuted,
  preMoveHook,
}) => {
  const [loading, setLoading] = useState(false);
  const [autoAi, setAutoAi] = useState(false);

  // AI service availability state
  const [aiAvailable, setAiAvailable] = useState(false);

  useEffect(() => {
    // Check if AI backend is available
    const checkAiService = async () => {
      try {
        const res = await fetch('http://localhost:3001/heartbeat', { method: 'GET' });
        setAiAvailable(res.ok);
      } catch {
        setAiAvailable(false);
      }
    };
    checkAiService();
  }, []);

  const toggleAiMove = () => {
    setAutoAi((prev) => !prev);
    if (autoAi) {
      handleAiMove();
    }
  }

  const handleAiMove = async () => {
    if(loading) return;
    try {
      preMoveHook?.();
      setLoading(true);
      
      // Get AI move from Lambda function
      const aiMove = await getAiMove(gameManager);
      const currentPlayerId = gameManager.currentPlayerIndex;

      gameManager.selectTiles(
        aiMove.color,
        aiMove.factoryId !== null ? aiMove.factoryId : undefined
      );

      if (gameManager.canPlaceTiles(currentPlayerId, aiMove.patternLine)) {
        gameManager.placeTiles(currentPlayerId, aiMove.patternLine);
      } else {
        console.warn('AI WARN: Cannot place tiles in the selected pattern line. Adding to floor line instead.');
      }

      onMoveExecuted();
    } catch (error) {
      console.error('Error executing AI move:', error);
      alert('Failed to get AI move. Please try again.');
    } finally {
      setLoading(false);
    }

    if (autoAi) {
      handleAiMove();
    }
  };

  if(aiAvailable) {
    return (
      <div>
        <button
          className="ai-move-button"
          onClick={handleAiMove}
          disabled={loading || autoAi}
        >
          {loading ? 'Thinking...' : 'Get AI Move'}
        </button>          
        <button
          style={{ marginLeft: 8 }}
          onClick={() => toggleAiMove()}
        >
          {autoAi ? 'Auto AI: ON' : 'Auto AI: OFF'}
        </button>
      </div>
    );
  } else {
    return <>  </>
  }
};

export default AiMoveButton;