using AutoMapper;
public class Mapper : Profile{
    public Mapper(){
        CreateMap<ImportVModel , ImportModel>().ReverseMap();
        CreateMap<SalesNameVModel , SalesName>().ReverseMap();
        CreateMap<ProductSalesVModel , ProductSales>().ReverseMap();
    }
}