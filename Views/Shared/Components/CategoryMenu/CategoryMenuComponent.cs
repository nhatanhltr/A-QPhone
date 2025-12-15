
using Microsoft.AspNetCore.Mvc;
[ViewComponent(Name = "CategoryMenu")]
public class CategoryMenuComponent : ViewComponent
{

    public IViewComponentResult Invoke()
    {
        return View();
    }

}