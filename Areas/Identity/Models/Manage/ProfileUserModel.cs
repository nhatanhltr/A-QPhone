using System.ComponentModel.DataAnnotations;

public class ProfileUserModel
{
    [Display(Name = "Họ và tên")]
    public string? FullName { get; set; }
    [Display(Name = "Email")]
    public string? Email { get; set; }
    [Display(Name = "Số điện thoại")]
    public string? PhoneNumber { get; set; }
    public string? StringImage { get; set; }
    public IFormFile? Image { get; set; } = null;
    
    [Display(Name = "Địa chỉ")]
    [StringLength(400)]
    public string? Address { get; set; }
    [Display(Name = "Ngày sinh")]
    public DateTime? BirthDay { get; set; }
    [Display(Name = "Ngày tham gia")]
    public DateTime? CreationDate { get; set; }
    [Display(Name = "Giới tính")]
    public int? Gender { get; set; }

}