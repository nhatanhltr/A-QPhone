import { GetAPI, PostAPI , PostAPIDefault } from "../Axios/Axios.js";
import { toast } from "../effects.js";


$(document).on('click', '.add-cart', function () {
    var slug = this.parentNode.parentNode.parentNode.querySelector('.id-pr').getAttribute('href').substring(1)
    var ob = { slug: slug }
    PostAPI('/ProductsClient/addtocart', ob, data => {
        // console.log(data)
        if (data.code === 200) {
            toast({ title: "Thông báo", message: "Thêm giỏ hàng thành công", type: data.message })
            GetAPI('/CartQuantity', data => {
                console.log(data)
                $('.cart-quantity').text(data)
            })
        } else if (data.code === 500) {
            toast({ title: "Thông báo", message: "Vui lòng đăng nhập", type: data.message })
        }
    })
})

function formatCurrency(number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

$('.quantity-control').on('click', function () {
    var i = $('.quantity-input')

    var action = $(this).data('action');

    var targetId = $(this).data('target');

    var targetInput = $('#' + targetId);

    var currentValue = parseInt(targetInput.val());

    var inventory = $(this).data('id')


    console.log(currentValue)
    if (action === 'increase' && currentValue < inventory) {
        targetInput.val(currentValue + 1);
        var quantity = this.parentNode.parentNode.querySelector('input[name="cartitem.quantity"]').value;

        var slug = this.parentNode.parentNode.querySelector('.id-pr').getAttribute('href').substring(1)

        var ob = { slug: slug, quantity: quantity }

        PostAPIDefault('/updatecart', ob, data => { })
        updateTotalPrice();
    } else if (action === 'decrease' && currentValue > 1) {
        targetInput.val(currentValue - 1);
        var quantity = this.parentNode.parentNode.querySelector('input[name="cartitem.quantity"]').value;

        var slug = this.parentNode.parentNode.querySelector('.id-pr').getAttribute('href').substring(1)

        var ob = { slug: slug, quantity: quantity }

        PostAPIDefault('/updatecart', ob, data => { })
        updateTotalPrice();
    } else {
        toast({ title: 'Thông báo', message: 'Số lượng tối đa', type: 'error' })
    }



});

$('#select-all').on('change', function () {
    // Cập nhật trạng thái của tất cả checkbox sản phẩm dựa trên checkbox "Chọn tất cả"
    $('.product-checkbox').prop('checked', $(this).prop('checked'));
    updateTotalPrice();
});

// Bắt sự kiện khi checkbox sản phẩm thay đổi
$('.product-checkbox').on('change', function () {
    // Cập nhật trạng thái của checkbox "Chọn tất cả" dựa trên tất cả checkbox sản phẩm
    $('#select-all').prop('checked', $('.product-checkbox:checked').length === $('.product-checkbox').length);
    updateTotalPrice();
});



function updateTotalPrice() {
    var sumPr = 0
    var total = 0;
    var arr = [];

    // Lặp qua tất cả các checkbox sản phẩm được chọn
    $('.product-checkbox:checked').each(function () {
        // Lấy giá trị data-price từ checkbox và cộng vào tổng
        var price = $(this).data('price');

        var quantity = this.parentNode.parentNode.querySelector('input[name="cartitem.quantity"]').value;
        sumPr += +quantity
        total += +price * quantity;
        var slug = this.parentNode.parentNode.querySelector('.id-pr').getAttribute('href').substring(1)
        arr.push(slug)
    });

    // Hiển thị tổng giá trị
    $('#total-price').text(formatCurrency(total));
    $('.sumPr').text(sumPr);

    // Disable or enable btn-checkout based on the sumPr value
    if (sumPr > 0) {
        $('.btn-checkout').off('click').prop('disabled', false);

        $('.btn-checkout').off('click').on('click', function () {
            var ob = { listPr: arr }
            PostAPI('/getProducts', ob, data => {
                if (data.code === 200) {
                    window.location.href = '/checkout';
                }
            });
        });
    } else {
        // Disable the button when sumPr is less than or equal to 0
        $('.btn-checkout').off('click').prop('disabled', true);
    }
}





