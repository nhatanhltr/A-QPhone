using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ViewComponent(Name = "SidebarAdmin")]
public class SidebarAdmin : ViewComponent
{
    private readonly CellPhoneDB _context;
    public SidebarAdmin(CellPhoneDB context)
    {
        _context = context;
    }
    public async Task<IViewComponentResult> InvokeAsync()
    {
        // var qr = (from c in _context.menuAdmin select c)
        //                      .Include(c => c.ParentsMenu)
        //                      .Include(c => c.MenuChildren);

        // var menu = (await qr.ToListAsync())
        //                  .Where(c => c.ParentsMenu == null)
        //                  .ToList();
        
        var menu  = await _context.menuAdmin.Where(m=> m.IsActive == 1).ToListAsync();

        // return View(menu);
        return await Task.FromResult((IViewComponentResult)View("SidebarAdmin" , menu));
    }
}