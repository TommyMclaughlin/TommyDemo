namespace TommyDemo.server.Models
{
    public class ItemDTO
    {
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int User_Id { get; set; }
    }
}
