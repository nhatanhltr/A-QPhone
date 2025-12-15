using System.ComponentModel.DataAnnotations.Schema;

public class AdvertisementVModel {
    public int Id { get; set; }
    public string? Name { get; set; }
    public string Imgae { get; set; }
    public string Url { get; set; } = "";
    public string Description { get; set; } = "";
    public int SalesID { get; set; }
}