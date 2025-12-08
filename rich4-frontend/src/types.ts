export interface Player {
  id: string;
  name: string;
  money: number;
  position: number;
  ownedProperties: Property[];
  isBankrupt: boolean;
  color: string;
  turnsInJail: number;
  isInJail: boolean;
  cards: Card[];
}

export interface Property {
  id: number;
  name: string;
  position: number;
  price: number;
  baseRent: number;
  level: number;
  maxLevel: number;
  upgradePrice: number;
  ownerId?: string;
  type: PropertyType;
  color: string;
}

export enum PropertyType {
  Street = 0,
  Station = 1,
  Utility = 2,
  Special = 3
}

export interface Card {
  id: number;
  name: string;
  description: string;
  type: CardType;
  value: number;
}

export enum CardType {
  Chance = 0,
  Destiny = 1,
  GetMoney = 2,
  LoseMoney = 3,
  MoveForward = 4,
  MoveBackward = 5,
  GoToJail = 6,
  GetOutOfJail = 7
}

export interface GameState {
  gameId: string;
  players: Player[];
  properties: Property[];
  currentPlayerIndex: number;
  status: GameStatus;
  chanceCards: Card[];
  destinyCards: Card[];
  createdAt: string;
}

export enum GameStatus {
  Waiting = 0,
  InProgress = 1,
  Finished = 2
}

export interface DiceRollResult {
  dice1: number;
  dice2: number;
  total: number;
}

export interface BoardSpace {
  position: number;
  name: string;
  type: SpaceType;
  property?: Property;
}

export enum SpaceType {
  Start = 0,
  Property = 1,
  Chance = 2,
  Destiny = 3,
  Jail = 4,
  FreeParking = 5,
  GoToJail = 6,
  Tax = 7
}
