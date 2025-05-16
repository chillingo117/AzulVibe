import { GameManager } from '../game/gameManager';

interface AiMove {
  factoryId: number | null;
  color: string;
  patternLine: number;
}

export const getAiMove = async (gameState: GameManager): Promise<AiMove> => {
  try {
    // Convert gameState to the format expected by Lambda
    const gameStateForLambda = {
      players: gameState.players,
      factories: gameState.factories,
      center: gameState.center,
      currentPlayerIndex: gameState.currentPlayerIndex,
      round: gameState.round
    };

    // Make API call to Lambda
    const response = await fetch('http://localhost:3001/lambda/mcts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameStateForLambda),
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    const move = await response.json();
    return move as AiMove;
  } catch (error) {
    console.error('Error getting AI move:', error);
    throw error;
  }
};