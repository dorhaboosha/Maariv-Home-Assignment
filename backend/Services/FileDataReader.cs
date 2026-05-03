using System.Text.Json;
using Microsoft.AspNetCore.Hosting;

namespace MaarivMiniApp.Api.Services;

public class FileDataReader
{
    private readonly ILogger<FileDataReader> _logger;
    private readonly string _dataFolderPath;

    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public FileDataReader(ILogger<FileDataReader> logger, IWebHostEnvironment env)
    {
        _logger = logger;
        _dataFolderPath = Path.Combine(env.ContentRootPath, "Data");
    }

    public string ReadFile(string fileName)
    {
        var filePath = Path.Combine(_dataFolderPath, fileName);
        try
        {
            return File.ReadAllText(filePath);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to read file: {FileName}", fileName);
            throw;
        }
    }

    public List<T> ReadAndDeserialize<T>(string fileName)
    {
        var json = ReadFile(fileName);
        try
        {
            return JsonSerializer.Deserialize<List<T>>(json, JsonOptions) ?? new List<T>();
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to deserialize file: {FileName}", fileName);
            throw;
        }
    }
}
