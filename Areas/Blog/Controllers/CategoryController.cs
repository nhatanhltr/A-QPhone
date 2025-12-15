using System.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
[Area("Blog")]
[Route("/admin/blog/category/[action]/{id?}")]
[Authorize(Roles = "Administrator")]
public class CategoryController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly ILogger<CategoryController> _logger;

    public CategoryController(CellPhoneDB context, ILogger<CategoryController> logger)
    {
        _context = context;
        _logger = logger;
    }
    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
    [HttpGet]
    public async Task<IActionResult> IndexJson()
    {
        // var qr = await (from c in _context.categories select c).ToListAsync();
        var qr = await _context.categories.OrderByDescending(c => c.Id).ToListAsync();

        return Json(new { code = 200, data = qr, mesage = "Success" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateCategroies(CategoryModel category)
    {
        if (category != null)
        {
            _context.categories.Add(category);
            await _context.SaveChangesAsync();
            return Json(new { code = 200, data = "success", message = "success" });
        }
        return Json(new { code = 500, data = "error", message = "error" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteCategories(int id)
    {
        var category = await _context.categories
                       .Include(c => c.CategoryChildren)
                       .FirstOrDefaultAsync(c => c.Id == id);
        if (category == null)
        {
            return Json(new { code = 500, data = " ", message = "error" });
        }

        foreach (var cCategory in category.CategoryChildren)
        {
            cCategory.ParentCategoryId = category.ParentCategoryId;
        }
        _context.categories.Remove(category);
        await _context.SaveChangesAsync();

        return Json(new { code = 200, data = " ", message = "Success" });
    }

    [HttpGet]
    public async Task<IActionResult> DetailsJson(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var category = await _context.categories
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (category == null)
        {
            return Json(new { code = 500, data = "", message = "error" });
        }

        return Json(new { code = 200, data = category, message = "success" });
    }
    
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditCategory(MenuAdminModel menu)
    {
            try
            {
                // Tìm đối tượng theo Id
                var existingCategory = await _context.categories.FindAsync(menu.ID);
                if (existingCategory == null)
                {
                    return NotFound(); // Trả về 404 nếu không tìm thấy đối tượng
                }
                // Cập nhật các thuộc tính của đối tượng hiện tại với giá trị từ đối tượng category
                _context.Entry(existingCategory).CurrentValues.SetValues(menu);
                // Lưu thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
                return Json(new { code = 200, data = "", message = "success" });
            }
            catch (Exception ex)
            {
                // Xử lý exception nếu có
                return Json(new { code = 500, data = ex.Message, message = "error" });
            }
        
        // Trả về ModelState.Errors nếu ModelState không hợp lệ
        // return Json(new { code = 400, data = ModelState, message = "invalid data" });
    }

}