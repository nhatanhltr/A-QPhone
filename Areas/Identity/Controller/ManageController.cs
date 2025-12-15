
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.AspNetCore.Razor.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;

[Area("Identity")]
[Route("/Manage/[action]")]
[Authorize]
public class ManageController : Controller
{
    private readonly UserManager<AppUserModel> _userManager;
    private readonly SignInManager<AppUserModel> _signInManager;
    private readonly CellPhoneDB _context;
    private readonly ILogger<ManageController> _logger;
    private readonly IWebHostEnvironment _hostingEnvironment;


    public ManageController(UserManager<AppUserModel> userManager,
        SignInManager<AppUserModel> signInManager,
        ILogger<ManageController> logger,
        IWebHostEnvironment hostingEnvironment,
        CellPhoneDB context)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _logger = logger;
        _context = context;
        _hostingEnvironment = hostingEnvironment;
    }
    public Task<AppUserModel> GetCurrentUserAsync()
    {
        return _userManager.GetUserAsync(HttpContext.User);
    }

    [HttpGet]
    public IActionResult ProfileUser()
    {
        return View();
    }

    // Manage/ProfileUserJson
    public async Task<IActionResult> ProfileUserJson()
    {

        var user = await GetCurrentUserAsync();
        var profileUser = new ProfileUserModel()
        {
            StringImage = user.Pricture,
            FullName = user.FullName,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            BirthDay = user.Birthday,
            CreationDate = user.CreationDate,
            Gender = user.Gender
        };
        return Json(new { code = 200, data = profileUser, message = "Success" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditProfile(ProfileUserModel profile)
    {
        var infoUser = await GetCurrentUserAsync();
        var findUser = await _userManager.FindByIdAsync(infoUser.Id);
        string url = Functions.GenerateSlug(findUser.FullName);
        if (findUser != null)
        {
            if (profile.Image != null)
            {
                var urlPicture = Functions.SaveImage(profile.Image, "images/user" , url);
            
                if (urlPicture != null)
                {
                    findUser.Pricture = urlPicture;
                }
                else
                {
                    findUser.Pricture = findUser.Pricture;
                }
            }

            findUser.FullName = profile.FullName;
            findUser.PhoneNumber = profile.PhoneNumber;
            findUser.Address = profile.Address;
            findUser.Birthday = profile.BirthDay;
            findUser.Gender = profile.Gender;
            var result = await _userManager.UpdateAsync(findUser);
            // await _signInManager.RefreshSignInAsync(findUser);
            if (result.Succeeded)
            {
                return Json(new { code = 200, message = "success" });
            }
        }
        return Json(new { code = 500, message = "error" });
    }

    [HttpGet]
    public IActionResult ChangePassword()
    {
        return View();
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> ChangePassword(ChangePasswordModel model)
    {
        if (!ModelState.IsValid)
        {
            return View(model);
        }
        var user = await GetCurrentUserAsync();
        if (user != null)
        {
            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);
            if (result.Succeeded)
            {
                await _signInManager.SignInAsync(user, isPersistent: false);
                return Redirect("/");
            }
            else
            {
                ModelState.AddModelError("OldPasswordError", "Sai mật khẩu cũ");
                // Thay vì chuyển hướng, quay lại view ChangePassword với thông báo lỗi
                return View(model);
            }
        }
        return RedirectToAction("ChangePassword");
    }

    [HttpGet("/orderlist")]
    public async Task<IActionResult> OrdersUser()
    {
        var user = await GetCurrentUserAsync();
        var order = await _context.orders
                    .Include(o => o.orderDetail)
                    .ThenInclude(od => od.products)
                    .Include(st => st.Status)
                    .Where(o => o.UserID == user.Id && o.Status.ID <=3)
                    .OrderByDescending(d => d.CreatedDate)
                    .Select(o => new
                    {
                        Id = o.ID,
                        createDate = o.CreatedDate,
                        TotalPrice = o.TotalPrice,
                        TotalQuantity = o.TotalQuantity,
                        Address = o.Address,
                        FullName = o.FullName,
                        Phone = o.PhoneNumber,
                        Details = o.orderDetail,
                        StatusID = o.Status.ID,
                        StatusName = o.Status.StatusName
                    }).ToListAsync();

        return View(order);
    }


    [HttpGet]
    public IActionResult HistoryOrder(){
        return View();
    }
}