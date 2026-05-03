namespace MaarivMiniApp.Api.DTOs;

public class ErrorResponse
{
    public bool Success { get; set; } = false;
    public ApiError Error { get; set; } = new();

    public static ErrorResponse From(string code, string message, object? details = null) =>
        new() { Error = new ApiError { Code = code, Message = message, Details = details } };
}

public class ApiError
{
    public string Code { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public object? Details { get; set; }
}
