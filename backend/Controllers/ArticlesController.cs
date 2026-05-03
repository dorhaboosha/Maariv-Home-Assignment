using MaarivMiniApp.Api.DTOs;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

/// <summary>
/// Handles HTTP requests for article resources.
/// All responses are wrapped in <see cref="ApiResponse{T}"/> on success
/// or <see cref="ErrorResponse"/> on failure.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    /// <summary>
    /// Returns every article in the data store.
    /// </summary>
    /// <returns>200 OK with the full list of articles.</returns>
    [HttpGet]
    public IActionResult GetAll()
    {
        var articles = _articleService.GetAllArticles();
        return Ok(ApiResponse<object>.Ok(articles));
    }

    /// <summary>
    /// Returns all articles except the one specified by <paramref name="excludeId"/>.
    /// Used by the frontend to populate the "Additional Articles" section on an article page.
    /// </summary>
    /// <param name="excludeId">The ID of the article currently being viewed, which must be excluded from the result.</param>
    /// <returns>
    /// 200 OK with the filtered list, or
    /// 400 Bad Request if <paramref name="excludeId"/> is missing.
    /// </returns>
    // This route must be declared before [HttpGet("{id}")] so that the literal segment "additional"
    // is matched first and never accidentally treated as an article ID value.
    [HttpGet("additional")]
    public IActionResult GetAdditional([FromQuery] int? excludeId)
    {
        // Require the caller to supply the ID explicitly — defaulting to 0 or -1 would silently
        // return wrong results instead of surfacing a clear client error.
        if (excludeId is null) 
        {
            return BadRequest(ErrorResponse.From("INVALID_EXCLUDE_ID", "excludeId query parameter is required."));
        }

        var articles = _articleService.GetAdditionalArticles(excludeId.Value);
        return Ok(ApiResponse<object>.Ok(articles));
    }

    /// <summary>
    /// Returns a single article by its numeric ID.
    /// </summary>
    /// <param name="id">The article ID as a route segment (e.g. <c>/api/articles/42</c>).</param>
    /// <returns>
    /// 200 OK with the article, or
    /// 400 Bad Request if <paramref name="id"/> is not a valid integer, or
    /// 404 Not Found if no article with that ID exists.
    /// </returns>
    [HttpGet("{id}")]
    // id is bound as string (not int) so we can return a descriptive 400 with the invalid value
    // in the message, rather than relying on the default model-binding 400 which has no context.
    public IActionResult GetById(string id)
    {
        if (!int.TryParse(id, out var articleId))
        {
            return BadRequest(ErrorResponse.From("INVALID_ID", $"'{id}' is not a valid article ID. ID must be a number."));
        }

        var article = _articleService.GetArticleById(articleId);
        if (article is null)
        {
            return NotFound(ErrorResponse.From("ARTICLE_NOT_FOUND", $"Article with ID {articleId} was not found."));
        }
        
        return Ok(ApiResponse<object>.Ok(article));
    }
}
