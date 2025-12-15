using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[Area("Sales")]
[Route("/admin/SalesName/[action]/{id?}")]
// [Authorize(Roles = "Admin, Administrator")]
public class SalesNameController : Controller{
    private readonly ISalesName isales;
    private readonly IMapper mapper;
    private readonly CellPhoneDB context;

    public SalesNameController(ISalesName isales , IMapper mapper , CellPhoneDB context){
        this.isales = isales;
        this.context = context;
        this.mapper = mapper;
    }
    public async Task<IActionResult> index(){
        var result = mapper.Map<List<SalesNameVModel>> (await isales.ListSalesName());
        return View(result);
    }

    // /admin/SalesName/ListSalesNames
    [HttpGet]
    public async Task<IActionResult> ListSalesNames(){
        var salesNames = await isales.ListSalesName();
        if(salesNames == null) return BadRequest("ERROR");

        return Json(new {code = 200 , data = salesNames });
    }
    ///admin/SalesName/CreateSalesName
    [HttpPost]
    public async Task<IActionResult> CreateSalesName(SalesNameVModel salesName){

        if(salesName == null) return BadRequest("ERROR");
        var result = await isales.CreateSalesName(salesName);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }
    [HttpPost]
    public async Task<IActionResult> UpdateSalesName(SalesNameVModel salesName){
        if(salesName == null) return BadRequest("ERROR");
        var result = await isales.UpdateSalesName(salesName);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }
    [HttpPost]
    public async Task<IActionResult> DeleteSalesName(int id){
        if(id == null) return BadRequest("ERROR");
        var result = await isales.DeleteSalesName(id);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }
    // /admin/SalesName/ListSalesProducts
    [HttpGet]
    public async Task<IActionResult> ListSalesProducts(){
        var salesProducts = await isales.ListSalesProducts();
        
        if(salesProducts == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = salesProducts });
    }
    // /admin/SalesName/CreateSalesProduct
    [HttpPost]
    public async Task<IActionResult> CreateSalesProduct(List<ProductSalesVModel> arr){
        if(arr == null) return BadRequest("ERROR");
        var result = await isales.AddProductSaleName(arr);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }

    // /admin/SalesName/DeleteSalesProduct
    [HttpPost]
    public async Task<IActionResult> DeleteSalesProduct(int id , int idn){
        if(id == null || idn == null) return BadRequest("ERROR");
        var result = await isales.DeleteProductSaleName(id, idn);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }

    [HttpPost]
    public async Task<IActionResult> UpdateStatusSaleName(int id , int status){
        if(id == null || status == null) return BadRequest("ERROR");
        var result = await isales.StatusSaleName(id, status);
        if(result == null) return BadRequest("ERROR");
        return Json(new {code = 200, data = result });
    }

    // /admin/SalesName/test
    [HttpGet]
    public async Task<IActionResult> test(){

        var s = await context.salesName.Where(p=> p.status ==1)
                                        .Include(p=>p.SalesNames)
                                        .ThenInclude(o=> o.productModel)
                                        .ToListAsync();
        return Json(new{ data = s});
    }
}