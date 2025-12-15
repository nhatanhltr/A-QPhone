using System.ComponentModel.DataAnnotations;

public class ForgetPasswordModelP
{
    [Required]
    [EmailAddress]
    public string? Email { get; set; }
}