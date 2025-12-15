using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

public class CellPhoneDB : IdentityDbContext<AppUserModel>
{
    public CellPhoneDB(DbContextOptions<CellPhoneDB> options) : base(options){}
    protected override void OnConfiguring(DbContextOptionsBuilder dbContextOptionsBuilder)
    {
        base.OnConfiguring(dbContextOptionsBuilder);
    }
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        foreach (var entityType in builder.Model.GetEntityTypes())
        {
            var tableName = entityType.GetTableName();
            if (tableName != null && tableName.StartsWith("AspNet"))
            {
                entityType.SetTableName(tableName.Substring(6));
            }
        }

        builder.Entity<CategoryModel>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });

        builder.Entity<PostModel>(entity =>
        {
            entity.HasIndex(c => c.Slug).IsUnique();
        });
        
        builder.Entity<PostCategoryModel>(entity =>
        {
            entity.HasKey(c => new { c.PostID, c.CategoryID });
        });
        
        builder.Entity<OrderDetailsModel>(entity =>{
            entity.HasKey(r => new{r.ProductID , r.OrderID});
        });
        builder.Entity<ImportDetailModel>(entity =>{
            entity.HasKey(r => new{r.ProductID , r.ImportID});
        });


        builder.Entity<CategoryProductModel>(entity =>
        {
            entity.HasIndex(c => c.Slugc)
                  .IsUnique();
        });

        builder.Entity<ProductCategoryProductModel>(entity =>
        {
            entity.HasKey(c => new { c.ProductID, c.CategoryID });
        });

        builder.Entity<ProductModel>(entity =>
        {
            entity.HasIndex(p => p.Slugp)
                  .IsUnique();
        });
        builder.Entity<ProductSales>(entity=>{
            entity.HasKey(r => new{r.SalesID, r.ProductID});
        });
    }
    public DbSet<ContactModel> contacts { get; set; }
    public DbSet<CategoryModel> categories { get; set; }
    public DbSet<PostModel> posts { get; set; }
    public DbSet<PostCategoryModel> postCategories { get; set; }


    public DbSet<CategoryProductModel> categoryProducts { get; set; }
    public DbSet<ProductModel> products { get; set; }

    public DbSet<ProductCategoryProductModel> productCategoryProducts { get; set; }

    public DbSet<ProductImageModel> productImage { get; set; }
    public DbSet<ProductDetailModel> productDetail { get; set; }
    public DbSet<MenuAdminModel> menuAdmin {get;set;}

    public DbSet<StatusModel> statuses {get;set;}
    public DbSet<OrderModel> orders {get;set;}
    public DbSet<OrderDetailsModel> orderDetails {get;set;}


    public DbSet<SupplierModel> suppliers {get;set;}
    public DbSet<ImportModel> imports{get;set;}
    public DbSet<ImportDetailModel> importDetails{get;set;}


    public DbSet<SalesName> salesName {get;set;}
    public DbSet<ProductSales> productSales {get;set;}
    public DbSet<Advertisement> advertisement {get;set;}
}