

using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public class OrderControler : Controller
{
    private readonly CellPhoneDB _context;
    private readonly UserManager<AppUserModel> _userManager;
    

    private readonly SendMailService _sendMailService;
    public OrderControler(CellPhoneDB context, UserManager<AppUserModel> userManager, ILogger<OrderControler> logger, SendMailService sendMailService = null)
    {
        _context = context;
        _userManager = userManager;
        _sendMailService = sendMailService;
    }

    [HttpPost("/checkout")]
    public async Task<IActionResult> CheckoutJson([FromBody] CreateCheckoutModel ordercheckout)
    {
        try
        {
            var user = await _userManager.GetUserAsync(HttpContext.User);
            OrderModel order = new OrderModel();
            order.UserID = user.Id;
            order.CreatedDate = DateTime.Now;
            order.FullName = ordercheckout.FullName;
            order.PhoneNumber = ordercheckout.PhoneNumber;
            order.Address = ordercheckout.Address;
            order.Email = ordercheckout.Email;
            order.Notes = ordercheckout.Notes;
            order.PaymentMethod = ordercheckout.PaymentMethod;
            order.StatusID = 1;
            order.GUID = Guid.NewGuid().ToString();
            
            order.TotalPrice = 0;
            foreach(var i in ordercheckout.orderDetail){
                order.TotalQuantity += i.Quantity;
                var product = await _context.products.FirstOrDefaultAsync(p=> p.Slugp == i.ProductSlug);
                order.TotalPrice += product.Price * i.Quantity;
            }
            _context.orders.Add(order);
            
            foreach (var i in ordercheckout.orderDetail)
            {
                 var product = await _context.products.FirstOrDefaultAsync(p=> p.Slugp == i.ProductSlug);
                
                _context.orderDetails.Add(new OrderDetailsModel()
                {
                    order = order,
                    ProductID = product.ProductID,
                    Quantity = i.Quantity,
                    PriceOrder = product.Price
                });
            }
            await _context.SaveChangesAsync();
          
            return Json(new { code = 200, data = "success", message = "success" });
        }
        catch (Exception ex)
        {
            return NotFound();
        }
    }

    [HttpGet("/order/thanks")]
    public IActionResult Thanks(){
        return View();
    }

}