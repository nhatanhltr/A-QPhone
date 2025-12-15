import { Pagination, deleteItem, GetList, CreateItem } from "./Ajax/Ajax.js";
import { toast } from "./effects.js";

let pageCurrent;
let totalPage;
Pagination('/admin/users/indexjson', { CurrentPage: 1 }, paging);

function renderPaging(data, Search = undefined ) {
    $('.list').empty()
    $('.pagination').empty();
    if (data.code === 200) {
        $('.totalUser').html(`Tổng danh sách: ${data.data.total > 0 ? data.data.total : "Không tìm thấy"}`)
        $.each(data.data.users, (index, user) => {
            let html = `
                <tr>
                    <td> ${index}</td>
                    <td>${user.fullName }</td>
                    <td>${user.email}</td>
                    <td><button class="select-role w-100 box-shadow p-1" data-id="${user.id}" data-email="${user.email}" data-name="${user.fullName}">${user.roleNames == '' ? " " : user.roleNames}</button></td>
                    <td>
                        <a href="/admin/users/details/${user.id}" title="Chi tiết" class="DetailsContact d-inline-block mx-1 p-1 border-0 rounded text-success" ><i class="fa-solid fa-pen-to-square"></i></a>
                        <button title="Xóa" class="buttonDelete p-1 border-0 rounded text-danger" data-id="${user.id}"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
                `
            $('.list').append(html)
        })
        if (data.data.countPage !== 1) {
            for (let i = 1; i <= data.data.countPage; i++) {
                let btn =
                    `
                <button  class="btn-page px-3 py-1 mx-1 my-3 rounded box-shadow ${i === data.data.currentPage ? 'active' : ''}" value="${i}">${i}</button>
            `
                $('.pagination').append(btn)
            }
            let btns = document.querySelectorAll('.btn-page');
            btns.forEach(function (button) {
                button.addEventListener('click', function () {
                    // Loại bỏ lớp "active" từ tất cả các nút
                    btns.forEach(function (btn) {
                        btn.classList.remove('active');
                    });
                    pageCurrent = button.value
                    console.log(pageCurrent)
                    // Thêm lớp "active" cho nút hiện tại
                    this.classList.add('active');
                    Pagination('/admin/users/indexjson', { CurrentPage: pageCurrent, email: Search }, Search === undefined ? paging : data => { pagingSearch(data, Search) });
                });
            });
        }
    }
}
function paging(data) {
    renderPaging(data);
};
$(document).on('click', '.buttonDelete', function () {
    deleteItem('/admin/users/DeleteUser', $(this).data('id'), data => {
        if (data.code === 200) {
            toast({
                title: 'Thành công',
                message: data.message,
                type: 'success'
            })
            Pagination('/admin/users/indexjson', { CurrentPage: pageCurrent }, paging);
        }
    })
})
$(document).on('click', '.select-role', function () {
    var idUser = $(this).data('id');
    var nameUser = $(this).data('name');
    var emailUser = $(this).data('email');
    var listRole = $(this).text().split(', ')
    GetList('/admin/users/ListRoleJson', (data) => {
        var options = data.data.map(function (item) {
            return {
                value: item.id,
                text: item.name
            };
        });

        $('#multiple').multipleSelect({
            data: options,
            animate: 'slide',
            selectAll: false,
        })
        $('#multiple').multipleSelect('setSelects', listRole, 'text')
        $(document).on('click', '.preve-close', function () {
            div.remove()
        });
        $(document).on('click', '.c-form', function (e) {
            e.stopPropagation();
        });
    })

    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
            <div class="c-transparent-bg preve-close">
            <div class="c-form d-flex justify-content-center align-items-center">
                <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-5 c-w-60 text-dark">
                    <form id="Create-Role" class="">
                        <div>
                        <h3>Thêm vai trò cho người dùng (Role)</h3>
                        <p>Email: ${emailUser}</p>
                        <p>Tên : ${nameUser == null ? "<span class='text-danger'>Chưa đặt tên</span>" : nameUser}</p>
                        </div>
                        <select id="multiple" class="select w-100" multiple="multiple">
                        </select>
                        <div class="d-flex form-field justify-content-between">
                            <button type="button" class="submitRole button box-shadow">Thêm vai trò(roles)</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
                    `
    div.innerHTML = form;
    body.append(div);

    $(document).one('click', '.submitRole', function () {
        var ob = {
            id: idUser,
            roles: $('#multiple').multipleSelect('getSelects')
        }
        CreateItem('/admin/users/addroleuser', ob, (data) => {
            if (data.code === 200) {
                console.log(pageCurrent+ "test")
                Pagination('/admin/users/indexjson', {CurrentPage : pageCurrent}, renderPaging);
                toast({ title: "Thông báo", message: `Cập nhật vai trò thành công`, type: 'success' })
                div.remove();
            }
        })
    })

})

function pagingSearch(data, search) {
    // renderPaging(data, search)
}
// tìm kiếm user
$(document).on('click', '.buttonSearch', () => {
    var inputData = document.querySelector('input[name="search"]').value.trim()
    if (inputData !== '') {
        Pagination('/admin/users/indexjson', { CurrentPage: 1, email: inputData }, data => {
            // pagingSearch(data, inputData)
            renderPaging(data, inputData)
        });
    }
})

// render tất cả user
$(document).on('click', '.user-all', () => {
    Pagination('/admin/users/indexjson', { CurrentPage: 1 }, paging);
})

// render tất cả user có roles


