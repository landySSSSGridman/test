# Rich 4 (大富翁4) - Web Edition

A web-based implementation of the classic Chinese board game Rich 4 (Monopoly-style game) using C# ASP.NET Core backend and React TypeScript frontend.

## 🎮 Features

- **Multiplayer Support**: Play with 2-4 players
- **Real-time Updates**: SignalR integration for live game state synchronization
- **Property Management**: Buy, upgrade, and manage properties
- **Card System**: Chance and Destiny cards with various effects
- **Responsive Design**: Beautiful, mobile-friendly interface
- **Complete Game Logic**: Dice rolling, player movement, rent collection, and bankruptcy system

## 🏗️ Architecture

### Backend (C# ASP.NET Core)
- RESTful API for game operations
- SignalR hub for real-time multiplayer
- In-memory game state management
- Comprehensive game logic service

### Frontend (React + TypeScript)
- Modern React hooks-based architecture
- TypeScript for type safety
- Responsive game board with visual feedback
- Real-time player panels and controls

## 📦 Project Structure

```
test/
├── Rich4Backend/          # C# ASP.NET Core Backend
│   ├── Models/           # Game data models
│   ├── Services/         # Game logic services
│   ├── Controllers/      # API controllers
│   ├── Hubs/            # SignalR hubs
│   └── Program.cs       # Application entry point
├── rich4-frontend/       # React Frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── types.ts     # TypeScript type definitions
│   │   ├── api.ts       # API client
│   │   └── App.tsx      # Main application
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- .NET 8.0 SDK or later
- Node.js 18+ and npm
- Modern web browser

### Backend Setup

1. Navigate to the backend directory:
```bash
cd Rich4Backend
```

2. Restore dependencies:
```bash
dotnet restore
```

3. Run the backend server:
```bash
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd rich4-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 🎯 How to Play

1. **Create a Game**: Click "創建新遊戲" (Create New Game) to start
2. **Join Game**: Share the Game ID with other players to join
3. **Add Players**: Each player enters their name and chooses a color
4. **Start Game**: When 2+ players have joined, click "開始遊戲" (Start Game)
5. **Play**: 
   - Roll dice to move around the board
   - Buy properties you land on
   - Upgrade properties to increase rent
   - Collect rent from other players
   - Draw Chance/Destiny cards on special spaces
6. **Win**: Be the last player remaining with money!

## 🎲 Game Rules

### Board Spaces
- **起點 (Start)**: Pass to collect $2000
- **Properties**: Can be purchased and upgraded (5 levels max)
- **機會 (Chance)**: Draw a Chance card
- **命運 (Destiny)**: Draw a Destiny card
- **監獄 (Jail)**: Visit or get stuck here
- **免費停車 (Free Parking)**: Safe space, no effect
- **進監獄 (Go to Jail)**: Sends player to jail
- **稅金 (Tax)**: Pay taxes to the bank

### Starting Conditions
- Each player starts with $10,000
- Players start at position 0 (起點)

### Property System
- Properties have 5 upgrade levels (★)
- Rent doubles with each level
- Properties are grouped by color

### Cards
- **Chance Cards**: Random events affecting money or position
- **Destiny Cards**: Major events with significant impact

## 🛠️ API Endpoints

### Game Management
- `POST /api/game/create` - Create new game
- `GET /api/game/{gameId}` - Get game state
- `POST /api/game/{gameId}/players` - Add player
- `POST /api/game/{gameId}/start` - Start game

### Game Actions
- `POST /api/game/{gameId}/roll-dice` - Roll dice
- `POST /api/game/{gameId}/move` - Move player
- `POST /api/game/{gameId}/buy-property` - Buy property
- `POST /api/game/{gameId}/upgrade-property` - Upgrade property
- `POST /api/game/{gameId}/pay-rent` - Pay rent
- `POST /api/game/{gameId}/next-turn` - End turn
- `POST /api/game/{gameId}/draw-chance` - Draw Chance card
- `POST /api/game/{gameId}/draw-destiny` - Draw Destiny card

## 🎨 Technologies Used

### Backend
- ASP.NET Core 8.0
- SignalR (real-time communication)
- C# 12

### Frontend
- React 18
- TypeScript 4.9+
- Axios (HTTP client)
- SignalR Client
- CSS3 (custom styling)

## 🔧 Development

### Running Tests
```bash
# Backend tests
cd Rich4Backend
dotnet test

# Frontend tests
cd rich4-frontend
npm test
```

### Building for Production

Backend:
```bash
cd Rich4Backend
dotnet publish -c Release
```

Frontend:
```bash
cd rich4-frontend
npm run build
```

## 📝 Game Mechanics

### Rent Calculation
```
Rent = BaseRent × 2^Level
```

### Bankruptcy
When a player cannot pay rent:
- Player is marked as bankrupt
- All properties transfer to the creditor
- Remaining money is paid
- Game continues with remaining players

### Win Condition
Last player standing (all others bankrupt) wins the game.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

This project is for educational purposes.

## 🎮 Screenshots

(Screenshots would be added here after running the application)

---

Made with ❤️ using C# and React