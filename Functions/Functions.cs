using System.Text.RegularExpressions;

public class Functions
{
    private readonly IWebHostEnvironment _hostingEnvironment;

    public Functions(IWebHostEnvironment hostingEnvironment)
    {
        _hostingEnvironment = hostingEnvironment;
    }
    public static string GenerateSlug(string str, bool hierarchical = true)
    {
        string slug = str.Trim().ToLower();

        string[] decomposed = new string[] { "à","á","ạ","ả","ã","â","ầ","ấ","ậ","ẩ","ẫ","ă",
                                                    "ằ","ắ","ặ","ẳ","ẵ","è","é","ẹ","ẻ","ẽ","ê","ề" ,
                                                    "ế","ệ","ể","ễ", "ì","í","ị","ỉ","ĩ", "ò","ó","ọ",
                                                    "ỏ","õ","ô","ồ","ố","ộ","ổ","ỗ","ơ" ,"ò","ớ","ợ","ở",
                                                    "õ", "ù","ú","ụ","ủ","ũ","ư","ừ","ứ","ự","ử","ữ",
                                                    "ỳ","ý","ỵ","ỷ","ỹ", "đ",
                                                    "À","À","Ạ","Ả","Ã","Â","Ầ","Ấ","Ậ","Ẩ","Ẫ","Ă" ,
                                                    "Ằ","Ắ","Ặ","Ẳ","Ẵ", "È","É","Ẹ","Ẻ","Ẽ","Ê","Ề",
                                                    "Ế","Ệ","Ể","Ễ", "Ì","Í","Ị","Ỉ","Ĩ", "Ò","Ó","Ọ","Ỏ",
                                                    "Õ","Ô","Ồ","Ố","Ộ","Ổ","Ỗ","Ơ" ,"Ờ","Ớ","Ợ","Ở","Ỡ",
                                                    "Ù","Ú","Ụ","Ủ","Ũ","Ư","Ừ","Ứ","Ự","Ử","Ữ", "Ỳ","Ý","Ỵ",
                                                    "Ỷ","Ỹ", "Đ"};
        string[] precomposed =  {  "à","á","ạ","ả","ã","â","ầ","ấ","ậ","ẩ","ẫ","ă",
                                        "ằ","ắ","ặ","ẳ","ẵ","è","é","ẹ","ẻ","ẽ","ê","ề" ,
                                        "ế","ệ","ể","ễ", "ì","í","ị","ỉ","ĩ", "ò","ó","ọ","ỏ",
                                        "õ","ô","ồ","ố","ộ","ổ","ỗ","ơ" ,"ờ","ớ","ợ","ở","ỡ", "ù",
                                        "ú","ụ","ủ","ũ","ư","ừ","ứ","ự","ử","ữ", "ỳ","ý","ỵ","ỷ","ỹ",
                                        "đ", "À","Á","Ạ","Ả","Ã","Â","Ầ","Ấ","Ậ","Ẩ","Ẫ","Ă" ,"Ằ","Ắ",
                                        "Ặ","Ẳ","Ẵ", "È","É","Ẹ","Ẻ","Ẽ","Ê","Ề","Ế","Ệ","Ể","Ễ", "Ì",
                                        "Í","Ị","Ỉ","Ĩ", "Ò","Ó","Ọ","Ỏ","Õ","Ô","Ồ","Ố","Ộ","Ổ","Ỗ",
                                        "Ơ" ,"Ờ","Ớ","Ợ","Ở","Ỡ", "Ù","Ú","Ụ","Ủ","Ũ","Ư","Ừ","Ứ","Ự",
                                        "Ử","Ữ", "Ỳ","Ý","Ỵ","Ỷ","Ỹ", "Đ"};
        string[] latin =  { "a","a","a","a","a","a","a","a","a","a","a" ,
                                "a","a","a","a","a","a", "e","e","e","e","e",
                                "e","e","e","e","e","e", "i","i","i","i","i", "o",
                                "o","o","o","o","o","o","o","o","o","o","o" ,"o","o","o","o","o",
                                "u","u","u","u","u","u","u","u","u","u","u", "y","y","y","y","y", "d",
                                "a","a","a","a","a","a","a","a","a","a","a","a" ,"a","a","a","a","a",
                                "e","e","e","e","e","e","e","e","e","e","e", "i","i","i","i","i", "o",
                                "o","o","o","o","o","o","o","o","o","o","o" ,"o","o","o","o","o", "u",
                                "u","u","u","u","u","u","u","u","u","u", "y","y","y","y","y", "d"};

        // Convert culture specific characters
        for (int i = 0; i < decomposed.Length; i++)
        {
            slug = slug.Replace(decomposed[i], latin[i]);
            slug = slug.Replace(precomposed[i], latin[i]);
        }

        // Remove special characters
        slug = Regex.Replace(slug, @"[^a-z0-9-/ ]", "").Replace("--", "-");

        // Remove whitespaces
        slug = Regex.Replace(slug.Replace("-", " "), @"\s+", " ").Replace(" ", "-");

        // Remove slash if non-hierarchical
        if (!hierarchical)
            slug = slug.Replace("/", "-");

        // Remove multiple dashes
        slug = Regex.Replace(slug, @"[-]+", "-");

        // Remove leading & trailing dashes
        if (slug.EndsWith("-"))
            slug = slug.Substring(0, slug.LastIndexOf("-"));
        if (slug.StartsWith("-"))
            slug = slug.Substring(Math.Min(slug.IndexOf("-") + 1, slug.Length));
        return slug;
    }


    public static string VNĐ(decimal value)
    {
        // Định dạng số tiền theo định dạng tiền tệ của Việt Nam
        string formattedValue = value.ToString("#,##0");

        return formattedValue;
    }

    public static string SaveImage(IFormFile file, string folderName, string newName)
{
    if (file != null && file.Length > 0)
    {
        var fileName = newName + Path.GetExtension(file.FileName); // Đổi tên tệp và giữ phần mở rộng
        var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", folderName, fileName);
        using (var stream = System.IO.File.Create(path))
        {
            file.CopyTo(stream);
        }
        return "/" + folderName + "/" + fileName; // Trả về đường dẫn mới của tệp
    }
    return "";
}


    public static int Discount(decimal priceNew, decimal priceOld)
    {

        if (priceNew < priceOld && priceOld > 0)
        {
            int discount = 0;
            discount = (int)Math.Round((priceOld - priceNew) / priceOld * 100);
            return discount;
        }
        return 0;
    }
}