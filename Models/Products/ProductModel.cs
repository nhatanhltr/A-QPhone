using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

[Table("Product")]
public class ProductModel
{
    [Key]
    public int ProductID { set; get; }
    [Required(ErrorMessage = "Phải có tiêu đề bài viết")]
    [Display(Name = "Tiêu đề")]
    [StringLength(160, MinimumLength = 5, ErrorMessage = "{0} dài {1} đến {2}")]
    public string Title { set; get; }
    public string? Image { set; get; }
    public string Slugp { set; get; }

    [Display(Name = "Xuất bản")]
    public bool Published { set; get; }
    // [Required]
    [Display(Name = "Người đăng")]
    public string AuthorId { set; get; }
    [ForeignKey("AuthorId")]
    [Display(Name = "Người đăng")]
    public AppUserModel Author { set; get; }

    [Display(Name = "Ngày tạo")]
    public DateTime DateCreated { set; get; }

    [Display(Name = "Ngày cập nhật")]
    public DateTime DateUpdated { set; get; }

    [Display(Name = "Giá mưới")]
    [Range(0, int.MaxValue, ErrorMessage = "Nhập giá trị từ {1}")]
    public decimal Price { set; get; }

    [Display(Name = "Giá cũ")]
    [Range(0, int.MaxValue, ErrorMessage = "Nhập giá trị từ {1}")]
    public decimal PriceOld { set; get; }
    [Display(Name = "Khuyến mãi")]
    public int Promotion { set; get; }
    public int Inventory { set; get; }
    public List<ProductDetailModel> ProductDetai { get; set; }
    [JsonIgnore]
    public List<ProductCategoryProductModel> ProductCategoryProducts { get; set; }
    [JsonIgnore]
    public List<ProductImageModel> ListImage { get; set; }
}