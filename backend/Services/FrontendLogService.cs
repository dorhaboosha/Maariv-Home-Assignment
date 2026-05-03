using MaarivMiniApp.Api.Models;

namespace MaarivMiniApp.Api.Services;

public class FrontendLogService
{
    private readonly ILogger<FrontendLogService> _logger;

    public FrontendLogService(ILogger<FrontendLogService> logger)
    {
        _logger = logger;
    }

    public void Log(FrontendLogEntry entry)
    {
        _logger.LogInformation("[Frontend Log] Level: {Level} | Source: {Source} | Message: {Message} | Path: {Path} | Details: {Details}",
            entry.Level, entry.Source, entry.Message, entry.Path ?? "-", entry.Details ?? "-");
    }
}
