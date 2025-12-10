namespace Rich4Backend.Models
{
    public class BoardSpace
    {
        public int Position { get; set; }
        public string Name { get; set; } = string.Empty;
        public SpaceType Type { get; set; }
        public Property? Property { get; set; }
    }

    public enum SpaceType
    {
        Start,
        Property,
        Chance,
        Destiny,
        Jail,
        FreeParking,
        GoToJail,
        Tax
    }
}
