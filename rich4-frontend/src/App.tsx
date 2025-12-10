import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import PlayerPanel from './components/PlayerPanel';
import GameControls from './components/GameControls';
import { GameState, GameStatus, DiceRollResult } from './types';
import { gameApi } from './api';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameId, setGameId] = useState<string>('');
  const [playerName, setPlayerName] = useState<string>('');
  const [playerColor, setPlayerColor] = useState<string>('#FF0000');
  const [diceResult, setDiceResult] = useState<DiceRollResult | undefined>();
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null);
  const [message, setMessage] = useState<string>('');
  const [hasRolled, setHasRolled] = useState<boolean>(false);

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleCreateGame = async () => {
    try {
      const game = await gameApi.createGame();
      setGameState(game);
      setGameId(game.gameId);
      showMessage('遊戲已創建！');
    } catch (error) {
      showMessage('創建遊戲失敗');
    }
  };

  const handleJoinGame = async () => {
    if (!gameId || !playerName) {
      showMessage('請輸入遊戲ID和玩家名稱');
      return;
    }
    try {
      await gameApi.addPlayer(gameId, playerName, playerColor);
      const game = await gameApi.getGame(gameId);
      setGameState(game);
      showMessage(`${playerName} 已加入遊戲！`);
    } catch (error) {
      showMessage('加入遊戲失敗');
    }
  };

  const handleStartGame = async () => {
    if (!gameId) return;
    try {
      await gameApi.startGame(gameId);
      const game = await gameApi.getGame(gameId);
      setGameState(game);
      showMessage('遊戲開始！');
    } catch (error: any) {
      showMessage(error.response?.data || '開始遊戲失敗');
    }
  };

  const handleRollDice = async () => {
    if (!gameId || !gameState) return;
    try {
      const result = await gameApi.rollDice(gameId);
      setDiceResult(result);
      
      const currentPlayer = gameState.players[gameState.currentPlayerIndex];
      const currentPlayerId = currentPlayer.id;
      await gameApi.movePlayer(gameId, currentPlayerId, result.total);
      
      const updatedGame = await gameApi.getGame(gameId);
      setGameState(updatedGame);
      setHasRolled(true);
      
      // Find the position of the player who just moved
      const movedPlayer = updatedGame.players.find(p => p.id === currentPlayerId);
      const newPosition = movedPlayer?.position || 0;
      setSelectedPosition(newPosition);
      showMessage(`擲出 ${result.total}！移動到格子 ${newPosition}`);
    } catch (error) {
      showMessage('擲骰子失敗');
    }
  };

  const handleBuyProperty = async () => {
    if (!gameId || !gameState || selectedPosition === null) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const property = gameState.properties.find(p => p.position === selectedPosition);
    
    if (!property) {
      showMessage('此位置沒有地產');
      return;
    }

    try {
      await gameApi.buyProperty(gameId, currentPlayer.id, property.id);
      const updatedGame = await gameApi.getGame(gameId);
      setGameState(updatedGame);
      showMessage(`成功購買 ${property.name}！`);
    } catch (error: any) {
      showMessage(error.response?.data || '購買失敗');
    }
  };

  const handleUpgradeProperty = async () => {
    if (!gameId || !gameState || selectedPosition === null) return;
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const property = currentPlayer.ownedProperties.find(p => p.position === selectedPosition);
    
    if (!property) {
      showMessage('你不擁有此地產');
      return;
    }

    try {
      await gameApi.upgradeProperty(gameId, currentPlayer.id, property.id);
      const updatedGame = await gameApi.getGame(gameId);
      setGameState(updatedGame);
      showMessage(`成功升級 ${property.name}！`);
    } catch (error: any) {
      showMessage(error.response?.data || '升級失敗');
    }
  };

  const handleEndTurn = async () => {
    if (!gameId) return;
    try {
      await gameApi.nextTurn(gameId);
      const updatedGame = await gameApi.getGame(gameId);
      setGameState(updatedGame);
      setHasRolled(false);
      setDiceResult(undefined);
      setSelectedPosition(null);
      showMessage('回合結束');
    } catch (error) {
      showMessage('結束回合失敗');
    }
  };

  const handleSpaceClick = (position: number) => {
    setSelectedPosition(position);
    const property = gameState?.properties.find(p => p.position === position);
    if (property) {
      showMessage(`選擇: ${property.name}`);
    }
  };

  const canBuyProperty = () => {
    if (!gameState || selectedPosition === null || !hasRolled) return false;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const property = gameState.properties.find(p => p.position === selectedPosition);
    return property !== undefined && 
           property.ownerId === undefined && 
           currentPlayer.money >= property.price &&
           currentPlayer.position === selectedPosition;
  };

  const canUpgradeProperty = () => {
    if (!gameState || selectedPosition === null) return false;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const property = currentPlayer.ownedProperties.find(p => p.position === selectedPosition);
    return property !== undefined && 
           property.level < property.maxLevel &&
           currentPlayer.money >= property.upgradePrice;
  };

  if (!gameState || gameState.status === GameStatus.Waiting) {
    return (
      <div className="App">
        <div className="lobby">
          <h1>🎲 大富翁4 - 網頁版</h1>
          
          {!gameState ? (
            <div className="lobby-section">
              <button className="lobby-button" onClick={handleCreateGame}>
                創建新遊戲
              </button>
            </div>
          ) : (
            <div className="lobby-section">
              <div className="game-id-display">
                <h3>遊戲ID</h3>
                <div className="game-id-code">{gameState.gameId}</div>
              </div>
              
              <div className="current-players">
                <h3>當前玩家 ({gameState.players.length})</h3>
                {gameState.players.map(player => (
                  <div key={player.id} className="lobby-player">
                    <div 
                      className="lobby-player-color" 
                      style={{ backgroundColor: player.color }}
                    />
                    {player.name}
                  </div>
                ))}
              </div>

              <div className="join-form">
                <input
                  type="text"
                  placeholder="玩家名稱"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="lobby-input"
                />
                <input
                  type="color"
                  value={playerColor}
                  onChange={(e) => setPlayerColor(e.target.value)}
                  className="lobby-color-input"
                />
                <button className="lobby-button" onClick={handleJoinGame}>
                  加入遊戲
                </button>
              </div>

              {gameState.players.length >= 2 && (
                <button className="lobby-button primary" onClick={handleStartGame}>
                  開始遊戲
                </button>
              )}
            </div>
          )}

          {!gameState && (
            <div className="lobby-section">
              <h3>或加入現有遊戲</h3>
              <input
                type="text"
                placeholder="輸入遊戲ID"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="lobby-input"
              />
              <input
                type="text"
                placeholder="玩家名稱"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="lobby-input"
              />
              <input
                type="color"
                value={playerColor}
                onChange={(e) => setPlayerColor(e.target.value)}
                className="lobby-color-input"
              />
              <button className="lobby-button" onClick={handleJoinGame}>
                加入遊戲
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="game-container">
        <div className="game-header">
          <h1>🎲 大富翁4</h1>
          {message && <div className="message-banner">{message}</div>}
        </div>

        <div className="game-layout">
          <div className="game-main">
            <GameBoard
              properties={gameState.properties}
              players={gameState.players}
              currentPlayerId={gameState.players[gameState.currentPlayerIndex]?.id}
              onSpaceClick={handleSpaceClick}
            />
          </div>

          <div className="game-sidebar">
            <PlayerPanel
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
            />

            <GameControls
              gameId={gameId}
              currentPlayer={gameState.players[gameState.currentPlayerIndex]?.name}
              canRollDice={!hasRolled}
              diceResult={diceResult}
              onRollDice={handleRollDice}
              onBuyProperty={handleBuyProperty}
              onUpgradeProperty={handleUpgradeProperty}
              onEndTurn={handleEndTurn}
              canBuyProperty={canBuyProperty()}
              canUpgradeProperty={canUpgradeProperty()}
            />
          </div>
        </div>

        {gameState.status === GameStatus.Finished && (
          <div className="game-over">
            <h2>遊戲結束！</h2>
            <p>
              獲勝者: {gameState.players.find(p => !p.isBankrupt)?.name || '無'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
