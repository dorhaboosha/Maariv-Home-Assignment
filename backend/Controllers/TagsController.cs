using MaarivMiniApp.Api.DTOs;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly TagService _tagService;

    public TagsController(TagService tagService)
    {
        _tagService = tagService;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        var tags = _tagService.GetAllTags();
        return Ok(ApiResponse<object>.Ok(tags));
    }

    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        var tag = _tagService.GetTagById(id);
        if (tag is null) 
        {
            return NotFound(ErrorResponse.From("TAG_NOT_FOUND", $"Tag with ID {id} was not found."));
        }

        return Ok(ApiResponse<object>.Ok(tag));
    }
}
