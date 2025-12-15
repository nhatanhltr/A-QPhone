using Microsoft.AspNetCore.Identity;

public class RoleModel :IdentityRole{
    public string[]? Claims { get; set; }
}