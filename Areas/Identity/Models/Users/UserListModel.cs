public class UserListModel : PaginationModel
{
    public List<UserAndRole>? users { get; set; }
}

public class UserAndRole : AppUserModel
{
    public string? RoleNames { get; set; }
}
