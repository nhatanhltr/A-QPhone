import { GetList, DetailsItem, deleteItem } from "./Ajax/Ajax.js";
import { ConvertDate } from "./Ajax/Convert.js";


GetList('/admin/contact/IndexJson', listContact)
$(document).on('click', '.DetailsContact', function () {
    DetailsItem('/admin/contact/details', $(this).data('id'), ViewDetailsContact);
});


$(document).on('click', '.buttonDelete', function () {
    deleteItem('/admin/contact/Delete/', $(this).data('id'), callback);
    function callback(data) {
        if (data.code === 200) {
            GetList('/admin/contact/IndexJson', listContact)
        }
    }

});

function listContact(data) {
    $(".listContact").empty();
    $.each(data.list, (index, value) => {
        let html = `
                <tr>
                    <td>${value.fullName}</td>
                    <td>${value.email}</td>
                    <td>${ConvertDate(value.dateSend, false)}</td>
                    <td>${value.status ? "Đã xem" : "Mới"}</td>
                    <td>
                        <button  class="DetailsContact p-1 border-0 text-success " data-id="${value.id}"><i class="fa-solid fa-bookmark"></i> </button>
                        <button class="buttonDelete p-1 mx-1 border-0 text-danger" data-id="${value.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                `
        $(".listContact").append(html)
    })
}

function ViewDetailsContact(data) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var details = `
            <div class="c-transparent-bg preve-close">
                <div class="c-form d-flex justify-content-center align-items-center">
                    <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-4 c-w-60 text-dark">
                        <div class="row border-bottom">
                            <div class="col l-6">
                                <label class="p-1 c-font-weight">Người gửi: </label>
                                <label class="p-1  border-bottom  ">${data.details.fullName}</label>
                            </div>
                            <div class="col l-6 ">
                                <label class="p-1 c-font-weight ">Email: </label>
                                <label class="p-1  border-bottom  ">${data.details.email} </label>
                            </div>
                        </div>
                        <div class="row border-bottom">
                            <div class="col l-6">
                                <label class="p-1 c-font-weight">Số điện thoại: </label>
                                <label class="p-1  border-bottom  ">${data.details.phone}</label>
                            </div>
                            <div class="col l-6">
                                <label class="p-1 c-font-weight">Ngày gửi: </label>
                                <label class="p-1  border-bottom  ">${ConvertDate(data.details.dateSend)}</label>
                            </div>
                        </div>
                        <div class="row border-bottom">
                            <div class="col l-12">
                                <label class="p-1 center c-font-weight">Nội dung</label>
                                <label class="p-1 center ">${data.details.message}</label>
                            </div>
                        </div>
                        <div class="p-1  d-flex justify-content-between">
                            <div class="">
                                <label class="c-font-weight">Trạng thái: </label>
                                <label>${data.details.status ? "Đã xem" : "Chưa xem"}</label>
                            </div>
                            <button class=" closebtn c-btn-yes" >Đóng</button>
                        </div>
                    </div>
                </div>
            </div>
    `
    $(document).on('click', '.preve-close', function () {
        div.remove()
    });
    $(document).on('click', '.c-form', function (e) {
        e.stopPropagation();
    });
    $(document).on('click', '.closebtn', function () {
        div.remove()
    });
    div.innerHTML = details
    body.append(div)
}

