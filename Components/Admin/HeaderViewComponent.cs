using Microsoft.AspNetCore.Mvc;

[ViewComponent(Name = "HeaderAdmin")]
public class HeaderAdmin : ViewComponent{
    private readonly CellPhoneDB _cellPhone;
    public HeaderAdmin (CellPhoneDB cellPhone){
        _cellPhone = cellPhone;
    }

    public async Task<IViewComponentResult> InvokeAsync() {

            return await Task.FromResult((IViewComponentResult)View("HeaderAdmin"));
        }
}