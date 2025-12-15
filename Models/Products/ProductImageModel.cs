using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

[Table("ProductImages")]
    public class ProductImageModel
    {
        [Key]
        public int Id { get; set; }
        public string? FileName { get; set; }
        public int posImage { get; set; }
        public int ProductID { get; set; }
        [ForeignKey("ProductID")]
        public ProductModel Product { get; set; }

    }