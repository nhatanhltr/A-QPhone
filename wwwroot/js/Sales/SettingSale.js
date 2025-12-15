import { toast } from "../effects.js";
import { formatCurrency } from "../Ajax/Convert.js";
import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js"

var pageCurrent = 1;
var pageSize;

$('.listen').on('click', function(){
    console.log(this);
    var id = this.getAttribute('data-id');
    var ob = {
        id : id , 
        status : this.checked ? 1: 0
    }
    PostAPI('/admin/SalesName/UpdateStatusSaleName' , ob , function(data){
        if(data.code == 200){
            toast({title:'Thông báo' , message:'Cập nhật trạng thái thành công' , type:'success'})
        }
    } )

});


function RenderViewProduct(data){
    $('.sale-title').each(function () {
        var idTitle =  this.getAttribute('data-id');
        $(this).empty()
        $.each(data.data, (index,item)    => {
            if(+idTitle == item.salesID){
                var html = `
                <div class="swiper-slide">
                    <div class="tablet-item ">
                       <div  data-idn= ${idTitle} data-id=${item.productModel.productID}  class="product-discount"><i class="fa-solid fa-trash"></i></div>
                        <a class="id-pr" asp-controller="ProductsClient" asp-action="Details" asp-route-slug="2"
                            class="tablet-link">
                            <div class="d-flex justify-content-center"><img src="${item.productModel.image}" class="w-75">
                            </div>
                            <div>
                                <h3 class="product-heading tablet">${item.productModel.title}</h3>

                                <div class="product-price tablet align-items-baseline">
                                    <sapn class="price-new ">Giá: ${formatCurrency(item.productModel.price)} đ</sapn>
                                    <sapn class="price-old ${item.productModel.priceOld == 0 ?"d-none": ""} ">${formatCurrency(item.productModel.priceOld)}đ</sapn>
                                </div>
                            </div>
                            <div class="product-describe tablet d-flex flex-column">
                                <span class="decribe-text float-left">
                                    Mô tả thông tin sản phẩm
                                </span>
                                
                            </div>
                        </a>
                        <div class="product-heart tablet">
                            <span class="decribe-text">
                                <i class="ti-heart"></i>
                            </span>
                            <div class="product-animation">
                                <div class="product-add " style="width:120px">
                                        <b class="text-red" style="line-height: 2;"><i class="fa-regular fa-circle-xmark mr-1"></i>Hết hàng</b>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
                $(this).append(html)
            }
        });
    })

    $('.product-discount').on('click' , function(){

        var id = +$(this).attr('data-id')
        var idn = +$(this).attr('data-idn')

        PostAPI('/admin/SalesName/DeleteSalesProduct' , {id: id , idn: idn}, function(data){
            if(data.code == 200){
                toast({ title: "Thông báo", message: "Xóa thành công", type: "success" });
                GetAPI('/admin/SalesName/ListSalesProducts', (data) => {
                    RenderViewProduct(data)
                });
            }
        }, 2)
    })
}

GetAPI('/admin/SalesName/ListSalesProducts', (data) => {
    RenderViewProduct(data)
})


$('.create-info').on('click', function(){
    modelCategory2()
})

function modelCategory2(params = null) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
    <div class="c-transparent-bg preve-close w-100">
        <div class="c-form close-model d-flex justify-content-center align-items-center w-100">
            <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-25">
                <form id="Create" class="">
                    <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i class="fa-solid fa-xmark"></i></button>
                    <h4 class="text-center text-shadown my-3 ">Thêm thông tin</h4>
                    <div>
                        <div class="row">
                            <div class="col l-12">
                                <div class="border h-100">
                                    <div class="row">
                                        <div class="col l-12">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.name : ''}" id="name" name="name" rule="required"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Tên danh mục</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-around">
                        <div class="d-flex form-field justify-content-center">
                            <button type="button" class="btn-close px-3 box-shadow">Hủy</button>
                        </div>
                        <div class="d-flex form-field justify-content-center">
                            <button type="submit" class="button-ainmate form-submit button box-shadow px-3"><i class="fa-solid fa-plus mr-2"></i>Thêm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
    div.innerHTML = form;
    body.append(div);
    
    // var fileName
    // $('#fileInput').change(function () {
    //     fileName = $(this).val().split('\\').pop();
    //     $('.label-s').text(fileName || 'Tùy chỉnh');
    //     var selectedFile = this.files[0];
    //     if (selectedFile) {
    //         // Hiển thị hình ảnh preview
    //         var reader = new FileReader();
    //         reader.onload = function (e) {
    //             $('#previewImage').attr('src', e.target.result);
    //         };
    //         reader.readAsDataURL(selectedFile);
    //     } else {
    //         // Nếu không có tệp nào được chọn, đặt src của hình ảnh preview thành trống
    //         $('#previewImage').attr('src', 'images/icons8-supplier-100.png');
    //     }
    // });
    Validate('#Create', (dataInput) => {
        console.log(dataInput)

            PostAPI(' /admin/SalesName/CreateSalesName', dataInput, data => {
                console.log(data);
                if(data.code == 200){
                    toast({ title: 'Thông báo', message: 'Thêm thành công', type: 'success' })
                }
                div.remove()
            }, 0);
    })

    $(document).on('click', '.preve-close', () => {
        let element = $('.animate')
        element.addClass('animate-close');
        element.one('animationend', () => {
            element.removeClass('animate-close')
            div.remove();
        })
    });
    $(document).on('click', '.close-model', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.btn-close', function () {
        let element = $('.animate')
        element.addClass('animate-close');
        element.one('animationend', () => {
            element.removeClass('animate-close')
            div.remove();
        })
    })
}


function modelCategory(id) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
    <div class="c-transparent-bg preve-close w-100" style="z-index: 1;" >
        <div class="c-form close-model d-flex justify-content-center align-items-center w-100">
            <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-75">
                <form id="Create" class="">
                    <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i class="fa-solid fa-xmark"></i></button>
                    <h4 class="text-center animation-text ">Danh sách sản phẩm</h4>
                    <div>
                        <div class="row">
                            <div class="col l-12">
                                <div class="w-100 d-flex align-items-center justify-content-between my-2" >
                                   <div>
                                        <span class="mx-1">Xem</span> 
                                        <select id="multiple-quantity" class="" multiple="multiple">
                                            <option value=5>5</option>
                                            <option value=10 selected>10</option>
                                            <option value=25>25</option>
                                            <option value=50>50</option>
                                        </select> 
                                        <span class="mx-1">mục</span>
                                   </div>
                                   <div class="d-flex align-items-center px-3">
                                        <span class="mx-1">Tồn kho</span> <select id="inventory" class=""
                                            multiple="multiple">
                                            <option value=5 selected>0</option>
                                            <option value=10>10</option>
                                            <option value=25>15</option>
                                            <option value=50>20</option>
                                            <option value=50>25</option>
                                            <option value=50>30</option>
                                        </select>
                                    </div>
                                    <div class="d-flex align-items-center px-3">
                                        <button class="seling button">Bán chạy</button>
                                    </div>
                                    <div class="d-flex align-items-center px-3">
                                        <button class="seling button">Bán ít</button>
                                    </div>
                                   <div class="d-flex">
                                        <div class="form-group form-field d-flex">
                                            <input id="name" name="email"
                                                type="text" placeholder=" " class="value-search form-input form-error form-control ">
                                            <label for="name" class="form-label">Tìm kiếm</label>
                                            <span class="form-message"></span>
                                            </div>
                                            <button type="button" class="btn-search box-shadow active rounded "><i class="fa-solid fa-magnifying-glass mx-2"></i></button>
                                   </div>
                                </div>
                            </div>
                            <div class="col l-12">
                                <div class="border h-100" style="overflow-y: scroll;
                                min-height: 144px;
                                max-height: 300px;">
                                <table class="table  text-center bg-white ">
                                    <tr>
                                        <th>
                                            <div>
                                                <input type="checkbox" id="select-all" />
                                                <label for="select-all">Tất cả</label>
                                            </div>
                                        </th>
                                        <th >Hình ảnh</th>
                                        <th >Sản phẩm</th>
                                        <th >Giá</th>
                                        <th >Tồn kho</th>
                                    </tr>
                                    <tbody class="list">
                                    </tbody>
                                </table>
                                </div>
                                <div class="pageNumber d-flex justify-content-center"></div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="d-flex justify-content-around">
                        <div class="d-flex form-field justify-content-center">
                            <button type="button" class="btn-close px-3 box-shadow">Hủy</button>
                        </div>
                        <div class="d-flex form-field justify-content-center">
                            <button type="button" data-id=${id} class="button-ainmate form-submit button box-shadow px-3"><i class="fa-solid fa-plus mr-2"></i>Thêm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
    div.innerHTML = form;
    body.append(div);
    GetAPI('/admin/products/indexJson', listProducts)
    var SizePage = $('#multiple-quantity').multipleSelect({
        animate: 'slide',
        single: true,
        onClick: function () {
            pageSize = +SizePage.multipleSelect('getSelects')
            GetAPI('/admin/products/indexJson', listProducts, {search: $('.value-search').val(), CurrentPage: pageCurrent, SizePage:pageSize  })
        }
    })
        
    var inventory = $('#inventory').multipleSelect({
        animate: 'slide',
        single: true,
    })
    $('.btn-search').on('click', function(){
        GetAPI('/admin/products/indexJson', listProducts, {search: $('.value-search').val(), CurrentPage: pageCurrent, SizePage:pageSize  })
    })

    $(document).on('click', '.preve-close', () => {
        let element = $('.animate')
        element.addClass('animate-close');
        element.one('animationend', () => {
            element.removeClass('animate-close')
            div.remove();
        })
    });
    $(document).on('click', '.close-model', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.btn-close', function () {
        let element = $('.animate')
        element.addClass('animate-close');
        element.one('animationend', () => {
            element.removeClass('animate-close')
            div.remove();
        })
    })

    $('#select-all').on('change', function () {
        // Cập nhật trạng thái của tất cả checkbox sản phẩm dựa trên checkbox "Chọn tất cả"
        $('.product-checkbox').prop('checked', $(this).prop('checked'));
        console.log('check all')
    });

    $('.product-checkbox').on('change', function () {
        // Cập nhật trạng thái của checkbox "Chọn tất cả" dựa trên tất cả checkbox sản phẩm
        $('#select-all').prop('checked', $('.product-checkbox:checked').length === $('.product-checkbox').length);
    })
}
function listProducts(data) {
    $(".list").empty();
    $.each(data.data.listProducts, (index, item) => {
        var html = `
        <tr>
            <td><input type="checkbox" class="product-checkbox box-shadow " data-id="${item.productID}" /></td>
            <td><img src="${item.image}" height=50 width=50 alt="" class="stringUrl"></td>
            <td class="note-item w-50 "><a class="stringTitle" href="/admin/products/details/${item.productID}"> ${item.title}</a></td>
            <td class="text-danger stringPrice">${formatCurrency(item.price)}</td>
            <td class= "stringInventory" style="${item.inventory ==0 ? "background-color: #f6c9c9" : ""} ">${item.inventory}</td>
            
        </tr>
        `
        $(".list").append(html)
    })
    Paging(data, page => {
        GetAPI('/admin/products/indexJson', listProducts, {search: $('.value-search').val(), CurrentPage: page, SizePage: pageSize })
    })
}
let Paging = (data, callback) => {
    $('.pageNumber').empty();
    if (data.data.countPage > 1) {
        for (let i = 1; i <= data.data.countPage; ++i) {
            let btn = `
            <li class="page-item ">
                <button type="button" class="px-3 py-1 mx-1 rounded box-shadow ${i === data.data.currentPage ? 'active' : ''}">${i}</button>
            </li>
            `;
            $('.pageNumber').append(btn);
        }
        // Xử lý sự kiện khi nút số trang được click
        $('.page-item').on('click', function () {
            $('.page-item').removeClass('active');
            pageCurrent = +$(this).text();
            $(this).addClass('active');
            callback(pageCurrent);
        });
    }
};
$('.btn-add-sale').on('click', function(){
    console.log(this.getAttribute('data-id'))
    var id = this.getAttribute('data-id')
    modelCategory(id);

})



$(document).on('click', '.form-submit', function () {
    var arr =[]
    var idn = this.getAttribute('data-id')
    $('.product-checkbox:checked').each(function () {
        var parent = this.parentNode.parentNode
        var id = parent.querySelector('.product-checkbox').getAttribute('data-id')
        var ob = {
            productID: id,
            SalesID: idn
        }
        arr.push(ob)
    });
    PostAPI('/admin/SalesName/CreateSalesProduct' , {arr: arr}, function(data){
        if(data.code == 200){
            let element = $('.animate')
            element.addClass('animate-close');
            element.one('animationend', () => {
                element.removeClass('animate-close')
                $(".details").remove();
            })
            toast({ title: "Thông báo", message: "Thêm thành công", type: "success" });
            GetAPI('/admin/SalesName/ListSalesProducts', (data) => {
                RenderViewProduct(data)
            })
        }

    }, 0 )

        
})


