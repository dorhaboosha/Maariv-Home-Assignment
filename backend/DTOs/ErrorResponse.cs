namespace MaarivMiniApp.Api.DTOs;

/// <summary>
/// Standard envelope for every failed API response.
/// All error-returning endpoints use this shape so the frontend can always
/// expect <c>{ "success": false, "error": { "code": "...", "message": "..." } }</c>
/// on a non-2xx status code.
/// </summary>
public class ErrorResponse
{
    /// <summary>Always <c>false</c> for error responses.</summary>
    public bool Success { get; set; } = false;

    /// <summary>Structured error details describing what went wrong.</summary>
    public ApiError Error { get; set; } = new();

    /// <summary>
    /// Creates an error response from a machine-readable <paramref name="code"/> and a
    /// human-readable <paramref name="message"/>, with an optional <paramref name="details"/> payload
    /// (e.g. a list of validation errors).
    /// </summary>
    public static ErrorResponse From(string code, string message, object? details = null) =>
        new() { Error = new ApiError { Code = code, Message = message, Details = details } };
}

/// <summary>
/// Describes the specific error that occurred within an <see cref="ErrorResponse"/>.
/// </summary>
public class ApiError
{
    /// <summary>
    /// Machine-readable error identifier (e.g. <c>ARTICLE_NOT_FOUND</c>, <c>INVALID_ID</c>).
    /// Clients should use this field for programmatic error handling rather than parsing the message.
    /// </summary>
    public string Code { get; set; } = string.Empty;

    /// <summary>Human-readable description of the error, suitable for logging or display.</summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Optional extra context (e.g. a list of validation error strings).
    /// May be <c>null</c> when no additional detail is available.
    /// </summary>
    public object? Details { get; set; }
}
