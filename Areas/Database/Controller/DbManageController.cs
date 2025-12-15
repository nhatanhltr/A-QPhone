using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

[Area("Database")]
[Route("/DbManage/[action]")]
public class DbManageController : Controller
{
    private readonly RoleManager<IdentityRole> _roleManager;

    private readonly UserManager<AppUserModel> _userManager;
    public DbManageController(RoleManager<IdentityRole> roleManager  , UserManager<AppUserModel> userManager)
    {
        _roleManager = roleManager;
        _userManager = userManager;
    }


    public IActionResult Index()
    {
        return View();
    }
    public async Task<IActionResult> SeedData()
    {
        var roles = typeof(RoleDefaults).GetFields().ToList();
        foreach (var role in roles)
        {
            string roleName = (string)role.GetRawConstantValue();
            var roleFind = await _roleManager.FindByNameAsync(roleName);
            if (roleFind == null)
            {
                await _roleManager.CreateAsync(new IdentityRole(roleName));
            }
        }


        //admin // admin123
        var userAdmin = await _userManager.FindByEmailAsync("Admin");
        if (userAdmin == null)
        {
            userAdmin = new AppUserModel()
            {
                UserName = "Admin",
                Email = "Admin@example.com",
                EmailConfirmed = true
            };
            await _userManager.CreateAsync(userAdmin, "Admin123");
            await _userManager.AddToRoleAsync(userAdmin, RoleDefaults.Administrator);
            await _userManager.AddToRoleAsync(userAdmin, RoleDefaults.CanView);
        }
        
        return RedirectToAction("index");
    }
}