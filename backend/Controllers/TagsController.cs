using MaarivMiniApp.Api.DTOs;
using MaarivMiniApp.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace MaarivMiniApp.Api.Controllers;

/// <summary>
/// Handles HTTP requests for tag resources.
/// All responses are wrapped in <see cref="ApiResponse{T}"/> on success
/// or <see cref="ErrorResponse"/> on failure.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TagsController : ControllerBase
{
    private readonly TagService _tagService;

    public TagsController(TagService tagService)
    {
        _tagService = tagService;
    }

    /// <summary>
    /// Returns every tag in the data store.
    /// </summary>
    /// <returns>200 OK with the full list of tags.</returns>
    [HttpGet]
    public IActionResult GetAll()
    {
        var tags = _tagService.GetAllTags();
        return Ok(ApiResponse<object>.Ok(tags));
    }

    /// <summary>
    /// Returns a single tag by its numeric ID.
    /// </summary>
    /// <param name="id">The tag ID as a route segment (e.g. <c>/api/tags/17</c>).</param>
    /// <returns>
    /// 200 OK with the tag, or
    /// 400 Bad Request if <paramref name="id"/> is not a valid integer, or
    /// 404 Not Found if no tag with that ID exists.
    /// </returns>
    [HttpGet("{id}")]
    // id is bound as string (not int) so we can return a descriptive 400 with the invalid value
    // in the message, rather than relying on the default model-binding 400 which has no context.
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
