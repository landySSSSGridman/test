namespace Rich4Backend.Models
{
    public class Player
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = string.Empty;
        public int Money { get; set; } = 10000;
        public int Position { get; set; } = 0;
        public List<Property> OwnedProperties { get; set; } = new List<Property>();
        public bool IsBankrupt { get; set; } = false;
        public string Color { get; set; } = "#FF0000";
        public int TurnsInJail { get; set; } = 0;
        public bool IsInJail { get; set; } = false;
        public List<Card> Cards { get; set; } = new List<Card>();
    }
}
