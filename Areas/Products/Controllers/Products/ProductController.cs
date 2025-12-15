using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("Products")]
[Route("/admin/products/[action]/{id?}")]
// [Authorize(Roles = "Admin, Administrator")]
public class ProductsController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly UserManager<AppUserModel> _userManager;
    private readonly ILogger<ProductsController> _logger;

    public ProductsController(CellPhoneDB context, UserManager<AppUserModel> userManager, ILogger<ProductsController> logger)
    {
        _context = context;
        _userManager = userManager;
        _logger = logger;
    }

    [HttpGet]
    public IActionResult index()
    {
        return View();
    }

    // /admin/products/indexJson
    [HttpGet]
    public async Task<IActionResult> indexJson(int CurrentPage = 1, int SizePage = 10, string? search = "")
    {
        var model = new ListProductModel();
        model.CurrentPage = CurrentPage;
        model.SizePage = SizePage;
            
        var products = _context.products
                            .Where(p=> p.Title.Contains(search))
                            .Include(p => p.Author)
                            .OrderBy(p => p.Inventory);
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
                     .Include(p => p.ListImage)
                     .Include(p => p.ProductCategoryProducts)
                     .ThenInclude(pc => pc.Category)
                     .Select(p => new ProductModel()
                     {
                         ProductID = p.ProductID,
                         Title = p.Title,
                         Image = p.Image,
                         Slugp = p.Slugp,
                         Price = p.Price,
                         PriceOld = p.PriceOld,
                         Promotion = p.Promotion,
                         Inventory = p.Inventory,
                         Published = p.Published,
                         ProductCategoryProducts = p.ProductCategoryProducts,
                         ListImage = p.ListImage
                     })
                     .ToListAsync();

            model.Total = total;
            model.CurrentPage = CurrentPage;
            return Json(new { code = 200, data = model, message = "success" });
        }
        return Json(new { code = 200, data = " Chưa có bài viết nào", message = "success" });
    }


    [HttpGet]
    public IActionResult create()
    {
        return View();
    }

    //  /admin/products/CreateJson
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> CreateJson(CreateProductsModel p)
    {
        var user = await _userManager.GetUserAsync(this.User);
        if (user == null) return NotFound();
        var products = new ProductModel();
        products.AuthorId = user.Id;
        products.DateCreated = products.DateUpdated = DateTime.Now;
        var slug = Functions.GenerateSlug(p.Title);
        
        if (_context.products.Any(p => p.Slugp == slug))
        {
            return Json(new { code = 500, data = "Tên sản phẩm đã tồn tại", message = "Invalid" });
        }
        else
        {
            products.Slugp = Functions.GenerateSlug(p.Title);
        }
        products.Price = p.Price;
        products.PriceOld = p.PriceOld;
        products.Promotion = Functions.Discount(p.Price ,p.PriceOld);
        products.Published = Convert.ToBoolean(p.Status);
        products.Title = p.Title;
      
        var urlImge = Functions.SaveImage(p.Image , "images/products" , slug);
        if(urlImge != null){
            products.Image = urlImge;
        }
 
        _context.products.Add(products);
        if (p.CategoryIDs != null)
        {
            foreach (var CateId in p.CategoryIDs)
            {
                _context.Add(new ProductCategoryProductModel()
                {
                    CategoryID = CateId,
                    Product = products
                });
            }
        }

        
        var prDetails = new ProductDetailModel();
        prDetails.Warranty = p.Warranty;
        
        prDetails.Security = p.Security;
        prDetails.Bettery = p.Bettery;
        prDetails.Camera = p.Camera;
        prDetails.Screen = p.Screen;
        prDetails.Ram = p.Ram;
        prDetails.Rom = p.Rom;
          if(p.Discription != null){
            prDetails.Discription = p.Discription;
        }else{
            prDetails.Discription = " ";
        }
        prDetails.Product = products;
        _context.productDetail.Add(prDetails);      

        await _context.SaveChangesAsync();
        return Json(new { code = 200, data = "Success", message = "Success" });
    }
[HttpGet]
// /admin/products/EditImage/8
public IActionResult EditImage(int id)
{
    var result = from pr in _context.products 
                 join prI in _context.productImage on pr.ProductID equals prI.ProductID
                 where pr.ProductID == id
                 group new { pr, prI } by pr into groupedResult
                 select new ProductEditImageModel()
                 {
                     product = groupedResult.Key,
                     Images = groupedResult.Select(item => new ProductImageModel()
                     {
                        Id = item.prI.Id,
                         FileName = item.prI.FileName,
                         ProductID = item.prI.ProductID,
                         posImage = item.prI.posImage,
                        //  Product = item.pr
                     }).ToList()
                 };
    
    return View(result.FirstOrDefault());
}
    // /admin/products/details/20
    [HttpGet]
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null) return NotFound();

        var product = await _context.products
                    .Include(p => p.ProductCategoryProducts)
                    .ThenInclude(pc => pc.Category)
                    .Select(p => new ProductModel()
                     {
                         ProductID = p.ProductID,
                         Title = p.Title,
                         Image = p.Image,
                         Slugp = p.Slugp,
                         AuthorId = p.Author.FullName,
                         Price = p.Price,
                         PriceOld = p.PriceOld,
                         Promotion = p.Promotion,
                         Inventory = p.Inventory,
                         DateCreated = p.DateCreated,
                         DateUpdated = p.DateUpdated,
                         Published = p.Published,
                         ProductCategoryProducts = p.ProductCategoryProducts,
                         ListImage = p.ListImage
                     }).FirstOrDefaultAsync(p => p.ProductID == id);

        return View(product);
    }

    


    [HttpGet]
    public IActionResult Delete(int? id)
    {
        if (id == null) return NotFound();
        var product = _context.products
                    .Select(p => new ProductModel()
                    {
                        ProductID = p.ProductID,
                        Title = p.Title,
                        Image = p.Image,
                    })
                    .FirstOrDefault(p => p.ProductID == id);

        return View(product);
    }

    [HttpPost]
    public IActionResult DeletePr(int? id)
    {
        if (id == null) return NotFound();

        var pr = _context.products.FirstOrDefault(p => p.ProductID == id);
        if (pr == null) return NotFound();
        _context.products.Remove(pr);
        _context.SaveChanges();
        return RedirectToAction("Index");
    }



}