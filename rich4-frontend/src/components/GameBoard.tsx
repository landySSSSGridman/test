import React from 'react';
import { Property, Player } from '../types';
import './GameBoard.css';

interface GameBoardProps {
  properties: Property[];
  players: Player[];
  currentPlayerId?: string;
  onSpaceClick?: (position: number) => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ properties, players, currentPlayerId, onSpaceClick }) => {
  const boardSpaces = createBoardSpaces(properties);

  return (
    <div className="game-board">
      <div className="board-container">
        {/* Top row */}
        <div className="board-row top">
          {boardSpaces.slice(0, 11).map((space, index) => (
            <BoardSpace 
              key={index} 
              space={space} 
              players={players.filter(p => p.position === space.position)}
              onClick={() => onSpaceClick?.(space.position)}
            />
          ))}
        </div>

        {/* Middle rows */}
        <div className="board-middle">
          <div className="board-column left">
            {boardSpaces.slice(11, 20).map((space, index) => (
              <BoardSpace 
                key={index} 
                space={space} 
                players={players.filter(p => p.position === space.position)}
                onClick={() => onSpaceClick?.(space.position)}
              />
            ))}
          </div>

          <div className="board-center">
            <div className="game-info">
              <h2>大富翁4</h2>
              <div className="game-logo">🎲</div>
            </div>
          </div>

          <div className="board-column right">
            {boardSpaces.slice(30, 39).reverse().map((space, index) => (
              <BoardSpace 
                key={index} 
                space={space} 
                players={players.filter(p => p.position === space.position)}
                onClick={() => onSpaceClick?.(space.position)}
              />
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="board-row bottom">
          {boardSpaces.slice(20, 31).reverse().map((space, index) => (
            <BoardSpace 
              key={index} 
              space={space} 
              players={players.filter(p => p.position === space.position)}
              onClick={() => onSpaceClick?.(space.position)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface BoardSpaceProps {
  space: { position: number; name: string; property?: Property };
  players: Player[];
  onClick?: () => void;
}

const BoardSpace: React.FC<BoardSpaceProps> = ({ space, players, onClick }) => {
  const property = space.property;

  return (
    <div 
      className={`board-space ${property ? 'property-space' : 'special-space'}`}
      onClick={onClick}
      style={property ? { borderTopColor: property.color } : {}}
    >
      <div className="space-header" style={property ? { backgroundColor: property.color } : {}}>
        {property && (
          <div className="property-level">
            {Array(property.level).fill('⭐').join('')}
          </div>
        )}
      </div>
      <div className="space-name">{space.name}</div>
      {property && (
        <div className="space-price">${property.price}</div>
      )}
      <div className="space-players">
        {players.map(player => (
          <div 
            key={player.id} 
            className="player-token" 
            style={{ backgroundColor: player.color }}
            title={player.name}
          />
        ))}
      </div>
    </div>
  );
};

function createBoardSpaces(properties: Property[]) {
  const spaces = [];
  
  // Create 40 spaces
  for (let i = 0; i < 40; i++) {
    const property = properties.find(p => p.position === i);
    
    let name = '';
    if (i === 0) name = '起點';
    else if (i === 10) name = '監獄';
    else if (i === 20) name = '免費停車';
    else if (i === 30) name = '進監獄';
    else if (i === 5) name = '機會';
    else if (i === 15) name = '機會';
    else if (i === 25) name = '機會';
    else if (i === 35) name = '機會';
    else if (i === 2) name = '命運';
    else if (i === 7) name = '命運';
    else if (i === 17) name = '命運';
    else if (i === 22) name = '命運';
    else if (i === 33) name = '命運';
    else if (i === 4) name = '稅金';
    else if (i === 38) name = '奢侈稅';
    else if (property) name = property.name;
    else name = `格子${i}`;
    
    spaces.push({
      position: i,
      name,
      property
    });
  }
  
  return spaces;
}

export default GameBoard;
