using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

public class MenuAdminModel
{
    [Key]
    public int ID { get; set; }
    public string Name { get; set; }
    public string? Areas { get; set; }
    public string? ControllerName { get; set; }
    public string? ActionName { get; set; }
    public string Link { get; set; }
    public int? MenuOrder { get; set; }
    public int? Position { get; set; }
    public int IsActive { get; set; }
    public ICollection<MenuAdminModel> MenuChildren { get; set; }

    // Category cha (FKey)
    [Display(Name = "Menu cha")]
    public int? ParentMenuId { get; set; }

    [ForeignKey("ParentMenuId")]
    [Display(Name = "Menu cha")]
    [JsonIgnore]
    public MenuAdminModel ParentsMenu { set; get; }
    
    public void ChildMenuIDs(ICollection<MenuAdminModel>?  childcates, List<int> lists)
      {
          if (childcates == null)
            childcates = this.MenuChildren;
          foreach (MenuAdminModel menu in childcates)
          {
              lists.Add(menu.ID);
              ChildMenuIDs(menu.MenuChildren, lists);
          }
      }

      public List<MenuAdminModel> ListParents()
      {
          List<MenuAdminModel> li = new List<MenuAdminModel>();
          var parent = this.ParentsMenu;
          while (parent != null)
          {
              li.Add(parent);
              parent = parent.ParentsMenu;

          }
          li.Reverse();
          return li;
      }
}