import React from 'react';
import { DiceRollResult } from '../types';
import './GameControls.css';

interface GameControlsProps {
  gameId: string;
  currentPlayer?: string;
  canRollDice: boolean;
  diceResult?: DiceRollResult;
  onRollDice: () => void;
  onBuyProperty: () => void;
  onUpgradeProperty: () => void;
  onEndTurn: () => void;
  canBuyProperty: boolean;
  canUpgradeProperty: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({
  currentPlayer,
  canRollDice,
  diceResult,
  onRollDice,
  onBuyProperty,
  onUpgradeProperty,
  onEndTurn,
  canBuyProperty,
  canUpgradeProperty
}) => {
  return (
    <div className="game-controls">
      <h3>遊戲控制</h3>
      
      {currentPlayer && (
        <div className="current-turn">
          當前回合: <strong>{currentPlayer}</strong>
        </div>
      )}

      <div className="dice-section">
        {diceResult && (
          <div className="dice-result">
            <div className="dice-display">
              <div className="dice">{diceResult.dice1}</div>
              <div className="dice">{diceResult.dice2}</div>
            </div>
            <div className="dice-total">總和: {diceResult.total}</div>
          </div>
        )}

        <button 
          className="control-button primary"
          onClick={onRollDice}
          disabled={!canRollDice}
        >
          🎲 擲骰子
        </button>
      </div>

      <div className="action-buttons">
        <button 
          className="control-button"
          onClick={onBuyProperty}
          disabled={!canBuyProperty}
        >
          💰 購買地產
        </button>

        <button 
          className="control-button"
          onClick={onUpgradeProperty}
          disabled={!canUpgradeProperty}
        >
          🏗️ 升級地產
        </button>

        <button 
          className="control-button secondary"
          onClick={onEndTurn}
        >
          ➡️ 結束回合
        </button>
      </div>
    </div>
  );
};

export default GameControls;
