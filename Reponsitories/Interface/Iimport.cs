public interface Iimport{
    public Task<string> CreateImport(ImportVModel model , string userID);
    public Task<PagingImportVModel> ListBillImport(int CurrentPage =1 , int SizePage = 10, string? IDBILL = null , DateTime? fromDate = null , DateTime? toDate =  null);
    // public Task<ImportVModel> BillImportDetails(string uuid);
}