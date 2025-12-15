using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("Import")]
[Route("/admin/import/supplier/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class SupplierController : Controller
{
    private readonly CellPhoneDB _context;

    public SupplierController(CellPhoneDB context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult index()
    {
        return View();
    }

    //  /admin/import/supplier/indexJson
    [HttpGet]
    public async Task<IActionResult> indexJson()
    {
        var sp = await _context.suppliers.ToListAsync();
        return Json(new { code = 200, data = sp, message = "success" });
    }

    // /admin/import/supplier/Create
    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateSupplier sp)
    {

        if (sp == null) return NotFound();

        var nsp = new SupplierModel();
        nsp.GUID = Guid.NewGuid().ToString();
        nsp.Name = sp.Name;
        nsp.phone = sp.phone;
        nsp.Email = sp.Email;
        nsp.Address = sp.Address;
        nsp.Description = sp.Description;
        if(nsp.Description == null){
            nsp.Description =" ";
        }
        if (sp.Image != null && sp.Image.Length > 0)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images/supplier", sp.Image.FileName);
            using (var stream = System.IO.File.Create(path))
            {
                await sp.Image.CopyToAsync(stream);
            }
            nsp.Image = "/images/supplier/" + sp.Image.FileName;
        }
        else
        {
            nsp.Image = "/images/icons8-supplier-100.png";
        }

        _context.suppliers.Add(nsp);
        await _context.SaveChangesAsync();

        return Json(new { code = 200, data = "success", message = "success" });
    }
    ///admin/import/supplier/DetailsAPI
    [HttpGet]
    public async Task<IActionResult> DetailsAPI(string GUID)
    {
        if (GUID == null) return NotFound();

        var d = await _context.suppliers.FirstOrDefaultAsync(d => d.GUID == GUID);
        if (d == null) return NotFound();
        return Json(new { code = 200, data = d, message = "success" });
    }


    ///admin/import/supplier/DeleteApi
    [HttpPost]
    public async Task<IActionResult> DeleteApi(string GUID)
    {
        if (GUID == null) return NotFound();
        var sp = await _context.suppliers.FirstOrDefaultAsync(s => s.GUID == GUID);
        if (sp == null) return NotFound();
        _context.suppliers.Remove(sp);
        await _context.SaveChangesAsync();
        return Json(new { code = 200, data = "success", message = "success" });
    }
}