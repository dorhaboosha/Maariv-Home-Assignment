using MaarivMiniApp.Api.DTOs;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ArticleService _articleService;

    public ArticlesController(ArticleService articleService)
    {
        _articleService = articleService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var articles = _articleService.GetAllArticles();
        return Ok(ApiResponse<object>.Ok(articles));
    }

    [HttpGet("additional")]
    public IActionResult GetAdditional([FromQuery] int? excludeId)
    {
        if (excludeId is null) 
        {
            return BadRequest(ErrorResponse.From("INVALID_EXCLUDE_ID", "excludeId query parameter is required."));
        }

        var articles = _articleService.GetAdditionalArticles(excludeId.Value);
        return Ok(ApiResponse<object>.Ok(articles));
    }

    [HttpGet("{id}")]
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
