import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { toast } from "../effects.js";


$(document).on('click', '.add-carts', function () {

    var slug = window.location.pathname.substring(1)
    var ob = { slug: slug }
    PostAPI('/ProductsClient/addtocart', ob, data => {
        // console.log(data)
        if (data.code === 200) {
            toast({ title: "Thông báo", message: "Thêm giỏ hàng thành công", type: data.message })
        } else if (data.code === 500) {
            toast({ title: "Thông báo", message: "Vui lòng đăng nhập", type: data.message })
        }
    })
})


var galleryTop = new Swiper('.gallery-top', {
    spaceBetween: 10,
    centeredSlides: true,

    loop: false,
    loopedSlides: 4
});
var galleryThumbs = new Swiper('.gallery-thumbs', {
    spaceBetween: 10,
    centeredSlides: true,
    slidesPerView: 'auto',
    touchRatio: 0.5,
    slideToClickedSlide: true,
    loop: false,
    loopedSlides: 4
});
galleryTop.controller.control = galleryThumbs;
galleryThumbs.controller.control = galleryTop;