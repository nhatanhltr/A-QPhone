import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js"
import { toast } from "../effects.js"

////////////////////////// categories js //////////////////////////

var colors = {
    0: "primary", 1: "success", 2: "warning", 3: "secondary", 4: `danger`, 5: 'info', 6: 'dark'
}
GetAPI('/admin/blog/category/indexJson', ViewCategories)
function ViewCategories(data) {
    $(".list").empty();
    const Trees = buildMenu(data, null);
    function buildMenu(datas, parentId, level = 0) {
        let submenu = datas.data.filter(item => item.parentCategoryId === parentId);
        if (submenu.length > 0) {
            let html = '';
            submenu.forEach((item) => {
                html += `
                <tr>
                    <td>
                        <div class="note-item py-1 px-3 rounded text-white bg-${colors[level]}" style=";margin-left: ${level * 40}px; font-weight:${level === 0 ? 700 : 200}">${item.title}</div>
                    </td>
                    <td class="text-center">${item.slug}</td>
                    <td class="text-center">
                    <button class="buttonDetails text-success bg-transparent p-1 mx-2 box-shadow" data-id="${item.id}"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="buttonDelete text-danger bg-transparent p-1 box-shadow" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                ${buildMenu(datas, item.id, level + 1)}
            `;
            });

            return html;
        }
        return '';
    }
    $(".list").append(Trees)
}

function modelCategory(params = null) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
<div class="c-transparent-bg preve-close w-100">
    <div class="c-form close-model d-flex justify-content-center align-items-center w-75">
        <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-4 c-w-60 text-dark w-75">
            <form id="Create" class="">
                <h4 class="text-center text-shadown my-3 ">Thêm mới loại bài viết (Category)</h4>
                <div class="form-group form-field d-flex">
                    <select id="multiple" class="select w-100" multiple="multiple">
                    </select>
                </div>
                <div class="form-group form-field">
                    <input value="${params != null ? params.title : ''}" id="name" name="Title" rule="required"
                        type="text" placeholder=" " class="form-input form-error form-control">
                    <label for="name" class="form-label">Tên danh mục</label>
                    <span class="form-message"></span>
                </div>

                <div class="form-group form-field">
                    <input value="${params != null ? params.slug : ''}" id="name" name="Slug" rule="required" type="text"
                        placeholder=" " class="form-input form-error form-control">
                    <label for="name" class="form-label">Url hiển thị</label>
                    <span class="form-message"></span>
                </div>
                
                <div class="form-group form-field">
                    <textarea id="name" name="Description" rule="required" type="text" placeholder=" "
                        class="form-input form-error form-control">${params != null ? params.description : ''}</textarea>
                    <label for="name" class="form-label">Nội dung</label>
                    <span class="form-message"></span>
                </div>

                <div class="d-flex form-field justify-content-center">
                    <button type="submit" class="button-ainmate form-submit button box-shadow">Thêm mới</button>
                </div>
            </form>
        </div>
    </div>
</div>
    `
    div.innerHTML = form;
    body.append(div);
    var options = []
    GetAPI('/admin/blog/category/indexJson', data => {
        const Trees = buildMenu(data, null);
        function buildMenu(datas, parentId, level = 0) {
            let submenu = datas.data.filter(item => item.parentCategoryId === parentId);
            if (submenu.length > 0) {
                var object = {}
                submenu.forEach((item) => {
                    if (params !== null) {
                        if (item.id === params.id) return
                    }
                    let s = " . . . ";
                    for (let i = 0; i < level; i++) {
                        s += " . . . ";
                    }
                    object = {
                        value: item.id,
                        text: s.concat(item.title),
                        classes: `bg-${colors[level]} text-white rounded my-1 mx-2`
                    }
                    let ob = buildMenu(datas, item.id, level + 1)
                    options.unshift(object)
                });
                return object;
            }
        }
        let defaultOption = {
            value: null,
            text: 'Phần tử cha lớn nhất',
            classes: `bg-primary text-white rounded my-1 mx-2`
        }
        options.unshift(defaultOption)
        $('#multiple').multipleSelect({
            data: options,
            animate: 'slide',
            single: true,
            filter: true,
            placeholder: "Lựa chọn phần tử cha (có hoặc không)",
        })

        if (params !== null) {
            console.log(params.parentCategoryId)
            var s= $('#multiple').multipleSelect('setSelects', [params.parentCategoryId] ,'value');
            console.log(s)
        }
    })
    Validate('#Create', (dataInput) => {
        var s = $('#multiple').multipleSelect('getSelects')
        console.log(s)
        dataInput.ParentCategoryId = (+$('#multiple').multipleSelect('getSelects') === 0 ? null : +$('#multiple').multipleSelect('getSelects'))
        console.log(dataInput)
        if (params === null) {
            PostAPI('/admin/blog/category/CreateCategroies', dataInput, data => {
                if (data.code === 200) {
                    GetAPI('/admin/blog/category/indexJson', ViewCategories)
                    div.remove()
                }
            }, 0);
        } else {
            dataInput.id = params.id
            PostAPI('/admin/blog/category/EditCategory', dataInput, data => {
                console.log(data)
                if (data.code === 200) {
                    GetAPI('/admin/blog/category/indexJson', ViewCategories)
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
}
// add categories
$(document).on('click', '.create-category', function () {
    modelCategory()
})
// delete categories
$(document).on('click', '.buttonDelete', function () {
    const that = this
    PostAPI('/admin/blog/category/DeleteCategories', { id: $(this).data('id') }, data => {
        if (data.code === 200) {
            GetAPI('/admin/blog/category/indexJson', ViewCategories)
            toast({
                title: "Xóa thành công",
                message: `Đã xóa ${that.parentNode.parentNode.querySelector('.note-item').textContent} thành công`,
                type: 'warning'
            })
        }
    }, 2)
});

// editt categories
$(document).on('click', '.buttonDetails', function () {
    GetAPI('/admin/blog/category/DetailsJson', data => {
        if (data.code === 200) {
            modelCategory(data.data)
        }
    }, { id: $(this).data('id') })

});