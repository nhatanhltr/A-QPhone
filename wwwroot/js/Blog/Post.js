import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js"
import { toast } from "../effects.js"
import { ConvertDate } from "../Ajax/Convert.js";

var pageCurrent = 1;
var colors = {
    0: "primary", 1: "success", 2: "warning", 3: "secondary", 4: `danger`, 5: 'info', 6: 'dark'
}

var SizePage = $('#multiple-quantity').multipleSelect({
    // data: options,
    // value: '1',
    animate: 'slide',
    single: true,
    onClick: function () {
        GetAPI('/admin/blog/post/postjson', listPost, { CurrentPage: pageCurrent, SizePage: +SizePage.multipleSelect('getSelects') })
    }
})


GetAPI('/admin/blog/post/postjson', listPost, { CurrentPage: pageCurrent, SizePage: +SizePage.multipleSelect('getSelects') })


let Paging = (data, callback) => {
    $('.pageNumber').empty();
    if (data.data.countPage > 1) {
        for (let i = 1; i <= data.data.countPage; ++i) {
            let btn = `
                <li class="page-item ${i === data.data.currentPage ? 'active' : ''}">
                    <button class="page-link">${i}</button>
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

        // Sự kiện khi nút "Previous" được click
        // $(".Previous").on("click", function () {
        //     if (pageCurrent > 1) {
        //         pageCurrent = pageCurrent - 1;
        //         callback(pageCurrent);
        //     }
        // });

        // // Sự kiện khi nút "Next" được click
        // $(".Next").on("click", function () {
        //     if (pageCurrent < data.data.countPage) {
        //         pageCurrent = pageCurrent + 1;
        //         callback(pageCurrent);
        //     }
        // });
    }
};


function listPost(data) {
    $(".listpost").empty();
    $.each(data.data.listPost, (index, item) => {
        let html = `
                <tr>
                    <td class="note-item">
                        <div class="d-flex flex-column">
                        <h4>${item.title}</h4>
                        <a>Danh mục: ${item.postCategories.map((categories) => categories.category.title.toString())}</a>
                        </div>
                    </td>
                    <td><img src="${item.image != null ? item.image : "/images/loader.gif"}" height=40 width=40 class="road" alt="">
                    </td>
                    <td>${ConvertDate(item.dateUpdated, false)}</td>
                    <td>${item.viewCount}</td>
                    <td ><span class="${item.status != 0 ? 'badge badge-success px-2 text-white' : ''}">${item.status != 0 ? 'Đã duyệt' : 'Chờ duyệt'}</span></td>
                    <td>
                        <button  class="Details p-1 border-0 text-success bg-transparent " data-id="${item.postID}"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button class="buttonDelete p-1 mx-1 border-0 text-danger bg-transparent" data-id="${item.postID}"><i class="fa-solid fa-trash-can"></i></button>
                    </td>
                </tr>
                `
        $(".listpost").append(html)
    })

    Paging(data, page => {
        // if (page >= 1 && page <= data.data.countPage) {
        GetAPI('/admin/blog/post/postjson', listPost, { CurrentPage: page, SizePage: +SizePage.multipleSelect('getSelects') })
        // }
    })
}

// module container add/edit
function modelCategory(params = null) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
<div class="c-transparent-bg preve-close w-100">
    <div class="c-form close-model d-flex justify-content-center align-items-center w-100">
        <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-75">
            <form id="Create" class="">
                <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i
                        class="fa-solid fa-xmark"></i></button>
                <h4 class="text-center animation-text my-3 ">Bài viết mới</h4>
                <div>
                    <div class="row">
                        <div class="col l-4">
                            <div class=" d-flex justify-content-between flex-column">
                                <div class="form-group form-field w-100 d-flex">
                                    <div class="d-flex flex-column justify-content-between align-items-center ">
                                        <img id="previewImage" height=80px width=100
                                            src="${params != null ? params.image : '/images/icons8-blog-100.png'}"
                                            class=" px-2"></img>
                                        <input id="fileInput" name="file" type="file" class="d-none" />
                                        <label for="fileInput" class="box-shadow label-s d-inline px-2">Chọn Tệp</label>
                                    </div>
                                </div>
                                <div class="form-group form-field my-0 w-100 d-flex justify-content-between align-items-center">
                                    <div class="custom-checkbox ">
                                        <input id="check" name="check" type="checkbox" ${params !==null ?
                                            `${params.status !==0 ? 'checked' : "" }` : '' }>
                                        <label for="check" class="form-label"
                                            style="transform: translate(10px, -20px);">Duyệt
                                            đăng</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col l-8">
                            <div class="form-group form-field d-flex">
                                <select id="multiple" class="select w-100" multiple="multiple">
                                </select>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="form-group form-field w-100">
                                    <input value="${params != null ? params.title : ''}" id="name" name="Title"
                                        rule="required" type="text" placeholder=" "
                                        class=" form-input form-error form-control ">
                                    <label for="name" class="form-label">Tiêu đề</label>
                                    <span class="form-message"></span>
                                </div>

                                <div class="form-group form-field w-100">
                                    <input value="${params != null ? params.abstractTitle : ''}" id="name"
                                        name="AbstractTitle" rule="required" type="text" placeholder=" "
                                        class="form-input form-error form-control">
                                    <label for="name" class="form-label">Mô tả bài viết</label>
                                    <span class="form-message"></span>
                                </div>
                            </div>
                        </div>

                        <div class="col l-12">
                            <div class="form-group form-field">
                                <textarea id="Editor"></textarea>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-around">
                    <div class="d-flex form-field justify-content-center">
                        <button type="button" class="btn-close px-3 box-shadow">Hủy</button>
                    </div>
                    <div class="d-flex form-field justify-content-center">
                        <button type="submit" class="button-ainmate form-submit button box-shadow px-5"><i
                                class="fa-solid fa-plus mr-2"></i>Thêm</button>
                    </div>
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
            $('#multiple').multipleSelect('setSelects', params.categoryIDs)
        }
    })
    var editor = new FroalaEditor('#Editor', {
        charCounterCount: false,
        attribution: false,
        heightMin: 50,
        heightMax: 200,
        events: {
            'initialized': function () {
                if (params !== null) {
                    var editor = this;
                    editor.html.set(params.content);
                }
            }
        }
    });
    var fileName
    $('#fileInput').change(function () {
        fileName = $(this).val().split('\\').pop();
        $('.label-s').text(fileName || 'Tùy chỉnh');
        var selectedFile = this.files[0];
        if (selectedFile) {
            // Hiển thị hình ảnh preview
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#previewImage').attr('src', e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        } else {
            // Nếu không có tệp nào được chọn, đặt src của hình ảnh preview thành trống
            $('#previewImage').attr('src', '/images/loader.gif');
        }
    });
    

    Validate('#Create', (dataInput) => {
        dataInput.CategoryIDs = [(+$('#multiple').multipleSelect('getSelects') === 0 ? null : +$('#multiple').multipleSelect('getSelects'))]
        var isChecked = $('#check').is(':checked');
        dataInput.Status = isChecked === true ? 1 : 0
        dataInput.Image = $('#fileInput')[0].files[0]
        dataInput.Content = editor.html.get()

        if (params === null) {
            PostAPI('/admin/blog/post/Create', dataInput, data => {
                GetAPI('/admin/blog/post/PostJson', listPost)
                toast({ title: 'Thông báo', message: 'Thêm thành công', type: data.message })
                div.remove()
            }, 0);
        } else {
            dataInput.id = params.postID
            PostAPI('/admin/blog/post/Edit', dataInput, data => {
                if (data.code === 200) {
                    GetAPI('/admin/blog/post/PostJson', listPost)
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

// thêm mới bài viết
$(document).on('click', '.create-post', function () {
    modelCategory();
})

// xem chi tiết và chỉnh suawr
$(document).on('click', '.Details', function () {
    GetAPI('/admin/blog/post/DetailsJson', data => {
        if (data.code === 200) {
            modelCategory(data.data)
        }
    }, { id: $(this).data('id') })
})
// xóa một bài post
$(document).on('click', '.buttonDelete', function () {
    const that = this
    PostAPI('/admin/blog/post/Delete', { id: $(this).data('id') }, data => {
        if (data.code === 200) {
            GetAPI('/admin/blog/post/postjson', listPost)
            toast({
                title: "Xóa thành công",
                message: `Đã xóa ${that.parentNode.parentNode.querySelector('.note-item').textContent} thành công`,
                type: 'warning'
            })
        }
    }, 2)
});