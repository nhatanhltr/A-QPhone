public interface ISalesName {
    public Task<List<SalesNameVModel>> ListSalesName();
    public Task<string> CreateSalesName(SalesNameVModel model);
    public Task<string> UpdateSalesName(SalesNameVModel model);
    public Task<string> DeleteSalesName(int id);

    public Task<List<ProductSalesVModel>> ListSalesProducts();
    public Task<string> AddProductSaleName(List<ProductSalesVModel> arr);

    public Task<string> DeleteProductSaleName(int id , int idn);

    public Task<string> StatusSaleName(int id , int status);

}