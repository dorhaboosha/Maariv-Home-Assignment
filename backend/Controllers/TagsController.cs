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

    [HttpGet("{id}")]
    public IActionResult GetById(string id)
    {
        if (!int.TryParse(id, out var tagId)) 
        {
            return BadRequest(ErrorResponse.From("INVALID_ID", $"'{id}' is not a valid tag ID. ID must be a number."));
        }

        var tag = _tagService.GetTagById(tagId);
        if (tag is null)
        {
            return NotFound(ErrorResponse.From("TAG_NOT_FOUND", $"Tag with ID {tagId} was not found."));
        }
        
        return Ok(ApiResponse<object>.Ok(tag));
    }
}
