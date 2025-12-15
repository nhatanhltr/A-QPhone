using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ImportModel{
    [Key]
    public int ID {get;set;}
    public string GUID {get;set;}
    public decimal TotalPrice {get;set;}
    public int TotalQuantity {get;set;}
    public decimal TotalTax {get;set;}
    public decimal TotalPay {get;set;}
    public DateTime CreateAt {get;set;}
    public int SuppelierID {get;set;}
    [ForeignKey("SuppelierID")]
    public SupplierModel Suppelier {get;set;}
    public string UserID {get;set;}
    [ForeignKey("UserID")]
    public AppUserModel User {get;set;}
    public int StatusID {get;set;}
    [ForeignKey("StatusID")]
    public StatusModel Status {get;set;}
    public List<ImportDetailModel> listImportDetails {get;set;}
}