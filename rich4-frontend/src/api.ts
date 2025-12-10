import axios from 'axios';
import { GameState, Player, Card, DiceRollResult } from './types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5285/api';

export const gameApi = {
  createGame: async (): Promise<GameState> => {
    const response = await axios.post(`${API_BASE_URL}/game/create`);
    return response.data;
  },

  getGame: async (gameId: string): Promise<GameState> => {
    const response = await axios.get(`${API_BASE_URL}/game/${gameId}`);
    return response.data;
  },

  addPlayer: async (gameId: string, name: string, color: string): Promise<Player> => {
    const response = await axios.post(`${API_BASE_URL}/game/${gameId}/players`, {
      name,
      color
    });
    return response.data;
  },

  startGame: async (gameId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/start`);
  },

  rollDice: async (gameId: string): Promise<DiceRollResult> => {
    const response = await axios.post(`${API_BASE_URL}/game/${gameId}/roll-dice`);
    return response.data;
  },

  movePlayer: async (gameId: string, playerId: string, steps: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/move`, {
      playerId,
      steps
    });
  },

  buyProperty: async (gameId: string, playerId: string, propertyId: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/buy-property`, {
      playerId,
      propertyId
    });
  },

  upgradeProperty: async (gameId: string, playerId: string, propertyId: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/upgrade-property`, {
      playerId,
      propertyId
    });
  },

  payRent: async (gameId: string, payerId: string, receiverId: string, amount: number): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/pay-rent`, {
      payerId,
      receiverId,
      amount
    });
  },

  nextTurn: async (gameId: string): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/next-turn`);
  },

  drawChanceCard: async (gameId: string): Promise<Card> => {
    const response = await axios.post(`${API_BASE_URL}/game/${gameId}/draw-chance`);
    return response.data;
  },

  drawDestinyCard: async (gameId: string): Promise<Card> => {
    const response = await axios.post(`${API_BASE_URL}/game/${gameId}/draw-destiny`);
    return response.data;
  },

  applyCard: async (gameId: string, playerId: string, card: Card): Promise<void> => {
    await axios.post(`${API_BASE_URL}/game/${gameId}/apply-card`, {
      playerId,
      card
    });
  }
};
