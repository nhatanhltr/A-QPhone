public class CreateProductsModel : ProductDetailModel
{
    public string Title { set; get; }
    public IFormFile Image { set; get; }
    public string ImageString { set; get; }
    public string Author { set; get; }
    public decimal Price { set; get; }
    public decimal PriceOld {get;set;}
    public int Status {set; get;}
    public int Promotion { set; get; }
    // public string ImageLink { set; get; }
    public int[]? CategoryIDs {get; set; }
    // public List<IFormFile> ListImage { get; set; }

}