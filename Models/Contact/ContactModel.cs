using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

public class ContactModel{
    [Key]
    public int Id {get; set;}
    [Required(ErrorMessage = "Phải nhập họ tên")]
    [StringLength(50)]
    [DisplayName("Họ và Tên")]
    public string? FullName {get; set;}
    [Required(ErrorMessage = "Phải nhập Email")]
    [EmailAddress(ErrorMessage = "Phải là địa chỉ email")]
    public string? Email {get; set;}
    public DateTime DateSend {get; set;}
    [DisplayName("Nội dung")]
    [Required(ErrorMessage = "Không được để trống")]
    public string? Message {get ; set;}
    [StringLength(50)]
    [Required(ErrorMessage = "Phải nhập số điện thoại")]
    [Phone(ErrorMessage = "Phải là số diện thoại")]

    [DisplayName("Số điện thoại")]
    public string? Phone {get; set;}
    [DisplayName("Trạng thái")]
    public int Status {get; set;}
}