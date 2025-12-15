using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
public class EditorController : ControllerBase
{
    [HttpPost("save-images")]
    public async Task<IActionResult> SaveImages([FromForm] List<IFormFile> files)
    {
        try
        {
            // Thư mục lưu trữ ảnh (hãy đảm bảo rằng thư mục tồn tại)
            string uploadPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");

            // List để lưu trữ đường dẫn của các ảnh
            List<string> imageUrls = new List<string>();

            foreach (var file in files)
            {
                // Tạo đường dẫn mới cho file
                string filePath = Path.Combine(uploadPath, file.FileName);

                // Lưu file vào thư mục upload
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Thêm đường dẫn của ảnh vào danh sách
                string imageUrl = Path.Combine("/uploads/", file.FileName);

                // Thêm đường dẫn vào danh sách phản hồi
                imageUrls.Add(imageUrl);
            }

            // Trả về phản hồi JSON với đường dẫn của các ảnh đã lưu
            return Ok(new { link = imageUrls });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

}
