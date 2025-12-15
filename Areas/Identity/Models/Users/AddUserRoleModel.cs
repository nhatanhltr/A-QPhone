using System.ComponentModel;
using Microsoft.AspNetCore.Identity;

public class AddUserRoleModel
{
    public AppUserModel? user { get; set; }

    [DisplayName("Các role gán cho user")]
    public string[]? RoleNames { get; set; }

    public List<IdentityRoleClaim<string>>? claimsInRole { get; set; }
    public List<IdentityUserClaim<string>>? claimsInUserClaim { get; set; }

}