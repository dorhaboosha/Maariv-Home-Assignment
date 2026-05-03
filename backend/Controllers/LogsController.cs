using MaarivMiniApp.Api.Models;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

/// <summary>
/// Receives log entries emitted by the frontend and writes them to the backend's structured log output.
/// This allows frontend errors to be observed alongside backend logs in a single place.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly FrontendLogService _logService;

    public LogsController(FrontendLogService logService)
    {
        _logService = logService;
    }

    /// <summary>
    /// Accepts a single frontend log entry and delegates it to <see cref="FrontendLogService"/>.
    /// The frontend calls this endpoint fire-and-forget; failures on the client side are silently swallowed
    /// so that a broken logging pipeline never degrades the user-facing UI.
    /// </summary>
    /// <param name="entry">The log entry sent from the frontend.</param>
    /// <returns>200 OK — always, so the frontend's silent catch has nothing to act on.</returns>
    [HttpPost]
    public IActionResult Post([FromBody] FrontendLogEntry entry)
    {
        _logService.Log(entry);
        // Always return 200 — the frontend swallows this response silently,
        // so there is no meaningful value in returning a different status code.
        return Ok();
    }
}
