
using System.ComponentModel.DataAnnotations;

public class CreateSupplier{
    [Key]
    public int ID {get;set;}
    public string Name {get;set;}
    public IFormFile Image {get;set;}
    public string Address {get;set;}
    public string phone {get;set;}
    public string Email {get;set;}
    public string Description {get;set;}
}