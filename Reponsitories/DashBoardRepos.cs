
using elFinder.NetCore.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

public class DashBoardRepos : IDashBoard{
    private readonly CellPhoneDB context;
    public DashBoardRepos(CellPhoneDB context){
        this.context = context;
    }

   
    public async Task<DashBoardVModel> GetInfoDashBoard(DateTime from ,DateTime to)
    {

    var DashBoard = new DashBoardVModel();

    var result = await context.orders
        .Where(x => x.StatusID == 4 && x.CreatedDate >= from && x.CreatedDate <= to)
        .GroupBy(x => true)
        .Select(g => new
        {
            TotalQuantity = g.Sum(o => o.TotalQuantity),
            TotalPrice = g.Sum(o => o.TotalPrice),
            CustomerNew = g.Select(o=> o.UserID).Distinct().Count()
        })
        .FirstOrDefaultAsync();
        
    var inventory = await context.products.SumAsync(o => o.Inventory);

    var shipping = await context.orders
                                    .Where(x => x.CreatedDate >= from && x.CreatedDate <= to)
                                    .GroupBy(x=> true)
                                    .Select(g => new{
                                        pendding = g.Count(o=> o.StatusID == 1),
                                        delivering = g.Count(o=> o.StatusID == 3),
                                        delived = g.Count(o=> o.StatusID == 4),
                                        guarantee = g.Count(o=> o.StatusID == 7)
                                    })
                                    .FirstOrDefaultAsync();

        DashBoard.Inventory = inventory;
    if (result != null && shipping != null)
    {
        DashBoard.Bought = result.TotalQuantity;
        DashBoard.Revenue = result.TotalPrice;
        DashBoard.CustomerNew = result.CustomerNew;
        DashBoard.Pendding = shipping.pendding;
        DashBoard.Delivering = shipping.delivering;
        DashBoard.Delived = shipping.delived;
        DashBoard.Guarantee = shipping.guarantee;
    }

    return DashBoard;
    }
}