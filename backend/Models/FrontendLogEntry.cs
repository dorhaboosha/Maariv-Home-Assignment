namespace MaarivMiniApp.Api.Models;

public class FrontendLogEntry
{
    public string Level { get; set; } = "error";
    public string Message { get; set; } = string.Empty;
    public string Source { get; set; } = "frontend";
    public string? Details { get; set; }
    public string? Path { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
