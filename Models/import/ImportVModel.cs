public class ImportVModel{
     public string Uuid {get;set;}
    public decimal totalPrice {get;set;}
    public int totalQuantity {get;set;}
    public decimal totalTax {get;set;}
    public decimal totalPay {get;set;}
    public DateTime CreateAt {get;set;}
    public string supplierEmail {get;set;}
    public string? UserID {get;set;}
    
    public int StatusID {get;set;}
    
    public List<ImportDetailVModel> listImport {get;set;}
}