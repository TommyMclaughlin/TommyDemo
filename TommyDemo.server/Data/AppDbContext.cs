using Microsoft.EntityFrameworkCore;
using TommyDemo.server.Models;

namespace TommyDemo.server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<User> User { get; set; }
        public DbSet<Item> Item { get; set; }
    }
}
