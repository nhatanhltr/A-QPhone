using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

public class SalesName {
    [Key]
    public int Id { get; set; } 
    [Required]
    public string Name { get; set; } = "";
    public string icon { get; set; } = "";
    public string Background { get; set; } = "";
    public int status { get; set; } = 0;

    public List<ProductSales> SalesNames { get;set;}

    public List<Advertisement> Advertisement {get;set;} = new List<Advertisement>();
}