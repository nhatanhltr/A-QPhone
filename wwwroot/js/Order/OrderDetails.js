import { GetAPI, PostAPI } from "../Axios/Axios.js"
import { toast } from "../effects.js"
import { ConvertDate, formatCurrency } from "../Ajax/Convert.js";

// var Status = $('#multiple').multipleSelect({
//     animate: 'slide',
//     single: true,
// })

GetAPI('/admin/status/indexjson', data => {
    var options = data.data.map(function (item) {
        return {
            value: item.id,
            text: item.statusName
        };
    });
    $('#multiple').multipleSelect({
        data: options,
        animate: 'slide',
        single: true,
    })
})


$('.check-status').on('click', function(){
    var object ={
        guid: document.querySelector('.id-bill').innerText,
        idStatus: +$('#multiple').multipleSelect('getSelects')
    };
    var textStatus = $('#multiple').multipleSelect('getSelects' , 'text')
    $('.Status-bill ').html(textStatus);
    console.log(object);

    PostAPI('/admin/orders/UpdateStatusOrder' ,object , function(data){
        console.log(data)
        if(data.code == 200){
            toast({title:'Thông báo' , message:`Cập nhật trạng thái ${textStatus} thành công`, type:'success'})
        }else{
            toast({title:'Thông báo' , message:data.message})
        }
    },1)
})
$('.Print-bill ').on('click', function(){
    GetAPI('/admin/orders/JsonOrderDetails', function(data){
        modelPrintBill(data.data);
    } ,{id: document.querySelector('.id-bill').innerText})
})



function modelPrintBill(data) {
    console.log(data)

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
                <h4 class="text-center mt-2">HÓA ĐƠN BÁN HÀNG</h4>
                <div class="row">
                    <div class="col l-3 d-flex">
                        <div class="d-flex justify-content-center align-items-center">
                            <img width="35%" src="/images/nks-high-resolution-logo-transparent.png" alt="">
                        </div>
                    </div>
                    <div class="col l-9 m-9 ">
                        <div class="p-1"><b>Mã hóa đơn:</b><span class="id_bill"> ${data.guid}</span></div>
                        <div class="p-1"><b>Tên công ty:</b> Công ty A&Q</div>
                        <div class="p-1"><b>Địa chỉ:</b> Trường Đại Học Vinh</div>
                        <div class="p-1"><b>Ngày tạo:</b> ${ConvertDate(data.createdDate)}</div>
                    </div>
                    
                </div>
                <hr>
                <h4 class="text-center ">Thông tin khách hàng</h4>
                <div class="row">
                    <div class="col l-12 m-12">
                    <div class="p-1"><b>Khách hàng:</b><span class="">${data.fullName}</span></div>
                    <div class="p-1"><b>Điện thoại:</b> <span>${data.phoneNumber}</span></div>
                    <div class="p-1"><b>Địa chỉ:</b> ${data.address}</div>
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
                                    ${data.orderDetail.map((item, index) => {
        return `
                                            <tr>
                                                <th scope="row">${index + 1}</th>
                                                <td>${item.products.title}</td>
                                                <td>${formatCurrency(item.priceOrder)}</td>
                                                <td>${item.quantity}</td>
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
                            <div class="p-1">Tổng số lượng: <span class="text-red">${data.totalQuantity}</span></div>
                            <div class="p-1">Tạm tính: <span class="text-red">${formatCurrency(data.totalPrice)}</span></div>
                            <div class="p-1 font-weight-bold border">Thanh toán: <span
                                    class="text-red">${formatCurrency(data.totalPrice)}</span></div>
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
    })
}
