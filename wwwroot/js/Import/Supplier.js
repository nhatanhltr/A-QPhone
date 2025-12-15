import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js";
import { toast } from "../effects.js"

var pageCurrent = 1;
var colors = {
    0: "primary", 1: "success", 2: "warning", 3: "secondary", 4: `danger`, 5: 'info', 6: 'dark'
}

var SizePage = $('#multiple-quantity').multipleSelect({
    animate: 'slide',
    single: true,
    // onClick: function () {
    //     GetAPI('/admin/import/supplier/indexJson', list, { CurrentPage: pageCurrent, SizePage: +SizePage.multipleSelect('getSelects') })
    // }
})




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

GetAPI('/admin/import/supplier/indexJson', list)

function list(data) {
    console.log(data)
     $(".list").empty();
    $.each(data.data, (index, item) => {

        var html = `
        <tr>
            <td >${index+1}</td>
            <td class="note-item font-weight-bold w-25">${item.name}</td>
            <td><img src="${item.image}" height=50 width=50 alt="" class=""></td>
            <td >${item.phone}</td>
            
            <td>
                <button class="Details p-1 border-0 rounded border" data-id="${item.guid}"><i class="fa-solid fa-pen-to-square text-success"></i></button>
                <button class="buttonDelete p-1 mx-1 border-0 rounded border" data-id="${item.guid}"><i class="fa-solid fa-trash text-danger"></i></button>
                </td>
        </tr>
        `
        $(".list").append(html)
    })

    //  Paging(data, page => {
    //      // if (page >= 1 && page <= data.data.countPage) {
    //      GetAPI('/admin/import/supplier/indexJson', list, { CurrentPage: page, SizePage: +SizePage.multipleSelect('getSelects') })
    //      // }
    //  })
}


function modelCategory(params = null) {
    let body = document.querySelector('.content-body');
    let div = document.createElement('div')
    div.classList.add("details")
    var form = `
    <div class="c-transparent-bg preve-close w-100">
        <div class="c-form close-model d-flex justify-content-center align-items-center w-100">
            <div class="animate c-m-e-20 bg-white c-boxshow  rounded p-2 c-w-60 text-dark w-75">
                <form id="Create" class="">
                    <button type="button" class="p-1 btn-close border-0 bg-white float-right"><i class="fa-solid fa-xmark"></i></button>
                    <h4 class="text-center text-shadown my-3 ">Thêm mới nhà cung cấp</h4>
                    <div>
                        <div class="row">
                            <div class="col l-4">
                                <div class="border h-100 d-flex justify-content-center align-items-center">
                                    <div class="d-flex flex-column rounded">
                                        <img id="previewImage" height=100% width=100%
                                            src="${params != null ? params.image : '/images/icons8-supplier-100.png'}" class="rounded p-2"></img>
                                        <input id="fileInput" name="file" type="file" class="d-none" />
                                        <label for="fileInput" class="box-shadow label-s d-inline px-2 mt-2">Chọn Tệp</label>
                                    </div>  
                                </div>
                            </div>
                            <div class="col l-8">
                                <div class="border h-100">
                                    <div class="row">
                                        <div class="col l-12">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.name : ''}" id="name" name="name" rule="required"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Tên danh mục</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>

                                        <div class="col l-6">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.email : ''}" id="name" name="email" rule="required"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Địa chỉ Email</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>

                                        <div class="col l-6">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.phone : ''}" id="name" name="phone" rule="required"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Số điện thoại</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>
                                        <div class="col l-12">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.address : ''}" id="name" name="address" rule="required"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Địa chỉ công ty</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>

                                        <div class="col l-12">
                                            <div class="form-group form-field ">
                                                <input value="${params != null ? params.description : ''}" id="description" name="description"
                                                    type="text" placeholder=" " class=" form-input form-error form-control ">
                                                <label for="name" class="form-label">Mô tả thêm</label>
                                                <span class="form-message"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    <div class="d-flex justify-content-around">
                        <div class="d-flex form-field justify-content-center">
                            <button type="button" class="btn-close px-3 box-shadow">Hủy</button>
                        </div>
                        <div class="d-flex form-field justify-content-center">
                            <button type="submit" class="button-ainmate form-submit button box-shadow px-3"><i class="fa-solid fa-plus mr-2"></i>Thêm</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    </div>
    `
    div.innerHTML = form;
    body.append(div);
    
    
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
            $('#previewImage').attr('src', 'images/icons8-supplier-100.png');
        }
    });
    Validate('#Create', (dataInput) => {
       
        dataInput.Image = $('#fileInput')[0].files[0]
        dataInput.description = $('#description').val()
        console.log(dataInput)
        if (params === null) {
            PostAPI(' /admin/import/supplier/Create', dataInput, data => {
                GetAPI('/admin/import/supplier/indexJson', list)
                toast({ title: 'Thông báo', message: 'Thêm thành công', type: data.message })
                div.remove()
            }, 0);
        }
        // else {
        //     dataInput.id = params.postID
        //     console.log(dataInput)
        //     PostAPI('/admin/blog/post/Edit', dataInput, data => {
        //         console.log(data)
        //         if (data.code === 200) {
        //             GetAPI('/admin/import/supplier/indexJson', list)
        //             toast({ title: 'Thông báo', message: 'Cập nhật thành công', type: data.message })
        //             div.remove()
        //         }
        //     }, 1);
        // }
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

$(document).on('click', '.create', function () {
    modelCategory();
})

$(document).on('click', '.Details', function () {
    console.log($(this).data('id'))
    GetAPI('/admin/import/supplier/DetailsAPI', data => {
        if (data.code === 200) {
            modelCategory(data.data)
        }
    }, { GUID: $(this).data('id') })
})

// xóa một bài post
$(document).on('click', '.buttonDelete', function () {
    const that = this
    console.log($(this).data('id') )
    PostAPI('/admin/import/supplier/DeleteApi', { GUID: $(this).data('id') }, data => {
        if (data.code === 200) {
            GetAPI('/admin/import/supplier/indexJson', list)
            toast({
                title: "Xóa thành công",
                message: `Đã xóa ${that.parentNode.parentNode.querySelector('.note-item').textContent} thành công`,
                type: 'success'
            })
        }
    }, 2)
});