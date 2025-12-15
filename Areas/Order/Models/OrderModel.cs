using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class OrderModel{
    [Key]
    public int ID {get;set;}
    public string GUID {get;set;}
    public string UserID { set; get; }
    [ForeignKey("UserID")]
    public AppUserModel User { set; get; }

    public string FullName {get;set;}
    public string Address {get;set;}
    public string PhoneNumber {get;set;}
    public string Email {get;set;}

    public string? StaffApprove {get;set;} // Nhân viên phê duyệt
   
    public int? StatusID {get;set;}
    [ForeignKey("StatusID")]
    public StatusModel? Status {get;set;} // trạng thái đơn hàng

    public string PaymentMethod {get;set;} // phương thức thanh toán
    public DateTime CreatedDate {get;set;}
    public DateTime ShipDate {get;set;}
    public string Notes {get;set;}


    public decimal TotalPrice {get;set;}
    public int TotalQuantity {get;set;}


    public List<OrderDetailsModel> orderDetail {get;set;}

}