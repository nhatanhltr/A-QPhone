
public class PaginationModel
{
    public int SizePage { get; set; } = 10;
    public int Total { get; set; }
    public int CurrentPage { get; set; } = 1;
    public int CountPage {get;set;}

}