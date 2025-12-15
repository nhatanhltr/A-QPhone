using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

public class ImportRepos : Iimport
{
    private readonly CellPhoneDB _cellPhone;
    private readonly UserManager<AppUserModel> _userManager;
    private readonly SignInManager<AppUserModel> _signInManager;
    private readonly IMapper _mapper;
    public ImportRepos(CellPhoneDB context, IMapper mapper,
                       UserManager<AppUserModel> userManager, SignInManager<AppUserModel> signInManager)
    {
        _cellPhone = context;
        _userManager = userManager;
        _signInManager = signInManager;
        _mapper = mapper;
    }


    public async Task<string> CreateImport(ImportVModel model, string userID)
    {
        var checkBillImport = await _cellPhone.imports.FirstOrDefaultAsync(p => p.GUID == model.Uuid);
        if (checkBillImport == null)
        {
            var supplier = await _cellPhone.suppliers.FirstOrDefaultAsync(s => s.Email == model.supplierEmail);
            var import = new ImportModel()
            {
                GUID = model.Uuid,
                UserID = userID,
                TotalPay = model.totalPay,
                TotalPrice = model.totalPrice,
                TotalQuantity = model.totalQuantity,
                TotalTax = model.totalTax,
                CreateAt = DateTime.Now,
                SuppelierID = supplier.ID,
                StatusID = 4,
            };
            _cellPhone.imports.Add(import);

            foreach (var id in model.listImport)
            {
                var product = await _cellPhone.products.FirstOrDefaultAsync(p => p.ProductID == id.Id);
                if (product != null)
                {
                    product.Inventory += id.Quantity;
                    _cellPhone.products.Update(product);
                    var details = new ImportDetailModel()
                    {
                        Quantity = id.Quantity,
                        Price = id.Price,
                        ProductID = product.ProductID,
                        Import = import,
                    };
                    _cellPhone.importDetails.Add(details);
                }
                else
                {
                    return "Mã sản phẩm không tồn tại";
                }
            }
            await _cellPhone.SaveChangesAsync();
            return "success";
        }
        return "Hóa đơn này đã tồn tại";
    }


    public async Task<PagingImportVModel> ListBillImport(int CurrentPage  = 1,int SizePage = 10, string? IDBILL = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var listBill = await _cellPhone.imports.ToListAsync();
        var result = new PagingImportVModel();

        result.CurrentPage = CurrentPage;
        result.SizePage = SizePage;

        if (IDBILL != null)
        {
            listBill = listBill.Where(r => r.GUID == IDBILL).ToList();
        }
        if (fromDate != null && toDate != null)
        {
            listBill = listBill.Where(r => r.CreateAt >= fromDate && r.CreateAt <= toDate).ToList();
        }
        int total = listBill.Count;
        if (total > 0)
        {
            result.Total = total;
            result.CountPage = (int)Math.Ceiling((double)result.Total / result.SizePage);
            if(result.CurrentPage <1) result.CurrentPage = 1;
            if(result.CurrentPage > result.CountPage) result.CurrentPage = result.CountPage;

             var list = listBill.Skip((result.CurrentPage - 1) * result.SizePage)
                                          .Take(result.SizePage)
                                          .Select(r => new ImportVModel(){
                                             Uuid = r.GUID,
                                             totalPay = r.TotalPay,
                                             totalPrice = r.TotalPrice,
                                             totalQuantity = r.TotalQuantity,
                                             totalTax = r.TotalTax,
                                             CreateAt = r.CreateAt,
                                             StatusID = r.StatusID,
                                          })
                                          .ToList();
                                        
            result.listImports = _mapper.Map<List<ImportVModel>>(list);

        return result;
        }
        else
        {
            return new PagingImportVModel();
        }
    }
    
    // public async Task<ImportVModel> BillImportDetails(string uuid){
        
    // }

    
}