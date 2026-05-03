namespace MaarivMiniApp.Api.Models;

/// <summary>
/// Represents a tag attached to an article, as embedded in each article's <c>Tags</c> array
/// inside <c>Data/jsonData.txt</c>.
/// </summary>
public class ArticleTag
{
    /// <summary>Numeric identifier of the tag, used to link to <c>GET /api/tags/{id}</c>.</summary>
    public int TagId { get; set; }

    /// <summary>Display name of the tag (e.g. "בנימין נתניהו").</summary>
    public string TagName { get; set; } = string.Empty;

    /// <summary>
    /// The canonical URL of the tag on the original Maariv website.
    /// Provided as-is from the source data; the frontend uses <c>TagId</c> for internal navigation.
    /// </summary>
    public string TagUrl { get; set; } = string.Empty;
}
