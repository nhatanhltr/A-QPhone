using Microsoft.AspNetCore.Mvc;

[ViewComponent(Name = "Pagination")]
public class PaginationViewComponent : ViewComponent
{
    public async Task<IViewComponentResult> InvokeAsync(PaginationModel page)
    {
        return await Task.FromResult((IViewComponentResult)View("Default" , page));
    }

}