import { GetAPI, PostAPIFormBody } from "../Axios/Axios.js";
import { Validate } from "../validateform.js";
import { formatCurrency } from "../Ajax/Convert.js";
import { toast, generateUUID } from "../effects.js";



GetAPI('/admin/import/supplier/indexJson', data => {
    var options = data.data.map(function (item) {
        return {
            value: item.guid,
            text: item.name
        };
    });
    var supplierMul = $('#supplier').multipleSelect({
        data: options,
        animate: 'slide',
        single: true,
        filter: true,
        placeholder: "Yêu cầu chọn danh mục sản phẩm (*)",
        onClick: function () {
            GetAPI('/admin/import/supplier/DetailsAPI', data => {
                $('.supplierImport').empty()

                let html = `
                        <div class="col col-12">
                            <div class=" w-100 d-flex justify-content-center  p-2 h-100">
                                <div class="d-flex text-center align-items-center"
                                    style="flex-direction: column;">
                                    <img id="previewImage" height=100% width=150
                                        src="${data.data.image}" class=" px-2" />
                                </div>
                            </div>
                        </div>
                        <div class="col col-12 ">
                            <div class="my-1">
                                <span class="font-weight-bold">Tên: </span><span class="supplier-name">${data.data.name}</span>
                            </div>
                            <div class="my-1">
                                <span class="font-weight-bold">Số điện thoại:</span> <span class="supplier-phone">${data.data.phone}</span> 
                            </div>
                            <div class="my-1">
                                <span class="font-weight-bold">Địa chỉ:</span> <span class ="supplier-address">${data.data.address}</span> 
                            </div>
                            <div class="my-1">
                                <span class="font-weight-bold">Email:</span><span class = "supplier-email">${data.data.email}</span>
                            </div>
                        </div>
                    `
                $('.supplierImport').append(html)
            }, { GUID: '' + supplierMul.multipleSelect('getSelects') })
        }
    })
})

var pageCurrent = 1;
var pageSize;
Validate('#Create', (dataInput) => {
    dataInput.CategoryIDs = [(+$('#multiple').multipleSelect('getSelects') === 0 ? null : +$('#multiple').multipleSelect('getSelects'))]
    var isChecked = $('#check').is(':checked');
    dataInput.Status = isChecked === true ? 1 : 0
    dataInput.Image = $('#fileInput')[0].files[0]
    // PostAPI('/admin/products/CreateJson', dataInput, (data) => {
    //     console.log(data)
    // }, 0)
})

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

function modelCategory(params = null) {
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
                                        <span class="mx-1">Tồn kho dưới</span> <select id="inventory" class=""
                                            multiple="multiple">
                                            <option value=5 selected>0</option>
                                            <option value=10>10</option>
                                            <option value=25>15</option>
                                            <option value=50>20</option>
                                            <option value=50>25</option>
                                            <option value=50>30</option>
                                        </select> <span class="mx-1">sản phẩm</span>
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
                            <button type="button" class="button-ainmate form-submit button box-shadow px-3"><i class="fa-solid fa-plus mr-2"></i>Thêm</button>
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

$(document).on('click', '.create', function () {
    modelCategory();
})


var listCheck = []
var flag = true;
$(document).on('click', '.form-submit', function () {
    $('.product-checkbox:checked').each(function () {
        var parent = this.parentNode.parentNode
        var id = parent.querySelector('.product-checkbox').getAttribute('data-id')
        var stringImg = parent.querySelector('.stringUrl').getAttribute('src')
        var stringPrice = parent.querySelector('.stringPrice').innerText.replace("₫", "")
        var Inventory = parent.querySelector('.stringInventory').innerText
        var title = parent.querySelector('.stringTitle').innerText
        var ob = {
            productID: id,
            title: title,
            image: stringImg,
            inventory: Inventory,
            price: stringPrice,
        }
        if (listCheck.some(function (element) { return element.productID === id })) {
            toast({ title: "Sản phẩm đã tồn tại", message: title, type: "error" });
            flag = false;
        } else {
            listCheck.push(ob)
            flag = true;
        }
    });

    if (flag == true) {
        renderListPrImport2(listCheck)
        let element = $('.animate')
        element.addClass('animate-close');
        element.one('animationend', () => {
            element.removeClass('animate-close')
            $(".details").remove();
        })
        toast({ title: "Thông báo", message: "Thêm thành công", type: "success" });
        handlePrice();
        handleCloseTab();
    }
})


$(document).on('click', '.clean', function () {
    listCheck = []
    renderListPrImport2(listCheck)
    handleCloseTab();
})

// GetAPI("/admin/checkListPr", renderListPrImport)
function renderListPrImport2(data) {
    $(".listprImport").empty();
    $.each(data, (index, item) => {
        var html = `
        <tr class="item-parents">
            <td><a class="id-pr d-flex align-items-center"><img height="70" src="${item.image}" alt=""><span class="get-title">${item.title}</span></a></td>
            <td class="w-25"><input class="text-center border-0 pnewPrice  p-1 quantity-input"
                    placeholder="${item.price}" data-flag="false" data-id="${item.price}" />
            </td>
            <td class="w-25"> <button type="button" class="quantity-control p-1 border-0 "
                    data-action="decrease">
                    <i class="fa-solid fa-minus"></i>
                </button>
                <input type="number" id="quantity-input" class="p-quantity text-center border w-25 p-1 "
                    value="1" max="100" min="1" id="" />
                <button type="button" class="quantity-control p-1 border-0 "
                    data-action="increase" )">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </td>
            <td class="delete d-none"> <button type="button" data-id=${item.productID} class="btn-delete get-id p-1 text-white box-shadow btn-danger "><i
                        class="fa-solid fa-trash"></i></button></td>
        </tr>
        `
        $(".listprImport").append(html)
    })

    $(document).on('mouseenter', '.item-parents', function () {
        this.querySelector('.delete').classList.remove('d-none')
    })
    $(document).on('mouseleave', '.item-parents', function () {
        // var i = this.querySelector(".item-category")
        // i.classList.remove("actives")
        this.querySelector('.delete').classList.add('d-none')
    })
    $('.quantity-control').on('click', function () {
        var action = $(this).data('action');
        // console.log()
        var targetInput = this.parentNode.querySelector('#quantity-input')
        var currentValue = parseInt(targetInput.value);

        if (action === 'increase') {
            targetInput.value = currentValue + 1;
        } else if (action === 'decrease' && currentValue > 1) {
            targetInput.value = currentValue - 1
        }
    });

}
//check all
$(document).on('click', '.btn-delete ', function () {
    listCheck = listCheck.filter(item => item.productID !== this.dataset.id);
    toast({ title: "Thông báo", message: "Xóa thành công", type: "warning" })
    renderListPrImport2(listCheck)
    handlePrice();
    handleCloseTab();
})

function handleCloseTab() {
    window.addEventListener('beforeunload', function (event) {
        // Kiểm tra nếu mảng listCheck không rỗng
        if (listCheck && listCheck.length > 0) {
            // Tạo thông điệp xác nhận
            var confirmationMessage = 'Bạn có muốn rời khỏi trang?';
            // Gán thông điệp xác nhận vào thuộc tính returnValue của đối tượng sự kiện
            event.returnValue = confirmationMessage;
            // Trả về thông điệp xác nhận
            return confirmationMessage;
        }
    });
}

function handlePrice() {
    $('.pnewPrice').each(function () {

        $(this).on('input', function () {

            var value = $(this).val();
            var currPrice = Number(this.getAttribute('data-id').replace(/\./g, ''), 18)
            var inputPrice = Number(value.replace(/\,/g, ''), 18)
            if (inputPrice > currPrice) {
                this.dataset.flag = false
                this.classList.remove('border-0')
                this.style.borderColor = 'red';
            } else {
                this.dataset.flag = true
                this.classList.add('border-0')

                // this.classList.addClass('border-0');
            }
            // Xóa tất cả các ký tự không phải số
            value = value.replace(/\D/g, '');
            // Nếu giá trị nhập vào rỗng, không làm gì cả
            if (value === "") return;
            // Giới hạn số chữ số nhập vào
            if (value.length > 20) {
                value = value.substr(0, 20);
            }
            // Định dạng lại giá trị thành tiền tệ Việt Nam
            var formattedValue = numberWithCommas(value);
            // Hiển thị giá trị đã được định dạng
            $(this).val(formattedValue);
        });
    });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

$('.check_bill_import').on('click', function () {
    HandleTotalPriceBill()
})

function HandleTotalPriceBill() {
    var totalPrice = 0;
    var totalQuantity = 0;
    var totalTax = 0;
    var totalPay = 0;

    $('.item-parents').each(function () {
        if (this.querySelector('.pnewPrice').getAttribute('data-flag') == 'true') {
            var Price = Number(this.querySelector('.pnewPrice').value.replace(/\,/g, ''), 18)
            var Quantity = this.querySelector('.p-quantity').value

            // tổng giá
            totalPrice += +Quantity * Price
            // tổng số lượng
            totalQuantity += +Quantity
            // tổng thuê
            totalTax = totalPrice * 10 / 100
        } else {
            toast({ title: "Thông báo lỗi", message: "Giá nhập không được nhỏ hơn giá bán !", type: "error" });
            return false
        }
    })

    totalPay = totalPrice + totalTax
    $('.show-totalQuantity').text(totalQuantity)
    $('.show-totalTax').text(formatCurrency(totalTax))
    $('.show-totalPrice').text(formatCurrency(totalPrice))
    $('.show-totalPay').text(formatCurrency(totalPay))
}

$('.print_bill_import').on('click', function () {
    var checkSupplier = document.querySelector('.supplier-email')
    if (HandleTotalPriceBill() != false) {
        if (checkSupplier != null) {
            var supplierEmail = checkSupplier.textContent
            var supplierAddress = document.querySelector('.supplier-address').textContent
            var supplierPhone = document.querySelector('.supplier-phone').textContent
            var supplierName = document.querySelector('.supplier-name').textContent
            var listImport = []
            var totalPrice = 0;
            var totalQuantity = 0;
            var totalTax = 0;
            var totalPay = 0;
            var dataImport = {}
            $('.item-parents').each(function () {
                // $('.item-parents').each(function () {
                var Price = this.querySelector('.pnewPrice').value
                var Quantity = this.querySelector('.p-quantity').value
                var Title = this.querySelector('.get-title').textContent
                var Id = this.querySelector('.get-id').getAttribute('data-id')

                // tổng giá
                totalPrice += +this.querySelector('.p-quantity').value * Number(this.querySelector('.pnewPrice').value.replace(/\,/g, ''), 18)
                // tổng số lượng
                totalQuantity += +this.querySelector('.p-quantity').value
                // tổng thuê
                totalTax = totalPrice * 10 / 100

                var item = {
                    Id: +Id,
                    Title: Title,
                    Price:Number(Price.replace(/\,/g, ''), 18) ,
                    Quantity: +Quantity,
                }
                listImport.push(item)
                // })
            })

            totalPay = totalPrice + totalTax
            dataImport = {
                supplierName: supplierName,
                supplierPhone: supplierPhone,
                supplierEmail: supplierEmail,
                supplierAddress: supplierAddress,
                created: new Date(),
                uuid: generateUUID(),
                totalQuantity: totalQuantity,
                totalPrice: totalPrice,
                totalTax: totalTax,
                totalPay: totalPay,
                listImport: listImport
            }
            modelPrintBill(dataImport)
        } else {
            toast({ title: "Thông báo lỗi", message: "Vui lòng chọn nhà cung cấp !", type: "error" });
        }
    }
})

function modelPrintBill(dataImport) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
<div class="c-transparent-bg preve-close w-100" style="z-index: 1;">
    <div class="c-form close-model d-flex justify-content-center align-items-center w-100">
        <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-75">
            <form id="Create" class="">
                <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i
                        class="fa-solid fa-xmark"></i></button>
                <div id="box-bill"  class = "printLable">
                <div class="border">
                <h4 class="text-center mt-2">HÓA ĐƠN NHẬP HÀNG</h4>
                <div class="row">
                    <div class="col l-3 d-flex">
                        <div class="d-flex justify-content-center align-items-center">
                            <img width="35%" src="/images/nks-high-resolution-logo-transparent.png" alt="">
                        </div>
                    </div>
                    <div class="col l-9 m-9 ">
                        <div class="p-1"><b>Mã hóa đơn:</b><span class="id_bill"> ${dataImport.uuid}</span></div>
                        <div class="p-1"><b>Tên công ty:</b> Công ty A&Q</div>
                        <div class="p-1"><b>Địa chỉ:</b> Trường Đại Học Vinh</div>
                        <div class="p-1"><b>Ngày tạo:</b>${dataImport.created}</div>
                    </div>
                    
                </div>
                <hr>
                <h4 class="text-center ">Thông tin khách hàng</h4>
                <div class="row">
                    <div class="col l-12 m-12">
                    <div class="p-1"><b>Tên nhà cung cấp:</b><span class="">${dataImport.supplierName}</span></div>
                    <div class="p-1"><b>Số điện thoại:</b> <span>${dataImport.supplierPhone}</span></div>
                    <div class="p-1"><b>Email:</b> <span>${dataImport.supplierEmail}</span></div>
                    <div class="p-1"><b>Địa chỉ:</b> ${dataImport.supplierAddress}</div>
                    </div>
                </div>
                <hr>
                <div class=" row">
                    <div class="col l-12 m-12">
                        <h4 class="text-center">Thông tin sản phẩm</h4>
                        <hr>
                        <div>
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th scope="col">STT</th>
                                        <th scope="col">Tên sản phẩm</th>
                                        <th scope="col">Giá nhập</th>
                                        <th scope="col">Số lượng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${dataImport.listImport.map((item, index) => {
        return `
                                            <tr>
                                                <th scope="row">${index + 1}</th>
                                                <td>${item.Title}</td>
                                                <td>${formatCurrency(item.Price)}</td>
                                                <td>${item.Quantity}</td>
                                            </tr>
                                            `
    }).join('')
        }
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="col l-12 m-12" >
                        <div class="border">
                            <div class="p-1">Tổng số lượng: <span class="text-red">${dataImport.totalQuantity}</span></div>

                            <div class="p-1">Tổng tạm tính: <span class="text-red">${formatCurrency(dataImport.totalPrice)}</span></div>

                            <div class="p-1">Tổng thuế: <span class="text-red">${formatCurrency(dataImport.totalTax)}</span></div>
                            <div class="p-1 font-weight-bold border">Tổng thành tiền: <span
                                    class="text-red">${formatCurrency(dataImport.totalPay)}</span></div>
                        </div>
                    </div>
                    <div class="col l-12 m-12">
                        <div class = "row">
                            <div class="col l-6 m-6 c-6" >
                                <div class="mb-5 text-center" style="height:120px">
                                    <h5 >Chữ ký phía công ty</h5>
                                </div>
                            </div>
                            <div class="col l-6 m-6 c-6">
                                <div class="mb-5 text-center" style="height:120px">
                                    <h5>Chữ ký phía khách hàng</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                </div>
                <div class="d-flex justify-content-around">
                    <div class="d-flex form-field justify-content-center">
                        <button type="button" class="btn-close px-3 box-shadow"><i
                                class="fa-solid fa-xmark mr-1"></i>Hủy</button>
                    </div>
                    <div class="d-flex form-field justify-content-center">
                        <button type="button" class="button-ainmate print_bill button box-shadow px-3"><i
                                class="fa-solid fa-print mr-1"></i>In hóa đơn</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
    `
    div.innerHTML = form;
    body.append(div);


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


    $('.print_bill').on('click', () => {
        var exportBill = {
            supplierEmail: dataImport.supplierEmail,
            uuid: dataImport.uuid,
            totalQuantity: dataImport.totalQuantity,
            totalPrice: dataImport.totalPrice,
            totalTax:dataImport.totalTax,
            totalPay: dataImport.totalPay,
            listImport: dataImport.listImport,
        }

        
        PostAPIFormBody('/admin/import/DataCreateImport' ,exportBill, data=>{
            if(data == 'success'){
                toast({ title: "Thông báo", message: "Xuất hóa đơn thành công !", type: "success" });
                var printElement = document.querySelector('#box-bill');
                var body = document.querySelector('body')
                body.classList.add('hidenBody')
                printElement.classList.remove('printLable')
                printElement.classList.add('showPrintLable')
                // Gọi hàm in
                window.print();
                body.classList.remove('hidenBody')
                printElement.classList.add('printLable')
                printElement.classList.remove('showPrintLable')
            }else{
                toast({ title: "Thông báo", message: " Có một lỗi nào đó từ server !", type: "error" });
            }
        } ,0 )

        
        
    })
}




