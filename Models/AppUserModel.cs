using Microsoft.AspNetCore.Identity;

public class AppUserModel : IdentityUser
{
    public string? Pricture {set; get;}
    public string? FullName {set; get;}
    public string? Address {get;set;}
    public DateTime? Birthday {get; set;}
    public DateTime? CreationDate {get; set;}
    public int? Gender {set; get;}
    public AppUserModel(){
        CreationDate = DateTime.Now;
    }
}