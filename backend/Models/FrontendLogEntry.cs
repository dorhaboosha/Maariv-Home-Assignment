namespace MaarivMiniApp.Api.Models;

/// <summary>
/// Represents a log entry sent from the frontend via <c>POST /api/logs</c>.
/// The frontend fires these requests silently on API errors so that client-side failures
/// are visible in the backend's structured log output alongside server-side events.
/// </summary>
public class FrontendLogEntry
{
    /// <summary>
    /// Severity level of the log entry (e.g. <c>"error"</c>, <c>"warn"</c>, <c>"info"</c>).
    /// Defaults to <c>"error"</c> because the frontend currently only logs failures.
    /// </summary>
    public string Level { get; set; } = "error";

    /// <summary>Human-readable description of what went wrong (e.g. "Failed to fetch article").</summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// The frontend component or service that emitted the log entry (e.g. <c>"ArticlePage"</c>).
    /// Helps pinpoint which part of the UI triggered the error.
    /// </summary>
    public string Source { get; set; } = "frontend";

    /// <summary>
    /// Optional stringified error detail (typically the result of <c>String(err)</c> in JavaScript).
    /// May be <c>null</c> when no additional context is available.
    /// </summary>
    public string? Details { get; set; }

    /// <summary>
    /// The browser URL path where the error occurred (e.g. <c>"/article/42"</c>).
    /// May be <c>null</c> if the error happened outside a browser context (e.g. SSR).
    /// </summary>
    public string? Path { get; set; }

    /// <summary>
    /// UTC timestamp of when the error was captured on the client.
    /// Defaults to <c>DateTime.UtcNow</c> as a fallback if the frontend omits the field.
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
