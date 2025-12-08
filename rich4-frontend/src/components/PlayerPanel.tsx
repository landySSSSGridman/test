import React from 'react';
import { Player } from '../types';
import './PlayerPanel.css';

interface PlayerPanelProps {
  players: Player[];
  currentPlayerIndex: number;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({ players, currentPlayerIndex }) => {
  return (
    <div className="player-panel">
      <h3>玩家列表</h3>
      {players.map((player, index) => (
        <div 
          key={player.id} 
          className={`player-card ${index === currentPlayerIndex ? 'current-player' : ''} ${player.isBankrupt ? 'bankrupt' : ''}`}
        >
          <div className="player-header">
            <div 
              className="player-avatar" 
              style={{ backgroundColor: player.color }}
            />
            <div className="player-info">
              <div className="player-name">
                {player.name}
                {index === currentPlayerIndex && <span className="current-badge">🎲</span>}
              </div>
              <div className="player-money">${player.money.toLocaleString()}</div>
            </div>
          </div>
          
          {player.isInJail && (
            <div className="jail-status">🔒 監獄中 ({player.turnsInJail}回合)</div>
          )}
          
          {player.ownedProperties.length > 0 && (
            <div className="owned-properties">
              <div className="properties-label">擁有資產：</div>
              <div className="properties-list">
                {player.ownedProperties.map(prop => (
                  <div 
                    key={prop.id} 
                    className="property-chip"
                    style={{ borderColor: prop.color }}
                  >
                    {prop.name}
                    {prop.level > 0 && <span className="prop-level">★{prop.level}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PlayerPanel;
