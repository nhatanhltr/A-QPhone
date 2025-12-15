using System.ComponentModel.DataAnnotations;

public class LogInModel
{
    [Required(ErrorMessage = "Phải nhập {0}")]
    [Display(Name = "Email")]
    public string? Email { get; set; }

    [Required]
    [DataType(DataType.Password)]
    [Display(Name = "Mật khẩu", Prompt = "Mật khẩu")]
    public string? Password { get; set; }

    [Display(Name = "Nhớ thông tin đăng nhập?")]
    public bool RememberMe { get; set; }
}