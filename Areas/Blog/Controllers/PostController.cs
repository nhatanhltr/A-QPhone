using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

[Area("Blog")]
[Route("/admin/blog/post/[action]/{id?}")]
[Authorize(Roles = "Admin, Administrator")]
public class PostController : Controller
{
    private readonly CellPhoneDB _context;
    private readonly UserManager<AppUserModel> _userManager;

    public PostController(CellPhoneDB context, UserManager<AppUserModel> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet]
    public IActionResult Index()
    {
        return View();
    }

    [HttpGet]
    public async Task<IActionResult> PostJson(int CurrentPage = 1, int SizePage = 10)
    {
        var model = new ListPostModel();
        model.CurrentPage = CurrentPage;
        model.SizePage = SizePage;
        var posts = _context.posts
                            .Include(p => p.Author)
                            .OrderByDescending(p => p.DateUpdated);

        int total = await posts.CountAsync();
        if (total > 0)
        {
            model.Total = total;
            model.CountPage = (int)Math.Ceiling((double)model.Total / model.SizePage);

            if (model.CurrentPage < 1)
                model.CurrentPage = 1;
            if (model.CurrentPage > model.CountPage)
                model.CurrentPage = model.CountPage;

            model.listPost = await posts.Skip((model.CurrentPage - 1) * model.SizePage)
                     .Take(model.SizePage)
                     .Include(p => p.PostCategories)
                     .ThenInclude(pc => pc.Category)
                     .Select(p => new PostModel()
                     {
                         PostID = p.PostID,
                         Title = p.Title,
                         AbstractTitle = p.AbstractTitle,
                         Image = p.Image,
                         Slug = p.Slug,
                         Content = p.Content,
                         AuthorId = p.Author.FullName,
                         DateCreated = p.DateCreated,
                         DateUpdated = p.DateUpdated,
                         Status = p.Status,
                         ViewCount = p.ViewCount,
                         PostCategories = p.PostCategories
                     })
                     .ToListAsync();

            model.Total = total;
            model.CurrentPage = CurrentPage;
            return Json(new { code = 200, data = model, message = "success" });
        }
        return Json(new { code = 200, data = " Chưa có bài viết nào", message = "success" });
    }

    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([FromForm] CreatePostModel post)
    {
        var user = await _userManager.GetUserAsync(HttpContext.User);
        if (post.Slug == null)
        {
            post.Slug = Functions.GenerateSlug(post.Title);
        }

        if (user == null)
        {
            return NotFound();
        }
        var postNew = new PostModel();
        postNew.AbstractTitle = post.AbstractTitle;
        postNew.Title = post.Title;
        postNew.AuthorId = user.Id;
        postNew.Slug = post.Slug;
        postNew.Content = post.Content;
        postNew.ViewCount = 0;
        postNew.Status = post.Status;
        postNew.DateCreated = postNew.DateUpdated = DateTime.Now;

        if (post.Image != null && post.Image.Length > 0)
        {
            var path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images/post", post.Image.FileName);
            using (var stream = System.IO.File.Create(path))
            {
                await post.Image.CopyToAsync(stream);
            }
            postNew.Image = "/images/post/" + post.Image.FileName;

        }
        else
        {
            postNew.Image = null;
        }
        
        _context.posts.Add(postNew);

        if (post.CategoryIDs != null)
        {

            foreach (var cateId in post.CategoryIDs)
            {
                _context.postCategories.Add(new PostCategoryModel()
                {
                    CategoryID = cateId,
                    Post = postNew
                });
            }
        }

        await _context.SaveChangesAsync();
        return Json(new { code = 200, data = "success", message = "success" });
    }

    // '/admin/blog/post/DetailsJson/67'
    [HttpGet]
    public async Task<IActionResult> DetailsJson(int id)
    {
        if (id == null) return NotFound();
        var post = await _context.posts.Include(p => p.PostCategories).FirstOrDefaultAsync(p => p.PostID == id);
        var postEdit = new EditPostModel()
        {
            PostID = post.PostID,
            Title = post.Title,
            AbstractTitle = post.AbstractTitle,
            Image = post.Image,
            Status = post.Status,
            Content = post.Content,
            CategoryIDs = post.PostCategories.Select(p => p.CategoryID).ToArray()
        };
        return Json(new { code = 200, data = postEdit, message = "success" });
    }


    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int id, [FromForm] CreatePostModel post)
    {
        if (post.Slug == null)
        {
            post.Slug = Functions.GenerateSlug(post.Title);
        }

        var postUpdate = await _context.posts.Include(p => p.PostCategories).FirstOrDefaultAsync(p => p.PostID == id);
        if (postUpdate == null)
        {
            return NotFound();
        }

        postUpdate.AbstractTitle = post.AbstractTitle;
        postUpdate.Title = post.Title;
        postUpdate.Slug = post.Slug;
        postUpdate.Content = post.Content;
        postUpdate.Status = post.Status;
        postUpdate.DateUpdated = DateTime.Now;

        if (post.Image != null)
        {
            if (!string.IsNullOrEmpty(postUpdate.Image))
            {
                var existingImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images/post", postUpdate.Image);

                if (System.IO.File.Exists(existingImagePath))
                {
                    System.IO.File.Delete(existingImagePath);
                }
            }

            if (post.Image != null && post.Image.Length > 0)
            {
                var ImagePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images/post", post.Image.FileName);

                using (var stream = System.IO.File.Create(ImagePath))
                {
                    await post.Image.CopyToAsync(stream);
                }

                postUpdate.Image = "/images/post/" + post.Image.FileName;
            }
            else
            {
                // No new image provided, set to null or handle it based on your requirement
                postUpdate.Image = null;
            }
        }

        if (post.CategoryIDs == null) post.CategoryIDs = new int[] { };

        var oldCateIds = postUpdate.PostCategories.Select(c => c.CategoryID).ToArray();
        var newCateIds = post.CategoryIDs;

        var removeCatePosts = from postCate in postUpdate.PostCategories
                              where (!newCateIds.Contains(postCate.CategoryID))
                              select postCate;
        _context.postCategories.RemoveRange(removeCatePosts);

        var addCateIds = from CateId in newCateIds
                         where !oldCateIds.Contains(CateId)
                         select CateId;

        foreach (var CateId in addCateIds)
        {
            _context.postCategories.Add(new PostCategoryModel()
            {
                PostID = id,
                CategoryID = CateId
            });
        }

        _context.Update(postUpdate);

        await _context.SaveChangesAsync();
        return Json(new { code = 200, data = "success", message = "success" });
    }


    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var post = await _context.posts.FindAsync(id);
        if (post != null)
        {
            _context.posts.Remove(post);
            await _context.SaveChangesAsync();
            return Json(new { code = 200, data = "success", message = "Success" });
        }
        return Json(new { code = 500, data = "error", message = "Error" });
    }
}