using AutoMapper;
using Microsoft.EntityFrameworkCore;

public class SalesNameRepos : ISalesName
{
    private readonly CellPhoneDB context;
    private readonly IMapper mapper;

    public SalesNameRepos(CellPhoneDB context, IMapper mapper)
    {
        this.context = context;
        this.mapper = mapper;
    }
    public async Task<string> CreateSalesName(SalesNameVModel model)
    {
        var saleName = mapper.Map<SalesName>(model);
        var check = await context.salesName.FirstOrDefaultAsync(s => s.Name == saleName.Name);
        if (check != null) return check.Name + "đã tồn tại";

        context.salesName.Add(saleName);
        await context.SaveChangesAsync();
        return "success";
    }

    public async Task<string> DeleteSalesName(int id)
    {
        var saleName = await context.salesName.FindAsync(id);
        if (saleName == null) return "Đối tượng không tồn tại";
        context.salesName.Remove(saleName);
        await context.SaveChangesAsync();
        return "success";
    }

    public async Task<List<SalesNameVModel>> ListSalesName()
    {
        var saleNameVars = mapper.Map<List<SalesNameVModel>>(await context.salesName.ToListAsync());
        return saleNameVars;
    }

    public async Task<string> UpdateSalesName(SalesNameVModel model)
    {
        var saleName = mapper.Map<SalesName>(model);
        var check = await context.salesName.FindAsync(saleName.Id);
        if (check == null) return "Đối tượng không tồn tại";

        context.Entry(check).CurrentValues.SetValues(saleName);
        await context.SaveChangesAsync();
        return "success";
    }

    public async Task<List<ProductSalesVModel>> ListSalesProducts()
    {
        var salesProducts = await context.productSales
        .Include(pr => pr.productModel)
        .ToListAsync();
        return mapper.Map<List<ProductSalesVModel>>(salesProducts);
    }

     public async Task<string> AddProductSaleName(List<ProductSalesVModel> arr){

        var list = mapper.Map<List<ProductSales>>(arr);
        context.productSales.AddRange(list);
        await context.SaveChangesAsync();
        return "success";
     }

    public async Task<string> DeleteProductSaleName(int id , int idn){
            var saleName = await context.productSales.FirstOrDefaultAsync(p => p.SalesID == idn && p.ProductID == id);
            context.productSales.Remove(saleName);
            await context.SaveChangesAsync();
            return "success";
    }

    public async Task<string> StatusSaleName(int id , int status){
        var saleName = await context.salesName.FirstOrDefaultAsync(p => p.Id == id);
        if(saleName == null) return "Đối tượng không tồn tại";
        saleName.status  = status;
        context.salesName.Update(saleName);
        await context.SaveChangesAsync();
        return "success";
    }
    
}