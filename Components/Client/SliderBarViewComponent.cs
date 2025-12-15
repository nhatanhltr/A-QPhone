using Microsoft.AspNetCore.Mvc;

namespace CellPhone.Components.Client
{
    [ViewComponent(Name ="SliderBar")]
    public class SliderBarViewComponent : ViewComponent
    {
        public async Task<IViewComponentResult> InvokeAsync()
        {

            return await Task.FromResult((IViewComponentResult)View("Default"));

        }
    }
}
