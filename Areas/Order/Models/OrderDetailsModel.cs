using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
   

public class OrderDetailsModel
{
   
    public int ProductID { get; set; }
    public int OrderID { get; set; }
    public int Quantity { set; get; }
    public decimal PriceOrder { get; set; }
    [ForeignKey("ProductID")]
    public ProductModel products { get; set; }
    [ForeignKey("OrderID")]
    [JsonIgnore]
    public OrderModel order { get; set; }
}