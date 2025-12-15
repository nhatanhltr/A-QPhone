
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class ProductsClientController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly CartService _cartService;
    private List<CartItem> products = new List<CartItem>();

    public ProductsClientController(CellPhoneDB context, CartService cartService)
    {
        _context = context;
        _cartService = cartService;

       
    }

    [Route("/{slug}")]
    public async Task<IActionResult> Details(string slug)
    {
        if (slug == null) return NotFound();

        var product = await _context.products
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

                         Promotion = p.Promotion,
                         Inventory = p.Inventory,
                         Published = p.Published,
                         ProductCategoryProducts = p.ProductCategoryProducts,
                         ListImage = p.ListImage
                     }).FirstOrDefaultAsync(p => p.Slugp == slug);

        // return Json(new { code = 200, data = product  , message = "Success"});
        return View(product);
    }

    /// Thêm sản phẩm vào cart
    // /ProductsClient/addtocart/slug
    // [Route("addcart/{slug}")]
    [HttpPost]
    [ValidateAntiForgeryToken]
    // [Authorize]
    public IActionResult AddToCart(string slug)
    {
        if (!HttpContext.User.Identity.IsAuthenticated)
        {
            // Return JSON response indicating unauthorized access
            return Json(new { code = 500, data = "login please", message = "error" });
        }
        var product = _context.products
            .Where(p => p.Slugp == slug)
            .FirstOrDefault();
        if (product == null)
            return NotFound("Không có sản phẩm");

        // Xử lý đưa vào Cart ...
        var cart = _cartService.GetCartItems();
        var cartitem = cart.Find(p => p.product.Slugp == slug);
        if (cartitem != null)
        {
            // Đã tồn tại, tăng thêm 1
            cartitem.quantity++;
        }
        else
        {
            //  Thêm mới
            cart.Add(new CartItem() { quantity = 1, product = product });
        }

        // Lưu cart vào Session
        _cartService.SaveCartSession(cart);
        // Chuyển đến trang hiện thị Cart
        /*return Json(new { data = cart });*/
        return Json(new { code = 200, data = "success", message = "success" });
    }

    [HttpPost("/getProducts")]
    [ValidateAntiForgeryToken]
    public IActionResult GetCartCheckOut(List<string> listPr)
    {
        var cart = _cartService.GetCartItems();
        var cartCheckout = _cartService.GetCheckout();
        // List<CartItem> products = new List<CartItem>();

        foreach (var slug in listPr)
        {
            var cartItem = cart.Find(p => p.product.Slugp == slug);
            // Check if the product is found in the cart
            if (cartItem != null)
            {
                cartCheckout.Add(cartItem);
                // products.Add(cartItem);\
                _cartService.SaveCartCheckout(cartCheckout);
            }
        }
        // return View("Checkout",products);
        return Json(new { code = 200, data = cartCheckout, message = "success" });
    }

    // Hiện thị giỏ hàng
    [Route("/cart", Name = "cart")]
    [Authorize]
    public IActionResult Cart()
    {
        return View(_cartService.GetCartItems());
    }
    [HttpGet("/CartQuantity")]
    public IActionResult CartQuantity(){
        return Json( _cartService.GetCartItems().Count());
    }

    /// xóa item trong cart
    [Route("/removecart/{productid:int}", Name = "removecart")]
    public IActionResult RemoveCart([FromRoute] int productid)
    {
        var cart = _cartService.GetCartItems();
        var cartitem = cart.Find(p => p.product.ProductID == productid);
        if (cartitem != null)
        {
            // Đã tồn tại, tăng thêm 1
            cart.Remove(cartitem);
        }

        _cartService.SaveCartSession(cart);
        return RedirectToAction(nameof(Cart));
    }

    /// Cập nhật
    [Route("/updatecart", Name = "updatecart")]
    [HttpPost]
    public IActionResult UpdateCart(string slug, int quantity)
    {
        // Cập nhật Cart thay đổi số lượng quantity ...
        var cart = _cartService.GetCartItems();

        var cartitem = cart.Find(p => p.product.Slugp == slug);
        if (cartitem != null)
        {
            // Đã tồn tại, tăng thêm 1
            cartitem.quantity = quantity;
        }
        _cartService.SaveCartSession(cart);
        // Trả về mã thành công (không có nội dung gì - chỉ để Ajax gọi)
        return Ok();
    }

    [Route("/checkout")]
    [HttpGet]
    public IActionResult Checkout()
    {
        var checkout = _cartService.GetCheckout();
        _cartService.ClearCartCheckout();
        if (_cartService.GetCheckout() == null)
        {
            return Redirect("/cart");
        }
        return View(checkout);
    }

    [HttpGet("/search")]
    public IActionResult Search(string search)
    {
        var pr = _context.products.Where(p => p.Title.Contains(search))
                                   .Select(p => new ProductModel()
                                   {
                                       Title = p.Title,
                                       Slugp = p.Slugp,
                                       Image = p.Image
                                   })
                                   .Take(10)
                                   .ToList();
        if (pr == null) return Json(new { data = "Không tìm thấy sản phẩm nào" });
        return Json(new { data = pr });
    }
}
