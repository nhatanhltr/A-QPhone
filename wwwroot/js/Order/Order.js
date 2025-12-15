import { GetAPI } from "../Axios/Axios.js"
import { ConvertDate, formatCurrency } from "../Ajax/Convert.js";

var pageCurrent = 1;
var SizePage2 ;
var currentStatus  = 1;

var SizePage = $('#multiple-quantity').multipleSelect({
    animate: 'slide',
    single: true,
    onClick: function () {
        SizePage2 = +SizePage.multipleSelect('getSelects')
        GetAPI('/admin/orders/indexjson', ViewOrder, {CurrentPage: pageCurrent, SizePage: SizePage2 , status: currentStatus })
    }
})

GetAPI('/admin/orders/indexjson', ViewOrder)

function ViewOrder(data) {
    $(".list").empty();
    $.each(data.data.listOrder, (index, item) => {

        let html = `
                <tr class="text-center">
                    <td>${index}</td>
                    <td class="note-item">${item.fullName}</td>
                    <td>${item.phoneNumber}</td>
                    <td>${item.totalQuantity}</td>
                    <td class="text-danger">${formatCurrency(+item.totalPrice)}</td>
                    <td>${ConvertDate(item.createdDate, false)}</td>
                    <td>
                    <a href="/admin/orders/OrderDetails/${item.guid}" class="Details text-success  bg-transparent p-1 border-0 " data-id=""><i class="fa-solid fa-pen-to-square"></i></a>
                    </td>
                    </tr>
                    `
        $(".list").append(html)
    })

    Paging(data, page => {
        GetAPI('/admin/orders/indexjson', ViewOrder, {search: $('.value-search').val().trim(), CurrentPage: page, SizePage: SizePage2 })
    })
}


let Paging = (data, callback) => {
    $('.pagination').empty();
    if (data.data.countPage > 1) {
        for (let i = 1; i <= data.data.countPage; ++i) {
            let btn = `
                <li class="page-item ">
                    <button class="px-3 py-1 mx-1 my-3 rounded box-shadow ${i === data.data.currentPage ? 'active' : ''}">${i}</button>
                </li>
            `;
            $('.pagination').append(btn);
        }
        // Xử lý sự kiện khi nút số trang được click
        $('.page-item').on('click', function () {
            $('.page-item').removeClass('active');
            pageCurrent = +$(this).text();
            $(this).addClass('active');
            var s = $('html, body')
            s.animate({
                scrollTop: 0
            }, 800); // 800 là thời gian (milliseconds) của animation

            s.scrollTop(0);
            callback(pageCurrent);
        });
    }
};


$(document).on('click', '.btn-search', () => {
    GetAPI('/admin/orders/indexjson', ViewOrder, 
    {search: $('.value-search').val().trim() , status: currentStatus}
    )
})


GetAPI('/admin/status/indexjson', ViewStatus)
function ViewStatus (data){
    $(".render-status").empty();
    $.each(data.data, (index, item) => {
        let html = `
                <button data-id= ${item.id}  class=" btn-status px-1 py-1 mx-2 box-shadow ${currentStatus == item.id ? 'active': ''}">${item.statusName}</button>
                `
        $(".render-status").append(html)
    })
}

$(document).on('click', '.btn-status', function () {
    let id = $(this).data('id')
    currentStatus = id
    console.log(currentStatus);
    GetAPI('/admin/orders/indexjson', ViewOrder, {CurrentPage: pageCurrent, SizePage: SizePage2 , status: currentStatus })

    GetAPI('/admin/status/indexjson', ViewStatus)
})