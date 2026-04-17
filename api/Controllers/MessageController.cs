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
    public class MessageController : ControllerBase
    {
        private readonly IMessageRepository _messageRepo;
        public MessageController(IMessageRepository messageRepo) { _messageRepo = messageRepo; }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetConversation(int userId)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            return Ok(await _messageRepo.GetConversation(currentUserId, userId));
        }

        [HttpPost]
        public async Task<IActionResult> SendMessage(MessageDto dto)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var message = new Message 
            { 
                SenderId = currentUserId, 
                ReceiverId = dto.ReceiverId, 
                Content = dto.Content, 
                Timestamp = DateTime.UtcNow, 
                IsRead = false,
                ParentMessageId = dto.ParentMessageId
            };
            var id = await _messageRepo.SendMessage(message);
            
            var result = await _messageRepo.GetMessageById(id);
            if (result == null) return NotFound();

            dto.Id = id;
            dto.SenderId = currentUserId;
            dto.Timestamp = result.Timestamp;
            dto.IsUnsent = false;
            
            return Ok(dto);
        }

        [HttpDelete("unsend/{id}")]
        public async Task<IActionResult> UnsendMessage(int id)
        {
            var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var success = await _messageRepo.UnsendMessage(id, currentUserId);
            return success ? NoContent() : BadRequest("Could not unsend message or unauthorized.");
        }
    }
}
