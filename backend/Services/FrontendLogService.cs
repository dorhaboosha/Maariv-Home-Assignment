using MaarivMiniApp.Api.Models;
using Serilog.Context;

namespace MaarivMiniApp.Api.Services;

/// <summary>
/// Receives log entries emitted by the frontend and writes them to the backend's structured log output.
/// This allows frontend errors to be observed alongside backend logs in a single place.
/// </summary>
public class FrontendLogService
{
    private readonly ILogger<FrontendLogService> _logger;

    public FrontendLogService(ILogger<FrontendLogService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Writes the frontend log entry using the backend ILogger pipeline (Serilog).
    /// Pushes Origin=Frontend so the log file clearly labels these entries as [Frontend],
    /// distinguishing them from the [Backend] entries written by the framework and services.
    /// </summary>
    public void Log(FrontendLogEntry entry)
    {
        // Override the global Origin=Backend enrichment for this log line only.
        using (LogContext.PushProperty("Origin", "Frontend"))
        {
            _logger.LogInformation(
                "Level: {Level} | Source: {Source} | Message: {Message} | Path: {Path} | Details: {Details}",
                entry.Level,
                entry.Source,
                entry.Message,
                entry.Path ?? "-",
                entry.Details ?? "-");
        }
    }
}
