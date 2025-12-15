using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class ProductDetailModel
{
    [Key]
    public int Id { get; set; }
    public string Ram { get; set; }
    public string Rom { get; set; }
    public string Screen { get; set; }
    public string Camera { get; set; }
    public string Warranty { get; set; }
    public string Bettery { get; set; }
    public string Security { get; set; }
    public string Discription { get; set; }
    public int ProductID { get; set; }
    [ForeignKey("ProductID")]
    public ProductModel Product { get; set; }
}