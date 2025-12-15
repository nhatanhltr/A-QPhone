using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("Order")]
[Route("/admin/status/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class StatusController : Controller{
    private readonly CellPhoneDB _context;

    public StatusController(CellPhoneDB context)
    {
        _context = context;
    }

    public IActionResult Index(){
        return View();
    }
    [HttpGet]
    public async Task<IActionResult> IndexJson(){
        var status = await _context.statuses.ToListAsync();
        return Json(new{code= 200 , data = status , message= "success"});
    }

    [HttpPost]
    public async Task<IActionResult> DeleteJson(int? id){
        if(id == null) return NotFound();

        var status = await _context.statuses.FindAsync(id);
        if(status == null) return NotFound();
        _context.statuses.Remove(status);
        await _context.SaveChangesAsync();
        return Json(new{code = 200 , data = "success", message = "success"});
    }

    [HttpPost]
    public async Task<IActionResult> CreateJson(StatusModel status){
        if(await _context.statuses.AnyAsync(s=> s.StatusName == status.StatusName)){
            return Json(new{code = 500 , data = "Exists Status Name" , message = "error"});
        }
        await _context.statuses.AddAsync(status);
        await _context.SaveChangesAsync();
        return Json(new{code = 200 , data = "success" , message = "success"});
    }
    [HttpGet]
    public async Task<IActionResult> DetailsJson(int? id){
        if(id == null) return NotFound();

        var status = await _context.statuses.FindAsync(id);
        return Json(new{ code =200 , data = status , message = "success"});
    }
    [HttpPost]
    public async Task<IActionResult> UpdateJson(StatusModel status){
        if(status == null) return NotFound();

        StatusModel? statusNew = await _context.statuses.FindAsync(status.ID);
        if(statusNew == null) return NotFound();
        statusNew.StatusName = status.StatusName;
        statusNew.Description = status.Description;
        await _context.SaveChangesAsync();
        return Json(new{code=200, data = "success" , message = "success"});
    }
}