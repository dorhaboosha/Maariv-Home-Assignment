namespace MaarivMiniApp.Api.Models;

/// <summary>
/// Represents a single news article deserialized from <c>Data/jsonData.txt</c>.
/// Property names match the JSON keys in the data file (case-insensitive deserialization is enabled).
/// </summary>
public class Article
{
    /// <summary>Unique numeric identifier for the article.</summary>
    public int Id { get; set; }

    /// <summary>The article headline.</summary>
    public string Title { get; set; } = string.Empty;

    /// <summary>A short summary or subtitle shown beneath the headline.</summary>
    public string Description { get; set; } = string.Empty;

    /// <summary>Absolute URL of the article's main image.</summary>
    public string ImageURL { get; set; } = string.Empty;

    /// <summary>Attribution text displayed below the image (photographer or agency name).</summary>
    public string ImageCredit { get; set; } = string.Empty;

    /// <summary>
    /// Publication date as a pre-formatted string (e.g. <c>"26/02/2024 14:59"</c>).
    /// Stored as a string to preserve the exact format from the source data without re-formatting.
    /// </summary>
    public string Date { get; set; } = string.Empty;

    /// <summary>Tags associated with this article. May be an empty list if the article has no tags.</summary>
    public List<ArticleTag> Tags { get; set; } = new();

    /// <summary>
    /// The full article body text. May contain newline characters (<c>\n</c>);
    /// the frontend applies <c>white-space: pre-line</c> to render them correctly.
    /// </summary>
    public string Body { get; set; } = string.Empty;
}
