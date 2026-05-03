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

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var article = _articleService.GetArticleById(id);
        
        if (article is null) 
        {
            return NotFound(ErrorResponse.From("ARTICLE_NOT_FOUND", $"Article with ID {id} was not found."));
        }

        return Ok(ApiResponse<object>.Ok(article));
    }
}
