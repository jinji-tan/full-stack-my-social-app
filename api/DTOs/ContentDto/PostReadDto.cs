namespace api.DTOs.ContentDto
{
    public class PostReadDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTimeOffset CreatedAt { get; set; }
        public DateTimeOffset UpdatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorProfileImageUrl { get; set; }
    }
}
