using System.Security.Claims;
using api.DTOs.AuthDto;
using api.Repositories.Interfaces;
using api.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IUserRepository _userRepo;
        private readonly IAuthHelper _authHelper;
        private readonly ITokenService _tokenService;

        public AuthController(IUserRepository userRepo, IAuthHelper authHelper, ITokenService tokenService)
        {
            _userRepo = userRepo;
            _authHelper = authHelper;
            _tokenService = tokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterDto registerDto)
        {
            if (await _userRepo.UserExists(registerDto.Email)) return BadRequest("Email already registered");

            var profileImageUrl = await _authHelper.SaveProfileImage(registerDto.ProfileImage);
            var result = await _authHelper.Register(registerDto, profileImageUrl);

            if (!result) return BadRequest("Registration failed");

            var user = await _userRepo.GetUserByEmail(registerDto.Email);
            return Ok(new UserDto
            {
                Id = user!.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImageUrl = user.ProfileImageUrl,
                Token = _tokenService.CreateToken(user.Id, user.Email)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var user = await _userRepo.GetUserByEmail(loginDto.Email);
            if (user == null || !_authHelper.VerifyPassword(loginDto.Password, user.PasswordHash, user.PasswordSalt))
                return Unauthorized("Invalid email or password");

            return Ok(new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImageUrl = user.ProfileImageUrl,
                Token = _tokenService.CreateToken(user.Id, user.Email)
            });
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetMe()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _userRepo.GetUserById(userId);
            if (user == null) return NotFound();

            return Ok(new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                ProfileImageUrl = user.ProfileImageUrl
            });
        }

        [Authorize]
        [HttpGet("users")]
        public async Task<IActionResult> GetUsers() => Ok(await _userRepo.GetAllUsers());
    }
}
