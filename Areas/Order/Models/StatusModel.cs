using System.ComponentModel.DataAnnotations;

public class StatusModel{
    [Key]
    public int ID {set;get;}
    public int StatusID {get;set;}
    public string StatusName {set;get;}
    public string Description {set;get;}
}