
using Microsoft.AspNetCore.Mvc;
[ViewComponent(Name = "CategorySidebar")]
public class CategorySidebarComponent : ViewComponent {

        public class CategorySidebarData 
        {
            public List<CategoryModel> Categories { get; set; }
            public int level { get; set; }
            public string categoryslug { get; set;}
        }

        public IViewComponentResult Invoke(CategorySidebarData data)
        {
            return View(data);
        }

    }