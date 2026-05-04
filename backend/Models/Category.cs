namespace MaarivMiniApp.Api.Models;

/// <summary>
/// Represents a single category deserialized from <c>Data/jsonDataCategories.txt</c>.
/// </summary>
public class Category
{
    /// <summary>Unique numeric identifier for the category.</summary>
    public int CategoryId { get; set; }

    /// <summary>Display name of the category.</summary>
    public string CategoryName { get; set; } = string.Empty;

    /// <summary>
    /// Indicates whether the category is active.
    /// Only active categories are returned by prefix-search queries.
    /// </summary>
    public bool Active { get; set; }
}
