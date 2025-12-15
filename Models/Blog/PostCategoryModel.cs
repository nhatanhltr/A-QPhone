using System.ComponentModel.DataAnnotations.Schema;

[Table("PostCategory")]
public class PostCategoryModel
{
    public int PostID { set; get; }

    public int CategoryID { set; get; }

    [ForeignKey("PostID")]
    public PostModel Post { set; get; }

    [ForeignKey("CategoryID")]
    public CategoryModel Category { set; get; }

}