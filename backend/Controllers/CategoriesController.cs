using MaarivMiniApp.Api.DTOs;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

/// <summary>
/// Handles HTTP requests for category resources.
/// All responses are wrapped in <see cref="ApiResponse{T}"/> on success
/// or <see cref="ErrorResponse"/> on failure.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    /// <summary>
    /// Returns the name of the category with the given <paramref name="id"/>.
    /// </summary>
    /// <param name="id">The category ID as a route segment (e.g. <c>/api/categories/3</c>).</param>
    /// <returns>
    /// 200 OK with <c>{ "success": true, "data": "category name" }</c>, or
    /// 400 Bad Request if <paramref name="id"/> is not a valid integer, or
    /// 404 Not Found if no category with that ID exists.
    /// </returns>
    [HttpGet("{id}")]
    // id is bound as string (not int) so we can return a descriptive 400 with the invalid value
    // in the message, rather than relying on the default model-binding 400 which has no context.
    public IActionResult GetCategoryNameById(string id)
    {
        if (!int.TryParse(id, out var categoryId))
        {
            return BadRequest(ErrorResponse.From("INVALID_ID", $"'{id}' is not a valid category ID. ID must be a number."));
        }

        var category = _categoryService.GetCategoryById(categoryId);
        if (category is null)
        {
            return NotFound(ErrorResponse.From("CATEGORY_NOT_FOUND", $"Category with ID {categoryId} was not found."));
        }

        // The assignment requires returning the category name (not the full object) for this endpoint.
        return Ok(ApiResponse<object>.Ok(category.CategoryName));
    }

    /// <summary>
    /// Returns all active categories whose name begins with <paramref name="prefix"/>.
    /// </summary>
    /// <param name="prefix">The string prefix to match against category names (case-insensitive).</param>
    /// <returns>
    /// 200 OK with the list of matching active categories, or
    /// 400 Bad Request if <paramref name="prefix"/> is missing or empty.
    /// </returns>
    // This route must be declared before [HttpGet("{id}")] so the literal segment "search"
    // is matched first and never accidentally treated as a category ID value.
    [HttpGet("search")]
    public IActionResult GetByPrefix([FromQuery] string? prefix)
    {
        // Require the caller to supply a non-empty prefix — an empty prefix would return all
        // active categories, which is a different operation and should be explicit.
        if (string.IsNullOrWhiteSpace(prefix))
        {
            return BadRequest(ErrorResponse.From("INVALID_PREFIX", "prefix query parameter is required and must not be empty."));
        }

        var categories = _categoryService.GetCategoriesByPrefix(prefix);
        return Ok(ApiResponse<object>.Ok(categories));
    }
}
