
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Area("order")]
[Route("/admin/orders/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class OrderManageController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly UserManager<AppUserModel> _userManager;

    public OrderManageController(CellPhoneDB context, UserManager<AppUserModel> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public IActionResult index()
    {
        return View();
    }
    // /admin/orders/IndexJson
    public async Task<IActionResult> IndexJson(int CurrentPage = 1, int SizePage = 10, string search = "", int status = 1)
    {
        var model = new ListOrderModel();
        model.CurrentPage = CurrentPage;
        model.SizePage = SizePage;
        var order = _context.orders
                            .Where(o => o.GUID.Contains(search) && o.StatusID == status )
                            .OrderBy(p => p.CreatedDate);

        int total = await order.CountAsync();
        if (total > 0)
        {
            model.Total = total;
            model.CountPage = (int)Math.Ceiling((double)model.Total / model.SizePage);

            if (model.CurrentPage < 1)
                model.CurrentPage = 1;
            if (model.CurrentPage > model.CountPage)
                model.CurrentPage = model.CountPage;

            model.listOrder = await order.Skip((model.CurrentPage - 1) * model.SizePage)
                     .Take(model.SizePage)
                     .Select(p => new OrderModel()
                     {
                         TotalPrice = p.TotalPrice,
                         TotalQuantity = p.TotalQuantity,
                         PhoneNumber = p.PhoneNumber,
                         GUID = p.GUID,
                         CreatedDate = p.CreatedDate,
                         ID = p.ID
                     })
                     .ToListAsync();

            model.Total = total;
            model.CurrentPage = CurrentPage;
            return Json(new { code = 200, data = model, message = "success" });
        }

        return Json(new { code = 300, data = " Chưa có bài viết nào", message = "success" });
    }
    ///admin/orders/OrderDetails

    [HttpGet]
    public async Task<IActionResult> OrderDetails(string? id)
    {
        var order = await _context.orders
                            .Where(o => o.GUID == id)
                            .Include(o => o.orderDetail)
                            .ThenInclude(od => od.products)
                            .Include(st => st.Status)
                            .FirstOrDefaultAsync();
        return View(order);
    }


    // /admin/orders/JsonOrderDetails
    [HttpGet]
    public async Task<IActionResult> JsonOrderDetails(string id)
    {
        var order = await _context.orders
                            .Where(o => o.GUID == id)
                            .Include(o => o.orderDetail)
                            .ThenInclude(od => od.products)
                            .Include(st => st.Status)
                            .FirstOrDefaultAsync();
        return Json(new { code = 200, data = order });

    }
    ///admin/orders/UpdateStatusOrder
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> UpdateStatusOrder(string guid, int idStatus)
    {
        var user = await _userManager.GetUserAsync(this.User);


        if (user == null)
        {
            return Json(new { code = 500, data = "Người dùng không tồn tại", message = "Người dùng không tồn tại" });
        }

        var order = await _context.orders.FirstOrDefaultAsync(p => p.GUID == guid);
        if (order == null)
        {
            return Json(new { code = 500, data = "Đơn hàng không tồn tại", message = "Đơn hàng không tồn tại" });
        }

        var status = await _context.statuses.FirstOrDefaultAsync(s => s.ID == idStatus);
        if (status == null)
        {
            return Json(new { code = 500, data = "Trạng thái không tồn tại", message = "Trạng thái không tồn tại" });
        }
        if (idStatus > order.StatusID && !(order.StatusID + 2 == idStatus))
        {
            order.Status = status;
            order.StaffApprove = user.Email;
            if (idStatus == 3)
            {
                var orderDetails = await _context.orderDetails.Where(od => od.OrderID == order.ID).ToListAsync();
                if (orderDetails == null)
                {
                    return Json(new { code = 500, data = "This is error", message = "This is error" });
                }
                foreach (var i in orderDetails)
                {
                    var product = await _context.products.FirstOrDefaultAsync(p => p.ProductID == i.ProductID);
                    if (product == null)
                    {
                        return Json(new { code = 500, data = "Sản phẩm không tồn tại", message = "Sản phẩm không tồn tại" });
                    }

                    if (!(product.Inventory >= i.Quantity))
                    {
                        return Json(new { code = 500, data = "Số lượng sản phẩm trong kho không đủ", message = "Số lượng sản phẩm trong kho không đủ" });
                    }
                }
                foreach (var i in orderDetails)
                {
                    var product = await _context.products.FirstOrDefaultAsync(p => p.ProductID == i.ProductID);
                    if (product != null)
                    {
                        product.Inventory -= i.Quantity;
                        _context.products.Update(product);
                    }
                }
            }
        }
        else
        {
            return Json(new { code = 500, data = "Không thể chuyển trạng thái", message = "Không thể chuyển trạng thái" });
        }

        _context.orders.Update(order);
        await _context.SaveChangesAsync();
        return Json(new { code = 200, data = "update", message = "success" });
    }

}