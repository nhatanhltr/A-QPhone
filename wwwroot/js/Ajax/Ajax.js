import {  LoadingStatus, toast } from '../effects.js'

export function GetList(url, callback) {
    LoadingStatus(true);
    $.ajax({
        url: url,
        type: "Get",
        dataType: 'json',
        success: function (data) {
            if (data.code == 200) {
                callback(data)
                LoadingStatus(false);
            }
        },
        error: function (xhr) {
            toast({
                title: "Thông báo",
                message: "Lỗi thông thể kết nối",
                type: 'error',
                duration: 5000
            });
        }
    });
}

export function DetailsItem(url, id, callback) {

    var token = $('input[name="__RequestVerificationToken"]').val()
    var object = {
        'id': id,
        '__RequestVerificationToken': token
    }
    LoadingStatus(true);
    $.ajax({
        url: url,
        type: "POST",
        data: object,
        success: function (data) {
            if (data.code === 200) {
                callback(data)
                LoadingStatus(false);
            }
        },
        error: function (xhr) {
            toast({
                title: "Thông báo",
                message: "Lỗi thông thể kết nối",
                type: 'error',
                duration: 5000
            });
        }
    });
}

export function EditItem(url, object, callback) {
    var token = $('input[name="__RequestVerificationToken"]').val();
    object.__RequestVerificationToken = token;
    let body = document.querySelector('.content-body');
    let div = document.createElement('div');
    div.classList.add('confirm');
    $(document).off('click', '.no');
    $(document).off('click', '.yes');
    let btn = `
        <div class="c-transparent-bg preve-close">
                <div class=" d-flex justify-content-center align-items-center h-100">
                    <div class="animate p-4 bg-white c-boxshow rounded">
                        <div class="text-center">
                            <div>
                                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="#d5541d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h4 class="center p-3">Bạn muốn cập nhật không</h4>
                        </div>
                        <div class="d-flex justify-content-around">
                            <button  class=" c-btn-no no" >Hủy</button>
                            <button class=" c-btn-yes yes">Đồng ý</button>
                        </div>
                    </div>
                </div>
            </div>
          `
    div.innerHTML = btn;
    body.append(div);

    $(document).on('click', '.no', function () {
        div.remove();
        callback(500)
    });
    $(document).on('click', '.preve-close', function () {
    });
    $(document).on('click', '.yes', function () {
        LoadingStatus(true);
        $.ajax({
            url: url,
            type: "POST",
            data: object,
            success: function (data) {
                if (data.code === 200) {
                    callback(data)
                    LoadingStatus(false)
                } else {
                    callback(data)
                    LoadingStatus(false)
                }
            }
        });
        div.remove();
    });
}

export function CreateItem(url, object, callback) {
    LoadingStatus(true)
    var token = $('input[name="__RequestVerificationToken"]').val();
    object.__RequestVerificationToken = token
    $.ajax({
        url: url,
        type: "POST",
        data: object,
        success: function (data) {
            if (data.code === 200) {
                callback(data)
                LoadingStatus(false)
            }
        }
    });
}

export function deleteItem(url, id, callback) {
    var token = $('input[name="__RequestVerificationToken"]').val();
    var data = {
        'id': id,
        '__RequestVerificationToken': token
    }
    let body = document.querySelector('.content-body');
    let div = document.createElement('div');
    div.classList.add('confirm');
    $(document).off('click', '.no');
    $(document).off('click', '.yes');
    let btn = `
        <div class="c-transparent-bg preve-close">
                <div class="c-form d-flex justify-content-center align-items-center">
                    <div class="animate p-4 bg-white c-boxshow rounded">
                        <div class="text-center">
                            <div>
                                <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                                <svg width="60px" height="60px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                        stroke="#d5541d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <h4 class="center p-3">Bạn muốn xóa không !</h4>
                        </div>
                        <div class="d-flex justify-content-around">
                            <button  class=" c-btn-no no" >Hủy</button>
                            <button class=" c-btn-yes yes">Đồng ý</button>
                        </div>
                    </div>
                </div>
            </div>
          `
    div.innerHTML = btn;
    body.append(div);

    $(document).on('click', '.no', function () {
        div.remove();
    });
    $(document).on('click', '.preve-close', function () {
        div.remove()
    });
    $(document).on('click', '.c-form', function (e) {
        e.stopPropagation();
    });
    function excute(){
        LoadingStatus(true);true
        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function (data) {
                if (data.code === 200) {
                    callback(data)
                    LoadingStatus(false)
                }
            },
            error: function (xhr) {
                toast({
                    title: "Thông báo",
                    message: "Lỗi thông thể kết nối",
                    type: 'error',
                    duration: 3000
                });
            }
        });
        div.remove();
    }
    $(document).on('click', '.yes', function () {
        excute()
    });
    $(document).on('keydown', function (event) {
        if (event.which === 13) {  // Kiểm tra xem phím nhấn có phải là Enter không (mã phím 13)
          excute();
        }
      }); 
}

export function Pagination(url, object, callback) {
    LoadingStatus(true);
    $.ajax({
        url: url,
        type: 'GET',
        data: object,
        success: function (data) {
            if (data.code === 200) {
                callback(data)
                LoadingStatus(false);
            }else{
                callback(data)
                LoadingStatus(false);
            }
        }
    });
}