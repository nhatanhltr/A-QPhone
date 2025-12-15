
using Google.Protobuf.WellKnownTypes;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using System;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions();
var maisetting = builder.Configuration.GetSection("MailSettings");
builder.Services.Configure<MailSettings>(maisetting);
builder.Services.AddSingleton<IEmailSender, SendMailService>();
builder.Services.AddTransient<CartService>();

// Add services to the container.
builder.Services.AddDbContext<CellPhoneDB>(options =>
{
    string connect = builder.Configuration.GetConnectionString("connection");
    options.UseMySQL(connect);
});

// services identity 

builder.Services.AddIdentity<AppUserModel, IdentityRole>()
    .AddEntityFrameworkStores<CellPhoneDB>()
    .AddDefaultTokenProviders();


builder.Services.Configure<IdentityOptions>(options =>
{
    // Password settings.
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequiredLength = 6;
    options.Password.RequiredUniqueChars = 1;

    // Lockout settings.
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(3);
    options.Lockout.MaxFailedAccessAttempts = 10;
    options.Lockout.AllowedForNewUsers = true;

    // User settings.
    options.User.AllowedUserNameCharacters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
    options.User.RequireUniqueEmail = false;

    // Cấu hình đăng nhập.
    options.SignIn.RequireConfirmedEmail = true;            // Cấu hình xác thực địa chỉ email (email phải tồn tại)
    options.SignIn.RequireConfirmedPhoneNumber = false;     // Xác thực số điện thoại
    options.SignIn.RequireConfirmedAccount = true;
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/Account/Login";
    options.LogoutPath = "/Account/Logout";
    options.AccessDeniedPath = "/khongduoctruycap.html";
});

builder.Services.AddDistributedMemoryCache();           // Đăng ký dịch vụ lưu cache trong bộ nhớ (Session sẽ sử dụng nó)
builder.Services.AddSession(cfg => {                    // Đăng ký dịch vụ Session
    cfg.Cookie.Name = "A&Q";             // Đặt tên Session - tên này sử dụng ở Browser (Cookie)
    cfg.IdleTimeout = new TimeSpan(0,30, 0);    // Thời gian tồn tại của Session
});



// builder.Services.ConfigureApplicationCookie(options =>
// {
//     options.LoginPath = "/admin/Login";
//     options.LogoutPath = "/admin/Logout";
//     options.AccessDeniedPath = "/khongduoctruycap.html";
// });
builder.Services.AddAuthorization(options=>{
    options.AddPolicy("ViewManage" , builder =>{
        builder.RequireAuthenticatedUser();
        builder.RequireRole("CanView");
    });
});

builder.Services.AddAutoMapper(typeof(Program).Assembly);

builder.Services.AddHttpContextAccessor();
// DI 

builder.Services.AddScoped<Iimport , ImportRepos> ();
builder.Services.AddScoped<ISalesName , SalesNameRepos> ();
builder.Services.AddScoped<IDashBoard , DashBoardRepos> ();

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();



// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // app.UseExceptionHandler("Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseStaticFiles(new StaticFileOptions() {
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "Uploads")
                ),
                RequestPath = "/contents"
            });
app.UseSession();
app.UseRouting();
app.MapControllers();
app.UseAuthentication(); // xac dinh danh tinh 

app.UseAuthorization();  // xac thuc  quyen truy  cap



// app.MapAreaControllerRoute(
//     name: "default",
//     pattern: "/{controller=LogIn}/{action=Index}/{id?}",
//     areaName: "LogIn"
// );

app.MapControllerRoute(
    name: "default",
    pattern: "/{controller=Home}/{action=Index}/{id?}");

app.MapRazorPages();

app.Run();
