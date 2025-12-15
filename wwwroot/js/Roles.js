import { Validate } from "./validateform.js";
import { GetList, deleteItem, CreateItem, EditItem } from "./Ajax/Ajax.js";
import { toast } from './effects.js'

GetList('/admin/role/jsonindex', listRole)

// get danh sách role
function listRole(data) {
    $(".list").empty();
    $.each(data.data, (index, value) => {
        let html = `
                <tr class="text-center">
                    <td> ${index}</td>
                    <td ><input readonly name="name" class="input" value="${value.name}"></input></td>
                    <td>${value.claims}</td>
                    <td>
                        <button title="Chỉnh sửa"  class="DetailsRole button p-1 border-0 text-success bg-transparent" data-id="${value.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button title="Xóa" class="buttonDelete button p-1 border-0 text-danger bg-transparent" data-id="${value.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                `
        $(".list").append(html)
    })
}

// add new role
$(document).on('click', '.create-role', function () {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
            <div class="c-transparent-bg preve-close">
            <div class="c-form d-flex justify-content-center align-items-center">
                <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-4 c-w-60 text-dark">
                    <form id="Create-Role" class="">
                        <h3>Thêm mới vai trò (Role)</h3>
                        <div class="form-group form-field">
                            <input  id="name" name="name" rule="required" type="text" placeholder=" "
                                class="form-input form-error form-control" autofocus>
                            <label for="name" class="form-label">Tên vai trò</label>
                            <span class="form-message"></span>
                        </div>
                        <div class="d-flex form-field justify-content-between">
                            <button type="submit" class="form-submit button box-shadow">Thêm mới</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
    `
    div.innerHTML = form;
    body.append(div);

    Validate('#Create-Role', (data) => {
        CreateItem('/admin/role/CreateRole', data, function (data) {
            if (data.code === 200) {
                GetList('/admin/role/jsonindex', listRole)
                div.remove();
            }
        })
    })
    $(document).on('click', '.preve-close', function () {
        div.remove()
    });
    $(document).on('click', '.c-form', function (e) {
        e.stopPropagation();
    });
})

// xóa role
$(document).on('click', '.buttonDelete', function () {
    const that = this
    deleteItem('/admin/role/DeleteRole', $(this).data('id'), callback);
    function callback(data) {
        if (data.code === 200) {
            GetList('/admin/role/jsonindex', listRole)
            toast({ title: "Xóa vai trò", message: `Đã xóa vai trò ${that.parentNode.parentNode.querySelector('input').value} thành công`, type: 'success' })
        }
    }
});

// editt
$(document).on('click', '.DetailsRole', function () {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
            <div class="c-transparent-bg preve-close">
            <div class="c-form d-flex justify-content-center align-items-center">
                <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-4 c-w-60 text-dark">
                    <form id="Create-Role" class="">
                        <h3>Cập nhật tên vai trò ${this.parentNode.parentNode.querySelector('input').value}</h3>
                        <div class="form-group form-field">
                            <input value="${this.parentNode.parentNode.querySelector('input').value}" id="name" name="name" rule="required" type="text" placeholder=" "
                                class="form-input form-error form-control">
                            <label for="name" class="form-label">Tên vai trò</label>
                            <span class="form-message"></span>
                        </div>
                        <div class="d-flex form-field justify-content-between">
                            <button type="submit" class="form-submit button box-shadow">Cập nhật</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
    `
    div.innerHTML = form;
    body.append(div);

    Validate('#Create-Role', (data) => {
        data.id = $(this).data('id')
        EditItem('/admin/role/UpdateRole', data, function (data) {
            if (data.code === 200) {
                GetList('/admin/role/jsonindex', listRole)
                toast({ title: "Cập nhật", message: "Cập nhât vai trò thành công", type: 'success' });
                div.remove();
            }
        })
    })
    $(document).on('click', '.preve-close', function () {
        div.remove()
    });
    $(document).on('click', '.c-form', function (e) {
        e.stopPropagation();
    });


    // if (previousInput && previousInput !== this) {
    //     var object = {
    //         'id': $(this).data('id'),
    //         'name': previousInput.value.trim()
    //     }
    //     // Kiểm tra giá trị của ô input trước và sau khi thay đổi
    //     if (previousValue !== previousInput.value.trim()) {
    //         EditItem('/admin/role/UpdateRole', object, (data) => {
    //             if (data.code === 200) {
    //                 previousInput.readOnly = true;
    //                 previousInput.classList.remove('input-edit');
    //             } else if (data === 500) {
    //                 GetList('/admin/role/jsonindex', listRole)
    //             }
    //         });
    //         console.log(object)
    //     }
    //     // Đặt trạng thái chỉ đọc cho ô input trước
    //     previousInput.readOnly = true;
    //     previousInput.classList.remove('input-edit');
    // }else
    // {

    // }
    // var parents = this.parentNode.parentNode;
    // var input = parents.querySelector('input');
    // input.readOnly = false;
    // input.classList.add('input-edit');
    // previousValue = input.value.trim();
    // previousInput = input;
});

