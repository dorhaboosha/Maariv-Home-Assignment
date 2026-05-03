namespace MaarivMiniApp.Api.Models;

/// <summary>
/// Represents a standalone tag deserialized from <c>Data/jsonDataTags.txt</c>.
/// A tag groups related articles and has its own dedicated page on the frontend (<c>/tags/{id}</c>).
/// </summary>
public class Tag
{
    /// <summary>Unique numeric identifier for the tag.</summary>
    public int TagId { get; set; }

    /// <summary>Display name of the tag (e.g. "בנימין נתניהו").</summary>
    public string TagName { get; set; } = string.Empty;

    /// <summary>
    /// Absolute URL of the tag's representative image.
    /// May be an empty string if the tag has no associated image;
    /// the frontend renders the image conditionally.
    /// </summary>
    public string TagImage { get; set; } = string.Empty;
}
