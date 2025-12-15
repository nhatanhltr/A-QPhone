using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;

public class SalesNameVModel {
    public int Id { get; set; } 
    public string Name { get; set; } = "";
    public string icon { get; set; } = "";
    public string Background { get; set; } = "";
    public int status { get; set; } = 0;
    [JsonIgnore]
    public List<ProductSales> SalesNames { get;}
     [JsonIgnore]
    public List<Advertisement> Advertisement {get;set;}
}