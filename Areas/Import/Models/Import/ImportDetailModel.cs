using System.ComponentModel.DataAnnotations.Schema;

public class ImportDetailModel{
    public int Quantity {get;set;}
    public decimal Price {get;set;}

    public int ImportID {get;set;}
    [ForeignKey("ImportID")]
    public ImportModel Import {get;set;}
    public int ProductID {get;set;}
    public ProductModel Product {get;set;}
}