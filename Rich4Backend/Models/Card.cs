namespace Rich4Backend.Models
{
    public class Card
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public CardType Type { get; set; }
        public int Value { get; set; }
    }

    public enum CardType
    {
        Chance,
        Destiny,
        GetMoney,
        LoseMoney,
        MoveForward,
        MoveBackward,
        GoToJail,
        GetOutOfJail
    }
}
