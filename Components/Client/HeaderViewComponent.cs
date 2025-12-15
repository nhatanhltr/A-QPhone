using Microsoft.AspNetCore.Mvc;
[ViewComponent(Name = "HeaderClient")]
public class Header : ViewComponent{
    private readonly CellPhoneDB _cellPhone;
    public Header (CellPhoneDB cellPhone){
        _cellPhone = cellPhone;
    }

    public async Task<IViewComponentResult> InvokeAsync() {
            var listofPost = (from contact in _cellPhone.contacts
            select contact).ToList();

            return await Task.FromResult((IViewComponentResult)View("Default", listofPost));
        }
}