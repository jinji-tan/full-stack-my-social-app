namespace api.DTOs.ContentDto
{
    public class CommentCreateDto
    {
        public int PostId { get; set; }
        public string Content { get; set; } = string.Empty;
        public int? ParentId { get; set; }
    }
}
