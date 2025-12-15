public class ProductSalesVModel{
    public int Id { get; set; }
    public int status { get; set; } = 1;
    public int ProductID { get; set; }
   
    public ProductModel productModel { get; set; }
    public int SalesID { get; set; }
   
    public SalesName salesName { get; set; }
}