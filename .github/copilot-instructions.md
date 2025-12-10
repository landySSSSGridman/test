# Rich 4 (大富翁4) - AI Agent Instructions

## Project Overview
A full-stack multiplayer board game (Chinese Monopoly clone) with C# ASP.NET Core backend and React TypeScript frontend. The game uses in-memory state management with SignalR for real-time multiplayer synchronization.

## Architecture

### Backend (Rich4Backend/)
- **Framework**: ASP.NET Core 8.0 with Swagger, SignalR enabled
- **State Management**: Singleton `GameService` stores all game states in-memory (`Dictionary<string, GameState>`)
- **API Pattern**: RESTful endpoints in `GameController.cs` delegate to `GameService` business logic
- **Models**: `GameState` contains players list, properties, cards, and turn tracking (`CurrentPlayerIndex`)
- **Real-time**: `GameHub.cs` provides SignalR hub at `/gamehub` for group-based game updates

### Frontend (rich4-frontend/)
- **Framework**: React 19 with TypeScript, using hooks exclusively
- **API Client**: `api.ts` exports `gameApi` object with axios-based methods (base URL: `http://localhost:5285/api`)
- **State Management**: Local React state in `App.tsx` - no Redux/context providers
- **Components**: `GameBoard`, `PlayerPanel`, `GameControls` - each with paired CSS file

## Critical Developer Workflows

### Running the Application
```powershell
# Backend (from Rich4Backend/)
dotnet run  # Starts on http://localhost:5285, Swagger at /swagger

# Frontend (from rich4-frontend/)
npm install  # First time only
npm start    # Starts on http://localhost:3000
```

### Game Flow
1. Create game → `POST /api/game/create` returns `GameState` with unique `gameId`
2. Players join → `POST /api/game/{gameId}/players` adds to `GameState.Players` list
3. Start game → `POST /api/game/{gameId}/start` changes status to `InProgress`
4. Turn sequence: Roll dice → Move player → Handle space action → End turn (manual in current impl)

### Key URLs and Ports
- Backend API: `http://localhost:5285/api`
- Frontend dev server: `http://localhost:3000`
- SignalR hub: `http://localhost:5285/gamehub`
- Swagger UI: `http://localhost:5285/swagger`

## Project-Specific Conventions

### Backend Patterns
- **Service Layer**: All game logic lives in `GameService.cs` - controllers are thin wrappers
- **Error Handling**: Services throw exceptions with message strings; controllers catch and return `BadRequest(ex.Message)`
- **ID Generation**: `GameState.GameId` uses `Guid.NewGuid().ToString()`, `Player.Id` uses same pattern
- **CORS**: Configured in `Program.cs` with policy "AllowReactApp" for `http://localhost:3000` with credentials
- **HTTPS**: Disabled in development (`if (!app.Environment.IsDevelopment())` check in `Program.cs`)

### Frontend Patterns
- **API Calls**: Always use `gameApi.*` methods from `api.ts` - never direct axios calls in components
- **Message Display**: `showMessage()` in `App.tsx` sets state with 3-second auto-clear timeout
- **Turn Tracking**: `hasRolled` state prevents multiple dice rolls per turn; reset on "End Turn" button
- **Property Actions**: Check `selectedPosition` state to determine which board space is active
- **Type Safety**: All backend models duplicated in `types.ts` - keep synchronized manually

### Game Logic Specifics
- **Board**: 40 spaces (indexed 0-39), circular movement using modulo arithmetic
- **Pass Start Bonus**: Triggered when `newPosition < oldPosition` (in `GameService.MovePlayer`)
- **Rent Calculation**: `baseRent * Math.Pow(2, level)` - exponential growth with property upgrades
- **Property Upgrades**: 5 levels (0-4), cost doubles each level from base price
- **Bankruptcy**: Player with `Money < 0` gets `Status = PlayerStatus.Bankrupt`, excluded from turn rotation

## Integration Points

### SignalR Setup (Currently Partial)
- Hub registered at `/gamehub` in backend `Program.cs`
- Frontend has `@microsoft/signalr` dependency but SignalR client not yet integrated in components
- **Pattern to implement**: Connect on game join, listen for "GameUpdated" events, update local state

### State Synchronization
- Frontend polls backend via `gameApi.getGame(gameId)` after each action
- No automatic updates - manual refresh needed if other players act
- **Known limitation**: Multi-player games require SignalR implementation for real-time sync

## Testing and Debugging

### Manual Testing Flow
1. Open two browser windows at `http://localhost:3000`
2. Window 1: Create game, copy game ID
3. Window 2: Paste game ID, join as second player
4. Window 1: Start game when 2+ players joined
5. Test turn mechanics: roll dice, buy properties, end turn

### Debugging Tips
- Check Swagger UI for API endpoint testing: `http://localhost:5285/swagger`
- Backend logs to console - look for exception messages in dotnet terminal
- Frontend dev tools: React DevTools for component state, Network tab for API failures
- Game state inspection: `console.log(gameState)` in `App.tsx` after state updates

## Common Modifications

### Adding New Board Space Types
1. Add enum value to `BoardSpace.SpaceType` (Models/BoardSpace.cs)
2. Update `InitializeBoard()` in GameService.cs
3. Add handling in `components/GameBoard.tsx` rendering logic
4. Update `types.ts` to match backend enum

### Adding New API Endpoints
1. Add method to `GameService.cs` with business logic
2. Create controller action in `GameController.cs` calling service
3. Add corresponding method to `gameApi` object in `api.ts`
4. Update component to call new API method

### Modifying Game Rules
- **Property prices/rent**: Edit `InitializeBoard()` method in GameService.cs
- **Starting money**: Change `Money = 10000` in `Player` model constructor
- **Pass Start bonus**: Modify the `2000` constant in `GameService.MovePlayer()`
- **Dice rolls**: Change `_random.Next(1, 7)` in `GameService.RollDice()` for different dice ranges

## File Reference Quick Guide
- Game state model: `Rich4Backend/Models/GameState.cs`
- All game rules: `Rich4Backend/Services/GameService.cs`
- API endpoints: `Rich4Backend/Controllers/GameController.cs`
- Frontend API client: `rich4-frontend/src/api.ts`
- Main app logic: `rich4-frontend/src/App.tsx`
- Board rendering: `rich4-frontend/src/components/GameBoard.tsx`
