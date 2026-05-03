var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(e => e.Value?.Errors.Count > 0)
                .Select(e => $"{e.Key}: {string.Join(", ", e.Value!.Errors.Select(x => x.ErrorMessage))}")
                .ToList();

            var error = MaarivMiniApp.Api.DTOs.ErrorResponse.From("VALIDATION_ERROR", "One or more validation errors occurred.", errors);

            return new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(error);
        };
    });

builder.Services.AddSingleton<MaarivMiniApp.Api.Services.FileDataReader>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.ArticleService>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.TagService>();
builder.Services.AddScoped<MaarivMiniApp.Api.Services.FrontendLogService>();

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
app.UseCors("AllowFrontend");
app.MapControllers();

app.Run();
