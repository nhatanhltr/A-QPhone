using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CellPhone.Components.Client
{
    [ViewComponent(Name ="SwiperProducts")]
    public class SwiperProductsViewComponent : ViewComponent
    {
        private readonly CellPhoneDB _context;
        public SwiperProductsViewComponent(CellPhoneDB context) { 
            _context = context;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            // var p = await _context.products
            //                     .OrderByDescending(o=>o.DateCreated)
            //                     .Take(15).Where(pr => pr.Published == true)
            //                     .ToListAsync();

            var p = await _context.salesName.Where(p=> p.status ==1)
                                        .Include(p=>p.SalesNames)
                                        
                                        .ThenInclude(o=> o.productModel )
                                        
                                        .ToListAsync();
           
            return View(p);
        }
    }
}
