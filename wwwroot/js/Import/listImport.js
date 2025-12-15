import { GetAPI } from "../Axios/Axios.js";
import { formatCurrency,ConvertDate } from "../Ajax/Convert.js";
import { toast } from "../effects.js";
var pageCurrent = 1;
var SizePage2 ;

var SizePage = $('#multiple-quantity').multipleSelect({
    animate: 'slide',
    single: true,
    onClick: function () {
        SizePage2 = +SizePage.multipleSelect('getSelects')
        console.log($('.value-search').val())
        GetAPI('/admin/import/getListImport', listBillImport, {CurrentPage: pageCurrent, SizePage: SizePage2 })
    }
})


// tìm kiếm

$(document).on('click', '.btn-search', () => {
    GetAPI('/admin/import/getListImport', listBillImport, 
    {IDBILL: $('.value-search').val()}
    )
})
$('.filter-bill').on('click', function(){
   var from = $('.fromDate').val()
   var to = $('.toDate').val()
    console.log(to);
    if(from != "" && to != "" && from <= to  ){
        toast({title:"Thông báo" , message:"Thành công" , type:"success"})
        GetAPI('/admin/import/getListImport', listBillImport, 
    {fromDate: from , toDate:to }
    )
    }else{
        toast({title:"Thông báo" , message:"Ngày/ Tháng/ Năm Không hợp lệ !"})
    }
})

// function paging(data) {
//     renderPaging(data);
// };

GetAPI('/admin/import/getListImport', listBillImport, 
// {search: $('.value-search').val(), CurrentPage: page, SizePage: SizePage2 }
)


function listBillImport(data) {
    console.log(data.data)
    $(".list").empty();
    $.each(data.data.listImports, (index, item) => {
        var html = `
        <tr>
            <td class=" note-item"><a href="/admin/products/details/${item.uuid}"> ${item.uuid}</a></td>
            <td class="font-weight-bold">${item.totalQuantity}</td>
            <td class="">${formatCurrency(item.totalPrice)}</td>
            <td class="text-danger">${formatCurrency(item.totalTax)}</td>
            <td class="text-danger font-weight-bold">${formatCurrency(item.totalPay)}</td>
            <td >${ConvertDate(item.createAt)}</td>
            <td>
                <a href="/admin/products/details/${item.totalPay}" class="Details p-1 border-0 rounded c-cursor-poiter" title="Xem chi tiết">
                <i class="fa-solid fa-pen-to-square"></i></a>
            </td>
        </tr>
        `
        $(".list").append(html)
    })

    Paging(data, page => {
        GetAPI('/admin/import/getListImport', listBillImport, {search: $('.value-search').val(), CurrentPage: page, SizePage: SizePage2 })
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