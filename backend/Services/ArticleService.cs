using MaarivMiniApp.Api.Models;
using Microsoft.Extensions.Configuration;

namespace MaarivMiniApp.Api.Services;

public class ArticleService
{
    private readonly FileDataReader _fileDataReader;
    private readonly string _fileName;

    public ArticleService(FileDataReader fileDataReader, IConfiguration config)
    {
        _fileDataReader = fileDataReader;
        _fileName = config.GetValue<string>("DataFiles:Articles") ?? throw new InvalidOperationException("DataFiles:Articles is not configured in appsettings.json.");
    }

    public List<Article> GetAllArticles()
    {
        return _fileDataReader.ReadAndDeserialize<Article>(_fileName);
    }

    public Article? GetArticleById(int id)
    {
        return GetAllArticles().FirstOrDefault(a => a.Id == id);
    }

    public List<Article> GetAdditionalArticles(int excludeId)
    {
        return GetAllArticles().Where(a => a.Id != excludeId).ToList();
    }
}
