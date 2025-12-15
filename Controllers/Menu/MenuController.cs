using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class MenuController : Controller
{
    private readonly CellPhoneDB _context;

    public MenuController(CellPhoneDB context)
    {
        _context = context;
    }

    [HttpGet("/menu")]
    public async Task<IActionResult> IndexJson()
    {
        // L?y category cha + con
        var categories = await _context.categoryProducts
            .Include(c => c.CategoryChildren)
            .Where(c => c.ParentCategoryId == null)
            .Select(c => new
            {
                id = c.Id,
                title = c.Title,
                description = c.Description,
                slugc = c.Slugc,
                categoryChildren = c.CategoryChildren.Select(child => new
                {
                    id = child.Id,
                    title = child.Title,
                    slugc = child.Slugc
                }).ToList()
            })
            .ToListAsync();

        // L?y s?n ph?m theo t?ng danh m?c con
        var products = await _context.productCategoryProducts
            .Join(_context.categoryProducts,
                cp => cp.CategoryID,
                c => c.Id,
                (cp, c) => new { cp, c })
            .Join(_context.products,
                x => x.cp.ProductID,
                p => p.ProductID,
                (x, p) => new { x.c, Product = p })
            .GroupBy(x => x.c.Id)
            .Select(g => new
            {
                categoryId = g.Key,
                products = g.Take(10).Select(p => new
                {
                    id = p.Product.ProductID,
                    name = p.Product.Title,
                    slug = p.Product.Slugp
                }).ToList()
            })
            .ToListAsync();

        return Json(new
        {
            code = 200,
            data = categories,
            products = products
        });
    }
}
