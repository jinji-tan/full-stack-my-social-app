using System.Security.Claims;
using api.DTOs.ContentDto;
using api.Models;
using api.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class CommentController : ControllerBase
    {
        private readonly ICommentRepository _commentRepo;
        public CommentController(ICommentRepository commentRepo) { _commentRepo = commentRepo; }

        [HttpGet("post/{postId}")]
        public async Task<IActionResult> GetComments(int postId) => Ok(await _commentRepo.GetCommentsByPostId(postId));

        [HttpPost]
        public async Task<IActionResult> CreateComment(CommentCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var comment = new Comment { PostId = dto.PostId, UserId = userId, Content = dto.Content, ParentId = dto.ParentId, CreatedAt = DateTime.UtcNow };
            var id = await _commentRepo.CreateComment(comment);
            return Ok(await _commentRepo.GetCommentById(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var comment = await _commentRepo.GetCommentById(id);
            if (comment == null) return NotFound();
            if (comment.UserId != userId) return Forbid();

            await _commentRepo.DeleteComment(id);
            return NoContent();
        }
    }
}
