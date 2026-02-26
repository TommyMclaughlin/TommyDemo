using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TommyDemo.server.Data;
using TommyDemo.server.Models;

namespace TommyDemo.server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ItemController : ControllerBase
    {
        private readonly AppDbContext _context; // Your EF Core DbContext
        private readonly IConfiguration _config;
        public ItemController(AppDbContext context, IConfiguration config) {
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpGet("getItems")]
        public async Task<IActionResult> GetItems()
        {
           var _currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

            var user =  await _context.User.FirstOrDefaultAsync(u => u.UserName == _currentUser);

            if (user == null)
                return NotFound("User not found");

            var items = await _context.Item
                .Where(i => i.User_Id == user.Id)
                .Select(i => new {
                    i.Id,
                    i.Name,
                    i.Description
                })
                .ToListAsync();



            return Ok(items);
        }

        [Authorize(Roles ="Admin")]
        [HttpGet("getAllItems")]
        public async Task<IActionResult> GetAllItems()
        {
            var _currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

            var items = await _context.Item.ToListAsync();

            return Ok(items);
        }

        [Authorize]
        [HttpDelete("deleteItem/{id}")]
        public async Task<IActionResult> DeleteItem(int id)
        {
            var currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _context.User.FirstOrDefaultAsync(u => u.UserName == currentUser);
            if (user == null) return Unauthorized();

            var item = await _context.Item.FirstOrDefaultAsync(i => i.Id == id && i.User_Id == user.Id);
            if (item == null) return NotFound();

            _context.Item.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Item deleted successfully");
        }

        [Authorize(Roles ="Admin")]
        [HttpDelete("adminDeleteItem/{id}")]
        public async Task<IActionResult> AdminDeleteItem(int id)
        {
            var item = await _context.Item.FirstOrDefaultAsync(i => i.Id == id);
            if (item == null) return NotFound();

            _context.Item.Remove(item);
            await _context.SaveChangesAsync();

            return Ok("Item deleted successfully");
        }

        //        [Authorize]
        [HttpPost("addItem")]
        public async Task<IActionResult> AddItem([FromBody] ItemDTO dto)
        {

            var currentUser = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _context.User.FirstOrDefaultAsync(u => u.UserName == currentUser);
            if (user == null) return Unauthorized();

            var item = new Item { 
                Name = dto.Name,
                Description = dto.Description,
                User_Id = user.Id
            };

            _context.Item.Add(item);
            await _context.SaveChangesAsync();

            return Ok(item);
        }



    }
}
