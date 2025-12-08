using Microsoft.AspNetCore.SignalR;

namespace Rich4Backend.Hubs
{
    public class GameHub : Hub
    {
        public async Task JoinGame(string gameId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Clients.Group(gameId).SendAsync("PlayerJoined", Context.ConnectionId);
        }

        public async Task LeaveGame(string gameId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, gameId);
            await Clients.Group(gameId).SendAsync("PlayerLeft", Context.ConnectionId);
        }

        public async Task SendGameUpdate(string gameId, object gameState)
        {
            await Clients.Group(gameId).SendAsync("GameUpdated", gameState);
        }

        public async Task SendPlayerAction(string gameId, string action, object data)
        {
            await Clients.Group(gameId).SendAsync("PlayerAction", action, data);
        }
    }
}
