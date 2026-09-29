using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using apis.Data;
using apis.Models;

namespace apis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CategoriesController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Category>>> GetCategories()
        {
            try
            {
                var categories = await _context.Categories.ToListAsync();
                if (!categories.Any()) return Ok(GetMockCategories());
                return Ok(categories);
            }
            catch
            {
                return Ok(GetMockCategories());
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Category>> GetCategory(int id)
        {
            try
            {
                var category = await _context.Categories.FindAsync(id);
                if (category == null)
                {
                    var mock = GetMockCategories().FirstOrDefault(c => c.Id == id);
                    if (mock == null) return NotFound(new { message = "Category not found" });
                    return Ok(mock);
                }
                return Ok(category);
            }
            catch
            {
                var mock = GetMockCategories().FirstOrDefault(c => c.Id == id);
                if (mock == null) return NotFound(new { message = "Category not found" });
                return Ok(mock);
            }
        }

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(Category category)
        {
            try
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
            catch
            {
                category.Id = new Random().Next(10, 99);
                return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var cat = await _context.Categories.FindAsync(id);
                if (cat != null)
                {
                    _context.Categories.Remove(cat);
                    await _context.SaveChangesAsync();
                }
                return NoContent();
            }
            catch
            {
                return NoContent();
            }
        }

        private static List<Category> GetMockCategories()
        {
            return new List<Category>
            {
                new Category { Id = 1, Name = "Hardware & Devices", Description = "Networking gear, gadgets, and physical hardware" },
                new Category { Id = 2, Name = "Software & Cloud Services", Description = "SaaS subscriptions, enterprise software, and dev tools" },
                new Category { Id = 3, Name = "DevOps Tools", Description = "Monitoring, CI/CD, and container management utilities" }
            };
        }
    }
}
