using Microsoft.AspNetCore.Mvc;

namespace apis.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetHealth()
        {
            return Ok(new
            {
                status = "Healthy",
                service = ".NET REST API Backend",
                timestamp = DateTime.UtcNow,
                version = "1.0.0"
            });
        }
    }
}
