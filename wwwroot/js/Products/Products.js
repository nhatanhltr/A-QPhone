import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { formatCurrency } from "../Ajax/Convert.js";

var pageCurrent = 1;
var SizePage2 ;
var SizePage = $('#multiple-quantity').multipleSelect({
    animate: 'slide',
    single: true,
    onClick: function () {
        SizePage2 = +SizePage.multipleSelect('getSelects')
        console.log($('.value-search').val())
        GetAPI('/admin/products/indexJson', listProducts, { search: $('.value-search').val(),CurrentPage: pageCurrent, SizePage: SizePage2 })
    }
})

// var options = []
// GetAPI('/admin/products/category/indexJson', data => {
//     const Trees = buildMenu(data, null);
//     function buildMenu(datas, parentId, level = 0) {
//         let submenu = datas.data.filter(item => item.parentCategoryId === parentId);
//         if (submenu.length > 0) {
//             var object = {}
//             submenu.forEach((item) => {

//                 let s = " . . . ";
//                 for (let i = 0; i < level; i++) {
//                     s += " . . . ";
//                 }
//                 object = {
//                     value: item.id,
//                     text: s.concat(item.title),
//                     classes: `bg-${colors[level]} text-white rounded my-1 mx-2`
//                 }
//                 let ob = buildMenu(datas, item.id, level + 1)
//                 options.unshift(object)
//             });
//             return object;
//         }
//     }
//     $('#multiple').multipleSelect({
//         data: options,
//         animate: 'slide',
//         single: true,
//         filter: true,
//         placeholder: "Yêu cầu chọn danh mục sản phẩm (*)",
//     })
// })
// var fileName
// $('#fileInput').change(function () {
//     fileName = $(this).val().split('\\').pop();
//     console.log(fileName)
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
//         $('#previewImage').attr('src', '/images/loader.gif');
//     }
// });
// var editor = new FroalaEditor('#Editor', {
//     charCounterCount: false,
//     attribution: false,
//     heightMin: 50,
//     heightMax: 200,
//     // events: {
//     //     'initialized': function () {
//     //             var editor = this;
//     //             // editor.html.set(params.content);
//     //     }
//     // }
// });
// Validate('#Create', (dataInput) => {
//     dataInput.CategoryIDs = [(+$('#multiple').multipleSelect('getSelects') === 0 ? null : +$('#multiple').multipleSelect('getSelects'))]
//     var isChecked = $('#check').is(':checked');
//     dataInput.Status = isChecked === true ? 1 : 0
//     dataInput.Image = $('#fileInput')[0].files[0]
//     dataInput.Discription = editor.html.get()

//     console.log(dataInput)

//     PostAPI('/admin/products/CreateJson', dataInput, (data) => {
//         console.log(data)

//         if (data.code === 500) {
//             toast({
//                 title: "Tồn tại",
//                 type: 'error',
//                 message: data.data
//             })
//         } else if (data.code === 200) {
//             toast({
//                 title: "Thông báo",
//                 type: 'success',
//                 message: "Thêm sản phẩm thành công"
//             })
//             setTimeout(() => window.location.href = "/admin/products/index", 3000)
//         }
//     }, 0)
// })

let Paging = (data, callback) => {
    $('.pageNumber').empty();
    if (data.data.countPage > 1) {
        for (let i = 1; i <= data.data.countPage; ++i) {
            let btn = `
                <li class="page-item ">
                    <button class="px-3 py-1 mx-1 my-3 rounded box-shadow ${i === data.data.currentPage ? 'active' : ''}">${i}</button>
                </li>
            `;
            $('.pageNumber').append(btn);
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

GetAPI('/admin/products/indexJson', listProducts)

function listProducts(data) {
    $(".list").empty();
    $.each(data.data.listProducts, (index, item) => {
        var html = `
        <tr>
            <td >${index + 1}</td>
            <td class=" note-item font-weight-bold w-25"><a href="/admin/products/details/${item.productID}"> ${item.title}</a></td>
            <td><img src="${item.image}" height=50 width=50 alt="" class=""></td>
            <td class="text-danger font-weight-bold">${formatCurrency(item.price)}</td>
            <td class="text-danger price-old ">${formatCurrency(item.priceOld)}</td>
            <td>${item.inventory}</td>
            <td ><span class="badge p-2 ${item.published != 0 ? ' badge-success  text-white' : 'badge-danger'}">${item.published != 0 ? 'Hiển thị' : 'Ẩn'}</span></td>
            <td>
                <a href="/admin/products/details/${item.productID}" class="Details p-1 border-0 rounded c-cursor-poiter" title="Xem chi tiết">
                <i class="fa-solid fa-pen-to-square"></i></a>
                
                <a href="/admin/products/EditImage/${item.productID}" class="Details p-1 border-0 rounded c-cursor-poiter" title="Xem chi tiết">
                <i class="fa-solid fa-image"></i></a>
            </td>
        </tr>
        `
        $(".list").append(html)
    })

    Paging(data, page => {
        GetAPI('/admin/products/indexJson', listProducts, {search: $('.value-search').val(), CurrentPage: page, SizePage: SizePage2 })
    })
}


$('.btn-search').on('click', function () {
    // $('.value-search').val;
    GetAPI('/admin/products/indexJson', listProducts, { search: $('.value-search').val(), CurrentPage: 1, SizePage: +SizePage.multipleSelect('getSelects') })

})