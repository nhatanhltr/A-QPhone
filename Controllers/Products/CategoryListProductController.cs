using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class CategoryListProductsController:Controller{

    private readonly CellPhoneDB _context;

    public CategoryListProductsController(CellPhoneDB context)
    {
        _context = context;
    }
    [HttpGet]
    [Route("/san-pham/{slug}/{id?}")]
    public async Task<IActionResult> index(string? slug)
    {
        return View();
    }

    [HttpGet("/ProductsJson")]
    public async Task<IActionResult> ProductsJson(string slug= "samsung", int CurrentPage = 1, int SizePage = 10)
    {
        var model = new ListProductModel();
        model.CurrentPage = CurrentPage;
        model.SizePage = SizePage;
        var products = _context.products
                .Include(p => p.ProductCategoryProducts)
                .ThenInclude(pc => pc.Category)
                .Where(p => p.ProductCategoryProducts.Any(p => p.Category.Slugc == slug));

        // .OrderByDescending(p => p.DateUpdated);
        int total = await products.CountAsync();
        if (total > 0)
        {
            model.Total = total;
            model.CountPage = (int)Math.Ceiling((double)model.Total / model.SizePage);

            if (model.CurrentPage < 1)
                model.CurrentPage = 1;
            if (model.CurrentPage > model.CountPage)
                model.CurrentPage = model.CountPage;

            model.listProducts = await products.Skip((model.CurrentPage - 1) * model.SizePage)
                     .Take(model.SizePage)
                     .Select(p => new ProductModel()
                     {
                         Title = p.Title,
                         Image = p.Image,
                         Slugp = p.Slugp,
                         Price = p.Price,
                         PriceOld = p.PriceOld,
                         Promotion = p.Promotion,
                         Inventory = p.Inventory,
                         Published = p.Published,
                         ProductCategoryProducts = p.ProductCategoryProducts,
                     })
                     .ToListAsync();
            model.Total = total;
            model.CurrentPage = CurrentPage;
            return Json(new { code = 200, data = model, message = "success" });
        }
        return Json(new { code = 200, data = "Không có sản phẩm nào", message = "success" });
    }

}