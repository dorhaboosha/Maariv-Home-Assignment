namespace MaarivMiniApp.Api.Models;

public class Article
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string ImageURL { get; set; } = string.Empty;
    public string ImageCredit { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public List<ArticleTag> Tags { get; set; } = new();
    public string Body { get; set; } = string.Empty;
}
