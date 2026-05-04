using Serilog;

// Configure Serilog before the host is built so startup errors are also captured.
// - Console sink: keeps the live terminal output developers already rely on.
// - File sink: persists every log entry to a daily rolling file under backend/logs/.
//   Files roll at midnight; the date is embedded in the filename (e.g. app20260504.log).
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/app.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,          // keep at most 30 daily files (~1 month)
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss} [{Level:u3}] {Message:lj}{NewLine}{Exception}"
    )
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);

// Replace the default Microsoft logging pipeline with Serilog so all ILogger calls
// (framework, backend services, and FrontendLogService) write to the same sinks.
builder.Host.UseSerilog();

// Override the default 400 response that ASP.NET Core produces for invalid model state
// so it uses our standard ErrorResponse shape instead of the built-in ProblemDetails format.
// This keeps all error responses — validation or otherwise — consistent for the frontend.
builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            // Collect every field-level error message into a flat list of "field: message" strings.
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .Select(e => $"{e.Key}: {string.Join(", ", e.Value!.Errors.Select(x => x.ErrorMessage))}")
                .ToList();

            var error = MaarivMiniApp.Api.DTOs.ErrorResponse.From("VALIDATION_ERROR", "One or more validation errors occurred.", errors);

            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(error);
        };
    });

// FileDataReader is Singleton because it holds no mutable state — it reads files on demand
// and is safe to share across requests. Services that depend on it are Scoped (per-request).
builder.Services.AddSingleton<MaarivMiniApp.Api.Services.FileDataReader>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.ArticleService>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.TagService>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.FrontendLogService>();

// Allow the Next.js dev server to call this API without CORS errors.
// In production this policy would be updated to the real frontend domain.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Catch any unhandled exception and return a standardised 500 ErrorResponse instead of
// the default HTML error page or an empty response. This ensures no stack traces or
// internal details are ever leaked to the client.
app.UseExceptionHandler(errApp =>
{
    errApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        var error = MaarivMiniApp.Api.DTOs.ErrorResponse.From("INTERNAL_ERROR", "An unexpected error occurred.");
        await context.Response.WriteAsJsonAsync(error);
    });
});

app.UseHttpsRedirection();
// CORS must be applied before MapControllers so the policy headers are present on every response,
// including preflight OPTIONS requests sent by the browser before the actual API call.
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
