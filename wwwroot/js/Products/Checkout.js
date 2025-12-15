import { GetAPI, PostAPI, PostAPIFormBody } from "../Axios/Axios.js";
import { Validate } from "../validateform.js";
import { toast } from "../effects.js";

GetAPI('https://esgoo.net/api-tinhthanh/1/0.htm', data => {
    //GetAPI('https://provinces.vinhuniversity.edu.vn/api/provinces', data => {
    // Lấy danh sách các tỉnh/thành phố từ dữ liệu API
    console.log(data)
    // var provinces = data.map(item => item.name);
    // console.log(data.results)
    var provinces = data.data.map(item => ({
        value: item.id, text: item.name
        //var provinces = data.map(item => ({ value: item.code, text: item.name
    }));
    // console.log(provinces)
    var city = $('#city').multipleSelect({
        data: provinces,
        animate: 'slide',
        single: true,
        placeholder: "-- Tỉnh/ Thành Phố --",
        filter: true,
        onClick: function () {
            var id = $('#city').multipleSelect('getSelects')
            console.log(id);
            GetAPI(`https://esgoo.net/api-tinhthanh/2/${id}.htm`, data => {
                //GetAPI(`https://provinces.vinhuniversity.edu.vn/api/province/${id}` , data =>{

                district(data.data)
                //district(data.districts)
            })
        }
    });

});

function district(data) {
    console.log(data);
    $('#district').html('<option value="">-- Quận/ Huyện --</option>');

    if (data !== undefined) {
        data.map(value => document.getElementById('district').innerHTML += `<option value='${value.id}'>${value.name}</option>`);
        //data.map(value => document.getElementById('district').innerHTML += `<option value='${value.code}'>${value.name}</option>`);
    }
    $('#district').change(function () {
        var selectedDistrict = $("#district").val();
        GetAPI(`https://esgoo.net/api-tinhthanh/3/${selectedDistrict}.htm`, data => {
            //GetAPI(`https://provinces.vinhuniversity.edu.vn/api/district/${selectedDistrict}` , data =>{
            wards(data.data)
            //wards(data.wards)   
        })

    });
}

function wards(data) {
    $('#wards').html('<option value="">-- Phường/ Xã --</option>');

    if (data !== undefined) {
        data.map(value => document.getElementById('wards').innerHTML += `<option value='${value.id}'>${value.name}</option>`);
        //data.map(value => document.getElementById('wards').innerHTML += `<option value='${value.code }'>${value.name}</option>`);
    }
}


Validate("#checkout", data => {
    var p = []
    $('.pr-item').each(function () {
        let slug = this.querySelector('.id-pr').getAttribute('href').substring(1)
        let quantity = +this.querySelector('.quantity').textContent
        var s = {
            ProductSlug: slug,
            quantity: quantity,
        }
        p.push(s)
    })
    data.orderDetail = p;

    $('input[name="options"]').each(function () {
        if ($(this).is(":checked")) {
            // Nếu checkbox được chọn, lấy giá trị văn bản của nhãn tương ứng
            var labelText = $('label[for="' + $(this).attr('id') + '"]').text();
            data.paymentMethod = labelText
        }
    })

    data.notes = $("#notes").val();
    let city = $('#city').multipleSelect('getSelects', 'text')
    let district = $('#district option:selected').text()
    let wards = $('#wards option:selected').text()
    data.Address = data.Address.concat(", ", wards, ", ", district, ", ", city)


    PostAPIFormBody('/checkout', data, data => {
        if (data.code === 200) {
            toast({
                title: 'Thông báo',
                message: 'Mua hàng thành công',
                type: data.message
            })
            window.location.href = '/order/thanks';
        }
    }, 0)
})
