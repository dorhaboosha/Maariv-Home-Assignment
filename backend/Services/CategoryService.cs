using MaarivMiniApp.Api.Models;
using Microsoft.Extensions.Configuration;

namespace MaarivMiniApp.Api.Services;

/// <summary>
/// Provides category lookup operations backed by <c>Data/DataCategories.txt</c>.
/// </summary>
public class CategoryService
{
    private readonly FileDataReader _fileDataReader;
    private readonly string _fileName;

    public CategoryService(FileDataReader fileDataReader, IConfiguration config)
    {
        _fileDataReader = fileDataReader;
        _fileName = config.GetValue<string>("DataFiles:Categories")
            ?? throw new InvalidOperationException("DataFiles:Categories is not configured in appsettings.json.");
    }

    public List<Category> GetAllCategories()
    {
        return _fileDataReader.ReadAndDeserialize<Category>(_fileName);
    }

    /// <summary>
    /// Returns the category with the given <paramref name="id"/>, or <c>null</c> if not found.
    /// The controller extracts <c>CategoryName</c> from the result for the JSON response.
    /// </summary>
    public Category? GetCategoryById(int id)
    {
        return GetAllCategories().FirstOrDefault(c => c.CategoryId == id);
    }

    /// <summary>
    /// Returns all <em>active</em> categories whose name begins with <paramref name="prefix"/>.
    /// The comparison is case-insensitive.
    /// </summary>
    /// <returns>A list of matching active categories. Empty list if nothing matches.</returns>
    public List<Category> GetCategoriesByPrefix(string prefix)
    {
        return GetAllCategories()
            .Where(c => c.Active && c.CategoryName.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
            .ToList();
    }
}
