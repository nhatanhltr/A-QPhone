using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Tls.Crypto.Impl.BC;

[Area("Products")]
[Route("/admin/products/category/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class CategoryProductController : Controller
{
    private readonly CellPhoneDB _context;

    public CategoryProductController(CellPhoneDB context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }
    // /admin/products/category/IndexJson
    [HttpGet]
     public async Task<IActionResult> IndexJson()
    {
        var qr = await _context.categoryProducts.ToListAsync();
        
        return Json(new { code = 200, data = qr, message = "success" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create(CategoryProductModel category)
    {
        if (category != null)
        {
            category.Slugc = Functions.GenerateSlug(category.Title);
            if(category.Description == null){
                category.Description = category.Slugc;
            }
            _context.categoryProducts.Add(category);
            await _context.SaveChangesAsync();
            return Json(new { code = 200, data = "success", message = "success" });
        }
        return Json(new { code = 500, data = "error", message = "error" });

    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteCategories(int id)
    {
        var category = await _context.categoryProducts
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
        _context.categoryProducts.Remove(category);
        await _context.SaveChangesAsync();

        return Json(new { code = 200, data = " ", message = "Success" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> EditCategory(CategoryModel category)
    {
            try
            {
                // Tìm đối tượng theo Id
                var existingCategory = await _context.categoryProducts.FindAsync(category.Id);
                if (existingCategory == null)
                {
                    return NotFound(); // Trả về 404 nếu không tìm thấy đối tượng
                }
                // Cập nhật các thuộc tính của đối tượng hiện tại với giá trị từ đối tượng category
                _context.Entry(existingCategory).CurrentValues.SetValues(category);
                // Lưu thay đổi vào cơ sở dữ liệu
                await _context.SaveChangesAsync();
                return Json(new { code = 200, data = "success", message = "success" });
            }
            catch (Exception ex)
            {
                // Xử lý exception nếu có
                return Json(new { code = 500, data = ex.Message, message = "error" });
            }
        
        // Trả về ModelState.Errors nếu ModelState không hợp lệ
        // return Json(new { code = 400, data = ModelState, message = "invalid data" });
    }

    [HttpGet]
    public async Task<IActionResult> DetailsJson(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var category = await _context.categoryProducts
            .Include(c => c.ParentCategory)
            // .Include(c => c.CategoryChildren)
            .FirstOrDefaultAsync(m => m.Id == id);
        if (category == null)
        {
            return Json(new { code = 500, data = "", message = "error" });
        }

        return Json(new { code = 200, data = category, message = "success" });
    }


}