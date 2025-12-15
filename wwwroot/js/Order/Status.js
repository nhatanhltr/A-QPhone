import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js"
import { toast } from "../effects.js"

GetAPI('/admin/status/indexjson', ViewStatus)
function modelCategory(params = null) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
<div class="c-transparent-bg preve-close w-100">
    <div class="c-form close-model d-flex justify-content-center align-items-center w-50">
        <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-75">
            <form id="Create" class="">
                <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i
                        class="ti-close"></i></button>
                <h4 class="text-center text-shadown my-3 ">Thêm trạng thái đơn hàng</h4>
                <div>
                        <div class="form-group form-field ">
                            <input value="${params != null ? params.statusID : ''}" id="name" name="statusID" rule="required"
                                type="number" placeholder=" " class=" form-input form-error form-control ">
                            <label for="name" class="form-label">Mã Trạng thái</label>
                            <span class="form-message"></span>
                        </div>
                        <div class="form-group form-field ">
                            <input value="${params != null ? params.statusName : ''}" id="name" name="statusName" rule="required"
                                type="text" placeholder=" " class=" form-input form-error form-control ">
                            <label for="name" class="form-label">Tên trạng thái</label>
                            <span class="form-message"></span>
                        </div>
                        <div class="form-group form-field ">
                            <input value="${params != null ? params.description : ''}" id="name" name="description"
                                rule="required" type="text" placeholder=" " class="form-input form-error form-control ">
                            <label for="name" class="form-label">Mô tả trạng thái</label>
                            <span class="form-message"></span>
                        </div>
                </div>
                <div class="d-flex justify-content-around">
                    <div class="d-flex form-field justify-content-center">
                        <button type="button" class="btn-close px-3 box-shadow">Hủy</button>
                    </div>
                    <div class="d-flex form-field justify-content-center">
                        <button type="submit" class="button-ainmate form-submit button box-shadow px-5">Thêm</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</div>
    `
    div.innerHTML = form;
    body.append(div);

    Validate('#Create', (dataInput) => {

        if (params === null) {
            PostAPI('/admin/status/CreateJson', dataInput, data => {
                GetAPI('/admin/status/indexjson', ViewStatus)
                toast({ title: 'Thông báo', message: 'Thêm thành công', type: data.message })
                div.remove()
            }, 0);
        } else {
            dataInput.id = params.id
            console.log(dataInput)
            PostAPI('/admin/status/UpdateJson', dataInput, data => {
                console.log(data)
                if (data.code === 200) {
                    GetAPI('/admin/status/indexjson', ViewStatus)
                    toast({ title: 'Thông báo', message: 'Cập nhật thành công', type: data.message })
                    div.remove()
                }
            }, 1);
        }
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

function ViewStatus (data){
    $(".list").empty();
    $.each(data.data, (index, item) => {
        let html = `
                <tr>
                    <td class="text-center">${item.statusID}</td>
                    <td class="note-item text-center">${item.statusName}</td>
                    <td class="text-center">${item.description}</td>
                    <td class="text-center">
                        <button  class="Details p-1 text-success  bg-transparent border-0 rounded " data-id="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="buttonDelete text-danger bg-transparent p-1 mx-1 border-0 rounded " data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                `
        $(".list").append(html)
    })

}


$(document).on('click', '.create', function () {
    modelCategory();
})

$(document).on('click', '.buttonDelete', function () {
    const that = this
    PostAPI('/admin/status/DeleteJson', { id: $(this).data('id') }, data => {
        if (data.code === 200) {
            GetAPI('/admin/status/indexjson', ViewStatus)
            toast({
                title: "Xóa thành công",
                message: `Đã xóa ${that.parentNode.parentNode.querySelector('.note-item').textContent} thành công`,
                type: 'warning'
            })
        }
    }, 2)
});

// xem chi tiết và chỉnh suawr
$(document).on('click', '.Details', function () {
    console.log($(this).data('id'))
    GetAPI('/admin/status/DetailsJson', data => {
        if (data.code === 200) {
            modelCategory(data.data)
        }
    }, { id: $(this).data('id') })
})