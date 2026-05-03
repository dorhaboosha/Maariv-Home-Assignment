using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LogsController : ControllerBase
{
    private readonly FrontendLogService _logService;

    public LogsController(FrontendLogService logService)
    {
        _logService = logService;
    }
}
