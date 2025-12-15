function formatCurrency(input) {
    // Xóa các ký tự không phải số
    var value = input.value.replace(/\D/g, '');
    // Định dạng lại giá trị theo tiền tệ Việt Nam
    var formattedValue = formatToVietnameseCurrency(value);
    // Hiển thị giá trị đã được định dạng
    input.value = formattedValue;
}

function formatToVietnameseCurrency(value) {
    // Định dạng giá trị thành tiền tệ Việt Nam
    var formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    });
    return formatter.format(value);
}