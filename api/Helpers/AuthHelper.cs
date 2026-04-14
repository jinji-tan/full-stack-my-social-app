using System.Security.Cryptography;
using System.Text;
using api.Data;
using api.DTOs;
using api.Models;
using api.Repositories.Interfaces;
using api.Services.Interfaces;

namespace api.Helpers
{
    public class AuthHelper : IAuthHelper
    {
        private readonly SocialContext _dapper;
        private readonly IWebHostEnvironment _env;

        public AuthHelper(SocialContext dapper, IWebHostEnvironment env)
        {
            _dapper = dapper;
            _env = env;
        }

        public async Task<bool> Register(RegisterDto registerDto, string? profileImageUrl)
        {
            using var hmac = new HMACSHA512();

            var sql = @"INSERT INTO Social.Users (FirstName, LastName, Email, PasswordHash, PasswordSalt, ProfileImageUrl)
                        VALUES (@FirstName, @LastName, @Email, @PasswordHash, @PasswordSalt, @ProfileImageUrl)";

            return await _dapper.ExecuteSql(sql, new
            {
                registerDto.FirstName,
                registerDto.LastName,
                registerDto.Email,
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                ProfileImageUrl = profileImageUrl
            });
        }

        public bool VerifyPassword(string password, byte[] storedHash, byte[] storedSalt)
        {
            using var hmac = new HMACSHA512(storedSalt);
            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
            return computedHash.SequenceEqual(storedHash);
        }

        public async Task<string?> SaveProfileImage(IFormFile? file)
        {
            if (file == null || file.Length == 0) return null;

            var uploadsFolder = Path.Combine(_env.ContentRootPath, "wwwroot", "uploads", "profiles");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return $"/uploads/profiles/{fileName}";
        }
    }
}
