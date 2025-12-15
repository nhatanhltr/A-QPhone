using System.ComponentModel.DataAnnotations;

public class CreatePostModel
{
    // public int id {get;set;}
    public string Title { get; set; }
    public string? AbstractTitle { get; set; }
    public IFormFile Image { get; set; }
    public string? Slug { get; set; }
    public string? Content { get; set; }

    public int Status { get; set; } = 0;
    public int[] CategoryIDs { get; set; }
}