using System.ComponentModel.DataAnnotations;

public class SupplierModel{
    [Key]
    public int ID {get;set;}
    public string GUID {get;set;}
    public string Name {get;set;}
    public string Image {get;set;}
    public string Address {get;set;}
    public string phone {get;set;}
    public string Email {get;set;}
    public string Description {get;set;}
}