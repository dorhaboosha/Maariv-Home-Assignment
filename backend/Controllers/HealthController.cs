using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

/// <summary>
/// Provides a lightweight liveness endpoint used to verify the API is up and reachable.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    /// <summary>
    /// Returns a simple status object confirming the API is running.
    /// </summary>
    /// <returns>200 OK with <c>{ "status": "ok" }</c>.</returns>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new { status = "ok" });
    }
}
