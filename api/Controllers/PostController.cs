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
    public class PostController : ControllerBase
    {
        private readonly IPostRepository _postRepo;
        public PostController(IPostRepository postRepo) { _postRepo = postRepo; }

        [HttpGet]
        public async Task<IActionResult> GetPosts() => Ok(await _postRepo.GetAllPosts());

        [HttpGet("{id}")]
        public async Task<IActionResult> GetPost(int id)
        {
            var post = await _postRepo.GetPostById(id);
            return post == null ? NotFound() : Ok(post);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePost(PostCreateDto dto)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var post = new Post { UserId = userId, Title = dto.Title, Content = dto.Content, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow };
            var id = await _postRepo.CreatePost(post);
            return Ok(await _postRepo.GetPostById(id));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(int id)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var post = await _postRepo.GetPostById(id);
            if (post == null) return NotFound();
            if (post.UserId != userId) return Forbid();

            await _postRepo.DeletePost(id);
            return NoContent();
        }
    }
}
