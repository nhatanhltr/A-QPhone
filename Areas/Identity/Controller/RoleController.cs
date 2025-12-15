using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("Identity")]
[Route("/admin/role/[action]/{id?}")]
[Authorize(Roles = "Administrator")]
public class RoleController : Controller
{
    private readonly ILogger<RoleController> _logger;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly CellPhoneDB _cellPhoneDB;
    private readonly UserManager<AppUserModel> _userManager;
    public RoleController(ILogger<RoleController> logger,
    RoleManager<IdentityRole> roleManager,
    CellPhoneDB cellPhoneDB,
    UserManager<AppUserModel> userManager)
    {
        _cellPhoneDB = cellPhoneDB;
        _logger = logger;
        _roleManager = roleManager;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
    [HttpGet]
    public async Task<JsonResult> JsonIndex()
    {
        var r = await _roleManager.Roles.OrderBy(r => r.Name).ToListAsync();
        var roles = new List<RoleModel>();
        foreach (var _r in r)
        {
            var claims = await _roleManager.GetClaimsAsync(_r);
            var claimsString = claims.Select(c => c.Type + "=" + c.Value);

            var rm = new RoleModel()
            {
                Name = _r.Name,
                Id = _r.Id,
                Claims = claimsString.ToArray()
            };
            roles.Add(rm);
        }
        return Json(new { code = 200, data = roles, message = "Success" });
    }


    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateRole(CreateRoleModel role)
    {
        if (!ModelState.IsValid)
        {
            ModelState.AddModelError("", "Lỗi");
        }
        var newRole = new IdentityRole(role.Name);
        var result = await _roleManager.CreateAsync(newRole);
        if (result.Succeeded)
        {
            return Json(new { code = 200, message = "success" });
        }
        var listError = result.Errors.Select(error => error.Description).ToList();
        return Json(new { code = 500, message = "error", errors = listError });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteRole(string id)
    {
        if (id == null) return NotFound("Không tìm thấy role");
        var role = await _roleManager.FindByIdAsync(id);
        if (role == null) return NotFound("Không tìm thấy role");
        var result = await _roleManager.DeleteAsync(role);

        if (result.Succeeded)
        {
            return Json(new { code = 200, message = "success" });
        }
        var listError = result.Errors.Select(error => error.Description).ToList();
        return Json(new { code = 500, message = "error", errors = listError });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateRole(EditRoleModel edit)
    {
        if (edit.id == null) return Json(new { code = 500, message = "error" });
        var role = await _roleManager.FindByIdAsync(edit.id);
        if (role == null) return Json(new { code = 500, message = "error" });
        edit.Claims = await _cellPhoneDB.RoleClaims.Where(rc => rc.RoleId == role.Id).ToListAsync();
        edit.role = role;
        role.Name = edit.Name;
        var result = await _roleManager.UpdateAsync(role);
        if (result.Succeeded)
        {
            return Json(new { code = 200, message = "success" });
        }
        var listError = result.Errors.Select(error => error.Description).ToList();
        return Json(new { code = 500, message = "error", errors = listError });
    }

    [HttpGet]
    public async Task<IActionResult> AddRoleClaimAsync(string roleid)
    {
        if (roleid == null) return NotFound("Không tìm thấy role");
        var role = await _roleManager.FindByIdAsync(roleid);
        if (role == null)
        {
            return NotFound("Không tìm thấy role");
        }

        var model = new EditClaimModel()
        {
            role = role
        };
        return View(model);
    }
    /*  public async Task<IActionResult> CreateClaims(){

          return Json(new {code= 200});
      }*/
}