using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
[Area("Identity")]
[Route("/Admin/Users/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class UserController : Controller
{
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly CellPhoneDB _cellPhoneDB;
    private readonly UserManager<AppUserModel> _userManager;

    public UserController(
    RoleManager<IdentityRole> roleManager,
     CellPhoneDB context,
     UserManager<AppUserModel> userManager)
    {
        _roleManager = roleManager;
        _cellPhoneDB = context;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
    [HttpGet]
    public async Task<IActionResult> IndexJson(int CurrentPage, string email = "")
    {
        var model = new UserListModel();
        model.CurrentPage = CurrentPage;

        var qr = _userManager.Users.Where(u => u.Email.Contains(email) || u.FullName.Contains(email)).OrderBy(u => u.FullName);
        
        int total = await qr.CountAsync();

        if (total > 0)
        {
            model.Total = total;
            model.CountPage = (int)Math.Ceiling((double)model.Total / model.SizePage);

            if (model.CurrentPage < 1)
                model.CurrentPage = 1;
            if (model.CurrentPage > model.CountPage)
                model.CurrentPage = model.CountPage;

            var qr1 = qr.Skip((model.CurrentPage - 1) * model.SizePage)
                        .Take(model.SizePage)
                        .Select(u => new UserAndRole()
                        {
                            Id = u.Id,
                            FullName = u.FullName,
                            Email = u.Email,
                        });

            model.users = await qr1.ToListAsync();

            foreach (var user in model.users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                user.RoleNames = string.Join(", ", roles);
            }
            return Json(new { code = 200, data = model, message = "success" });
        }
        return Json(new { code = 500, message = "not found" });
    }

    [Authorize(Roles ="Administrator,CanView")]
    [HttpGet]
    public async Task<IActionResult> Details(string? id)
    {

        if (id != null)
        {
            AppUserModel user = await _userManager.FindByIdAsync(id);

            if (user != null)
            {
                return View(user);
            }
        }
        return RedirectToAction("Index");
    }

    [Authorize(Roles ="Administrator , CanDelete")]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteUser(string? id)
    {
        var userid = await _userManager.FindByIdAsync(id);

        var result = await _userManager.DeleteAsync(userid);
        if (result.Succeeded)
            return Json(new { code = 200, message = $@"Đã xóa {userid.Email} " });

        return Json(new { code = 500, message = "user is not found" });
    }
   
    [HttpGet]
    public async Task<IActionResult> ListRoleJson()
    {
        var role = await _roleManager.Roles.ToListAsync();
        return Json(new { code = 200, data = role });
    }
    [Authorize(Roles ="Administrator , CanAdd")]
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> AddRoleUser(string id, List<string> roles)
    {
        AppUserModel user = await _userManager.FindByIdAsync(id);
        List<string> roleNames = new List<string>();
        foreach (var role in roles)
        {
            var roleName = await _roleManager.FindByIdAsync(role);
            roleNames.Add(roleName.Name);
        }

        if (user != null)
        {
            var roleOld = (await _userManager.GetRolesAsync(user)).ToArray();
            if (roleOld != null)
            {
                await _userManager.RemoveFromRolesAsync(user, roleOld);
            }
            var result = await _userManager.AddToRolesAsync(user, roleNames);
            if (result.Succeeded)
            {
                return Json(new { code = 200, data = roleNames, message = "success" });
            }
        }
        return Json(new { code = 500, message = "error" });
    }

    [HttpGet]
    public async Task<IActionResult> FindUsers(int CurrentPage, string email = "")
    {
        var model = new UserListModel();
        model.CurrentPage = CurrentPage;

        var qr = _userManager.Users.Where(u => u.Email.Contains(email)).OrderBy(u => u.FullName);

        model.Total = await qr.CountAsync();
        model.CountPage = (int)Math.Ceiling((double)model.Total / model.SizePage);

        if (model.CurrentPage < 1)
            model.CurrentPage = 1;
        if (model.CurrentPage > model.CountPage)
            model.CurrentPage = model.CountPage;

        var qr1 = qr.Skip((model.CurrentPage - 1) * model.SizePage)
                    .Take(model.SizePage)
                    .Select(u => new UserAndRole()
                    {
                        Id = u.Id,
                        FullName = u.FullName,
                        Email = u.Email,
                    });

        model.users = await qr1.ToListAsync();

        foreach (var user in model.users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            user.RoleNames = string.Join(", ", roles);
        }
        return Json(new { code = 200, data = model, message = "success" });
    }

}