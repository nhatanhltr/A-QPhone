using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Mvc.ModelBinding;

public class PostModel 
{
    [Key]
    public int PostID { get; set; }
    [DisplayName("Tiêu đề")]
    [Required]
    public string Title { get; set; }

    [Display(Name = "Mô tả tiêu đề")]
    public string? AbstractTitle { get; set; }
    [Display(Name = "Ảnh mô tả")]
    public string? Image { get; set; }

    [Display(Name = "Chuỗi định danh (url)", Prompt = "Nhập hoặc để trống tự phát sinh theo Title")]
    [StringLength(160, MinimumLength = 5, ErrorMessage = "{0} dài {1} đến {2}")]
    [RegularExpression(@"^[a-z0-9-]*$", ErrorMessage = "Chỉ dùng các ký tự [a-z0-9-]")]
    public string? Slug { get; set; }
    [Display(Name = "Nội dung")]
    public string? Content { get; set; }
    [Display(Name = "Tác giả")]
    [BindNever]
    public string AuthorId { set; get; }
    [ForeignKey("AuthorId")]
    [Display(Name = "Tác giả")]
    public AppUserModel Author { set; get; }
    

    [Display(Name = "Ngày tạo bài viết")]
    public DateTime DateCreated { get; set; }
    [Display(Name = "Ngày cập nhật")]
    public DateTime DateUpdated { set; get; }
    [Display(Name = "Trạng thái")]
    public int Status { get; set; } = 0;

    [Display(Name = "Lượt xem")]
    public int ViewCount { get; set; }
    public List<PostCategoryModel> PostCategories { get; set; }

    

}