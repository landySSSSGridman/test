using Rich4Backend.Models;

namespace Rich4Backend.Services
{
    public class GameService
    {
        private readonly Dictionary<string, GameState> _games = new Dictionary<string, GameState>();
        private static readonly Random _random = new Random();

        public GameState CreateGame()
        {
            var game = new GameState();
            InitializeBoard(game);
            InitializeCards(game);
            _games[game.GameId] = game;
            return game;
        }

        public GameState? GetGame(string gameId)
        {
            return _games.TryGetValue(gameId, out var game) ? game : null;
        }

        public Player AddPlayer(string gameId, string playerName, string color)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var player = new Player
            {
                Name = playerName,
                Color = color
            };
            game.Players.Add(player);
            return player;
        }

        public void StartGame(string gameId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");
            if (game.Players.Count < 2) throw new Exception("Need at least 2 players");

            game.Status = GameStatus.InProgress;
        }

        public (int, int) RollDice()
        {
            return (_random.Next(1, 7), _random.Next(1, 7));
        }

        public void MovePlayer(string gameId, string playerId, int steps)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var player = game.Players.FirstOrDefault(p => p.Id == playerId);
            if (player == null) throw new Exception("Player not found");

            var oldPosition = player.Position;
            player.Position = (player.Position + steps) % 40;

            // Pass Start bonus
            if (player.Position < oldPosition)
            {
                player.Money += 2000;
            }
        }

        public void BuyProperty(string gameId, string playerId, int propertyId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var player = game.Players.FirstOrDefault(p => p.Id == playerId);
            if (player == null) throw new Exception("Player not found");

            var property = game.Properties.FirstOrDefault(p => p.Id == propertyId);
            if (property == null) throw new Exception("Property not found");

            if (property.OwnerId != null) throw new Exception("Property already owned");
            if (player.Money < property.Price) throw new Exception("Insufficient funds");

            player.Money -= property.Price;
            property.OwnerId = playerId;
            player.OwnedProperties.Add(property);
        }

        public void UpgradeProperty(string gameId, string playerId, int propertyId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var player = game.Players.FirstOrDefault(p => p.Id == playerId);
            if (player == null) throw new Exception("Player not found");

            var property = game.Properties.FirstOrDefault(p => p.Id == propertyId);
            if (property == null) throw new Exception("Property not found");

            if (property.OwnerId != playerId) throw new Exception("You don't own this property");
            if (property.Level >= property.MaxLevel) throw new Exception("Property at max level");
            if (player.Money < property.UpgradePrice) throw new Exception("Insufficient funds");

            player.Money -= property.UpgradePrice;
            property.Level++;
        }

        public int CalculateRent(Property property)
        {
            return property.BaseRent * (int)Math.Pow(2, property.Level);
        }

        public void PayRent(string gameId, string payerId, string receiverId, int amount)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var payer = game.Players.FirstOrDefault(p => p.Id == payerId);
            var receiver = game.Players.FirstOrDefault(p => p.Id == receiverId);

            if (payer == null || receiver == null) throw new Exception("Player not found");

            if (payer.Money < amount)
            {
                // Bankruptcy
                payer.IsBankrupt = true;
                receiver.Money += payer.Money;
                payer.Money = 0;

                // Transfer properties
                foreach (var prop in payer.OwnedProperties)
                {
                    prop.OwnerId = receiverId;
                    receiver.OwnedProperties.Add(prop);
                }
                payer.OwnedProperties.Clear();
            }
            else
            {
                payer.Money -= amount;
                receiver.Money += amount;
            }
        }

        public void NextTurn(string gameId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            do
            {
                game.CurrentPlayerIndex = (game.CurrentPlayerIndex + 1) % game.Players.Count;
            } while (game.Players[game.CurrentPlayerIndex].IsBankrupt);

            // Check win condition
            var activePlayers = game.Players.Where(p => !p.IsBankrupt).Count();
            if (activePlayers <= 1)
            {
                game.Status = GameStatus.Finished;
            }
        }

        private void InitializeBoard(GameState game)
        {
            var properties = new List<Property>
            {
                // Streets
                new Property { Id = 1, Name = "台北", Position = 1, Price = 600, BaseRent = 50, UpgradePrice = 300, Type = PropertyType.Street, Color = "#8B4513" },
                new Property { Id = 2, Name = "台中", Position = 3, Price = 600, BaseRent = 50, UpgradePrice = 300, Type = PropertyType.Street, Color = "#8B4513" },
                new Property { Id = 3, Name = "高雄", Position = 6, Price = 1000, BaseRent = 90, UpgradePrice = 500, Type = PropertyType.Street, Color = "#87CEEB" },
                new Property { Id = 4, Name = "台南", Position = 8, Price = 1000, BaseRent = 90, UpgradePrice = 500, Type = PropertyType.Street, Color = "#87CEEB" },
                new Property { Id = 5, Name = "新竹", Position = 9, Price = 1200, BaseRent = 100, UpgradePrice = 600, Type = PropertyType.Street, Color = "#87CEEB" },
                new Property { Id = 6, Name = "香港", Position = 11, Price = 1400, BaseRent = 110, UpgradePrice = 700, Type = PropertyType.Street, Color = "#FF1493" },
                new Property { Id = 7, Name = "北京", Position = 13, Price = 1400, BaseRent = 110, UpgradePrice = 700, Type = PropertyType.Street, Color = "#FF1493" },
                new Property { Id = 8, Name = "上海", Position = 14, Price = 1600, BaseRent = 120, UpgradePrice = 800, Type = PropertyType.Street, Color = "#FF1493" },
                new Property { Id = 9, Name = "東京", Position = 16, Price = 1800, BaseRent = 140, UpgradePrice = 900, Type = PropertyType.Street, Color = "#FFA500" },
                new Property { Id = 10, Name = "首爾", Position = 18, Price = 1800, BaseRent = 140, UpgradePrice = 900, Type = PropertyType.Street, Color = "#FFA500" },
                new Property { Id = 11, Name = "曼谷", Position = 19, Price = 2000, BaseRent = 150, UpgradePrice = 1000, Type = PropertyType.Street, Color = "#FFA500" },
                new Property { Id = 12, Name = "巴黎", Position = 21, Price = 2200, BaseRent = 180, UpgradePrice = 1100, Type = PropertyType.Street, Color = "#FF0000" },
                new Property { Id = 13, Name = "倫敦", Position = 23, Price = 2200, BaseRent = 180, UpgradePrice = 1100, Type = PropertyType.Street, Color = "#FF0000" },
                new Property { Id = 14, Name = "羅馬", Position = 24, Price = 2400, BaseRent = 200, UpgradePrice = 1200, Type = PropertyType.Street, Color = "#FF0000" },
                new Property { Id = 15, Name = "紐約", Position = 26, Price = 2600, BaseRent = 220, UpgradePrice = 1300, Type = PropertyType.Street, Color = "#FFFF00" },
                new Property { Id = 16, Name = "洛杉磯", Position = 27, Price = 2600, BaseRent = 220, UpgradePrice = 1300, Type = PropertyType.Street, Color = "#FFFF00" },
                new Property { Id = 17, Name = "夏威夷", Position = 29, Price = 2800, BaseRent = 240, UpgradePrice = 1400, Type = PropertyType.Street, Color = "#FFFF00" },
                new Property { Id = 18, Name = "雪梨", Position = 31, Price = 3000, BaseRent = 260, UpgradePrice = 1500, Type = PropertyType.Street, Color = "#00FF00" },
                new Property { Id = 19, Name = "墨爾本", Position = 32, Price = 3000, BaseRent = 260, UpgradePrice = 1500, Type = PropertyType.Street, Color = "#00FF00" },
                new Property { Id = 20, Name = "杜拜", Position = 34, Price = 3200, BaseRent = 280, UpgradePrice = 1600, Type = PropertyType.Street, Color = "#00FF00" },
                new Property { Id = 21, Name = "莫斯科", Position = 37, Price = 3500, BaseRent = 350, UpgradePrice = 1750, Type = PropertyType.Street, Color = "#0000FF" },
                new Property { Id = 22, Name = "開羅", Position = 39, Price = 4000, BaseRent = 500, UpgradePrice = 2000, Type = PropertyType.Street, Color = "#0000FF" },
            };

            game.Properties = properties;
        }

        private void InitializeCards(GameState game)
        {
            game.ChanceCards = new List<Card>
            {
                new Card { Id = 1, Name = "機會卡", Description = "獲得1000元", Type = CardType.GetMoney, Value = 1000 },
                new Card { Id = 2, Name = "機會卡", Description = "損失500元", Type = CardType.LoseMoney, Value = 500 },
                new Card { Id = 3, Name = "機會卡", Description = "前進3步", Type = CardType.MoveForward, Value = 3 },
                new Card { Id = 4, Name = "機會卡", Description = "後退2步", Type = CardType.MoveBackward, Value = 2 },
                new Card { Id = 5, Name = "機會卡", Description = "進監獄", Type = CardType.GoToJail, Value = 0 },
            };

            game.DestinyCards = new List<Card>
            {
                new Card { Id = 6, Name = "命運卡", Description = "獲得2000元", Type = CardType.GetMoney, Value = 2000 },
                new Card { Id = 7, Name = "命運卡", Description = "損失1000元", Type = CardType.LoseMoney, Value = 1000 },
                new Card { Id = 8, Name = "命運卡", Description = "前進5步", Type = CardType.MoveForward, Value = 5 },
                new Card { Id = 9, Name = "命運卡", Description = "出獄卡", Type = CardType.GetOutOfJail, Value = 0 },
            };
        }

        public Card DrawChanceCard(string gameId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var index = _random.Next(game.ChanceCards.Count);
            return game.ChanceCards[index];
        }

        public Card DrawDestinyCard(string gameId)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var index = _random.Next(game.DestinyCards.Count);
            return game.DestinyCards[index];
        }

        public void ApplyCard(string gameId, string playerId, Card card)
        {
            var game = GetGame(gameId);
            if (game == null) throw new Exception("Game not found");

            var player = game.Players.FirstOrDefault(p => p.Id == playerId);
            if (player == null) throw new Exception("Player not found");

            switch (card.Type)
            {
                case CardType.GetMoney:
                    player.Money += card.Value;
                    break;
                case CardType.LoseMoney:
                    player.Money -= card.Value;
                    if (player.Money < 0) player.Money = 0;
                    break;
                case CardType.MoveForward:
                    MovePlayer(gameId, playerId, card.Value);
                    break;
                case CardType.MoveBackward:
                    MovePlayer(gameId, playerId, -card.Value);
                    break;
                case CardType.GoToJail:
                    player.Position = 10; // Jail position
                    player.IsInJail = true;
                    player.TurnsInJail = 0;
                    break;
                case CardType.GetOutOfJail:
                    player.Cards.Add(card);
                    break;
            }
        }
    }
}
