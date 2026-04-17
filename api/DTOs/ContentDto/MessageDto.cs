namespace api.DTOs.ContentDto
{
    public class MessageDto
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int ReceiverId { get; set; }
        public string Content { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public int? ParentMessageId { get; set; }
        public string? ParentContent { get; set; }
        public bool IsUnsent { get; set; }
    }
}
