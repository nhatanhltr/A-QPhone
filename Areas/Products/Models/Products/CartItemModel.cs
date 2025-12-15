public class CartItem
{
    public int quantity { set; get; }
    public decimal PriceImport {get;set;}
    public int Inventory {get;set;}
    public ProductModel product { set; get; }
}