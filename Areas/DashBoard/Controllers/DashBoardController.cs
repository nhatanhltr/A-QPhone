using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
[Area("DashBoard")]
[Route("/admin/dashboard/[action]")]
[Authorize(Roles = "Admin, Administrator, CanView")]
public class DashBoardController : Controller{
    private readonly IDashBoard dashBoard;

    public DashBoardController(IDashBoard dashBoard)
    {
        this.dashBoard = dashBoard;
    }
    public IActionResult Index(){
        return View();
    }

    // /admin/dashboard/Statistical
    [HttpGet]
    public async Task<IActionResult> Statistical(DateTime from ,DateTime to){
        var model = await dashBoard.GetInfoDashBoard(from , to);
        return Json(new {code = 200 , data = model});
    }
   
}