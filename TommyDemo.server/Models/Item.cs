namespace TommyDemo.server.Models
{
    public class Item
    {  
        public int Id { get; set; }
        public required string Name { get; set; }
        public string? Description { get; set; }
        public int User_Id { get; set; }
    }
}
