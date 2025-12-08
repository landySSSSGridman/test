namespace Rich4Backend.Models
{
    public class GameState
    {
        public string GameId { get; set; } = Guid.NewGuid().ToString();
        public List<Player> Players { get; set; } = new List<Player>();
        public List<Property> Properties { get; set; } = new List<Property>();
        public int CurrentPlayerIndex { get; set; } = 0;
        public GameStatus Status { get; set; } = GameStatus.Waiting;
        public List<Card> ChanceCards { get; set; } = new List<Card>();
        public List<Card> DestinyCards { get; set; } = new List<Card>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }

    public enum GameStatus
    {
        Waiting,
        InProgress,
        Finished
    }
}
