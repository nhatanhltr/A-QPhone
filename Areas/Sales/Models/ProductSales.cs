using System.ComponentModel.DataAnnotations.Schema;

public class ProductSales{
    public int Id { get; set; }
    public int status { get; set; }
    public int ProductID { get; set; }
    [ForeignKey("ProductID")]
    public ProductModel productModel { get; set; }
    public int SalesID { get; set; }
    [ForeignKey("SalesID")]
    public SalesName salesName { get; set; }
}