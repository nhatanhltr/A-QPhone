import { LoadingStatus, toast } from "../effects.js";

var message = [
  "Bạn có muốn thêm không",
  "Bạn có muốn cập nhật không",
  "Bạn có muốn xóa không",
  "Bạn muốn đặt hàng không?"
]
const Post = async (url, object, token, callback) => {
  LoadingStatus(true);
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'RequestVerificationToken': token,
    }
  }
  try {
    const response = await axios.post(url, object, config);
    // Handle the response data
    callback(response.data)
  } catch (error) {
    console.log(error)
    toast({ title: "Thông báo", message: "Không thể gửi đi", type: "error" });
    callback(error);
  } finally {
    LoadingStatus(false);
  }
};

const PostFormBody = async (url, object, token, callback) => {
  LoadingStatus(true);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'RequestVerificationToken': token,
    }
  }
  try {
    const response = await axios.post(url, object, config);
    // Handle the response data
    callback(response.data)
  } catch (error) {
    console.log(error)
    toast({ title: "Thông báo", message: "Không thể gửi đi", type: "error" });
    callback(error);
  } finally {
    LoadingStatus(false);
  }
};
export const Search = async (url, callback, object = undefined) =>{
  try {
    const response = await axios.get(url, { params: object });
    callback(response.data)
  } catch (error) {
    console.log(error);
    callback(error)
    toast({ title: "Thông báo", message: "Không thế gửi đi", type: "error" })
  }
}

export const GetAPI = async (url, callback, object = undefined) => {
  LoadingStatus(true)
  try {
    const response = await axios.get(url, { params: object });
    callback(response.data)
  } catch (error) {
    console.log(error);
    callback(error)
    toast({ title: "Thông báo", message: "Không thế gửi đi", type: "error" })
  }
  finally {
    LoadingStatus(false)
  }
}

export  const PostAPIDefault = async (url, object, callback) =>{
  var token = $('input[name="__RequestVerificationToken"]').val();

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      'RequestVerificationToken': token,
    }
  }
  try {
    const response = await axios.post(url, object, config);
    // Handle the response data
    callback(response.data)
  } catch (error) {
    console.log(error)
    toast({ title: "Thông báo", message: "Không thể gửi đi", type: "error" });
    callback(error);
  }


  // if(post == null){
  //   Post(url, object, token, data => {
  //     callback(data)
  //   })
  // }else{
  //   $(document).one('click', '.yes', function () {
  //     Post(url, object, token, data => {
  //       callback(data)
  //     })
  //     div.remove()
  //   });
  // }
}


export const PostAPI = (url, object, callback, post = null) => {
  var token = $('input[name="__RequestVerificationToken"]').val();
  let body = document.querySelector('.content-body');
  let div = document.createElement('div');
  $(document).off('click', '.no');
  $(document).off('click', '.yes');
  div.classList.add('confirm');
  let btn = `
      <div class="c-transparent-bg preve-close">
              <div class="confirm-fixed d-flex justify-content-center align-items-center">
                  <div class="confirm-model animate py-3 px-4 bg-white c-boxshow rounded">
                      <div class="text-center">
                          <div>
                              <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                      d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="#d5541d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                          </div>
                          <h4 class="center p-1">${message[post]} !</h4>
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

  $(document).one('click', '.no', function () {
    let element = $('.confirm-model')
    element.addClass('model-confirm');
    element.one('animationend', () => {
      element.removeClass('model-confirm')
      div.remove();
    })
  });
  if(post == null){
    Post(url, object, token, data => {
      callback(data)
    })
  }else{
    $(document).one('click', '.yes', function () {
      Post(url, object, token, data => {
        callback(data)
      })
      div.remove()
    });
  }
  $(document).one('keydown', function (event) {
    if (event.which === 13) {  // Kiểm tra xem phím nhấn có phải là Enter không (mã phím 13)
      event.preventDefault();
      Post(url, object, token, data => {
        callback(data)
      });
      div.remove()
    }
  })
}




export const PostAPIFormBody = (url, object, callback, post = null) => {
  var token = $('input[name="__RequestVerificationToken"]').val();
  let body = document.querySelector('.content-body');
  let div = document.createElement('div');
  $(document).off('click', '.no');
  $(document).off('click', '.yes');
  div.classList.add('confirm');
  let btn = `
      <div class="c-transparent-bg preve-close">
              <div class="confirm-fixed d-flex justify-content-center align-items-center">
                  <div class="confirm-model animate py-3 px-4 bg-white c-boxshow rounded">
                      <div class="text-center">
                          <div>
                              <?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
                              <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path
                                      d="M12 16.99V17M12 7V14M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                      stroke="#d5541d" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                              </svg>
                          </div>
                          <h4 class="center p-1">${message[post]} !</h4>
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

  $(document).one('click', '.no', function () {
    let element = $('.confirm-model')
    element.addClass('model-confirm');
    element.one('animationend', () => {
      element.removeClass('model-confirm')
      div.remove();
    })
  });
  if(post == null){
    Post(url, object, token, data => {
      callback(data)
    })
  }else{
    $(document).one('click', '.yes', function () {
      PostFormBody(url, object, token, data => {
        callback(data)
      })
      div.remove()
    });
  }
  $(document).one('keydown', function (event) {
    if (event.which === 13) {  // Kiểm tra xem phím nhấn có phải là Enter không (mã phím 13)
      event.preventDefault();
      Post(url, object, token, data => {
        callback(data)
      });
      div.remove()
    }
  })
}