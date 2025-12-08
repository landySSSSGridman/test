namespace Rich4Backend.Models
{
    public class Property
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Position { get; set; }
        public int Price { get; set; }
        public int BaseRent { get; set; }
        public int Level { get; set; } = 0;
        public int MaxLevel { get; set; } = 5;
        public int UpgradePrice { get; set; }
        public string? OwnerId { get; set; }
        public PropertyType Type { get; set; }
        public string Color { get; set; } = string.Empty;
    }

    public enum PropertyType
    {
        Street,
        Station,
        Utility,
        Special
    }
}
