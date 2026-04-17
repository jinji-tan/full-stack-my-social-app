namespace api.DTOs.ContentDto
{
    public class CommentReadDto
    {
        public int Id { get; set; }
        public int PostId { get; set; }
        public int UserId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? ParentId { get; set; }
        public DateTimeOffset CreatedAt { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string? AuthorProfileImageUrl { get; set; }
    }
}
