using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("Import")]
[Route("/admin/import/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class ImportController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly Iimport iimport;
    private readonly UserManager<AppUserModel> userManager;

    public ImportController(CellPhoneDB context , UserManager<AppUserModel> userManager , Iimport iimport )
    {
        _context = context;
        this.userManager = userManager;
        this.iimport = iimport;
    }

    [HttpGet]
    public IActionResult index()
    {
        return View();
    }

    // /admin/import/createImport
    [HttpGet]
    public IActionResult CreateImport()
    {
        return View();
    }

    [HttpPost]
    public async Task<IActionResult> DataCreateImport([FromBody] ImportVModel model)
    {
        var user = await userManager.GetUserAsync(User);
        if(user == null || model == null ) return BadRequest("ERROR: User does not exist");
        
        try {
            var result = await iimport.CreateImport(model , user.Id);
            return Ok(result);
        }catch (Exception e) {
            return BadRequest(e.Message + "this");
        }
    }
    
    // /admin/import/getListImport
    [HttpGet]
    public async Task<IActionResult> getListImport(int CurrentPage  = 1,int SizePage = 10, string? IDBILL = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        try{
            var data = await iimport.ListBillImport(CurrentPage, SizePage, IDBILL, fromDate, toDate);
            return Json(new {code = 200 , data = data});
        }catch (Exception e){
            return BadRequest(e.Message);
        }
    }
}