export function ConvertDate(data, time = true) {
  const dateObject = new Date(data);

  // Sử dụng các phương thức của Date để định dạng ngày tháng
  const formattedDate = `${dateObject.getDate().toString().padStart(2, '0')}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getFullYear()}${time ? ` ${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}` : ''}`;
  
  return formattedDate;
}


export function formatCurrency(number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(number);
}

export function handlePriceInput(id){

    // Sử dụng sự kiện change cho phần tử input
    $(id).on('change', function() {
      console.log('dka');
      formatNumberInput(this);
    });
  
    function formatNumberInput(inputElement) {
      // Lấy giá trị nhập vào từ phần tử input
      let inputValue = $(inputElement).val();
  
      // Loại bỏ mọi ký tự không phải là số
      inputValue = inputValue.replace(/[^0-9]/g, '');
  
      // Đảm bảo giá trị không bắt đầu bằng 0
      inputValue = inputValue.replace(/^0+/, '');
  
      // Định dạng số với hàng đơn vị, hàng trăm, hàng ngàn và hàng triệu
      const formattedValue = new Intl.NumberFormat().format(parseInt(inputValue, 10));
  
      // Đặt giá trị đã định dạng vào phần tử input
      $(inputElement).val(formattedValue);
    }
  
}
