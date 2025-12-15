import { GetList, EditItem } from "./Ajax/Ajax.js";
import { GetAPI, PostAPI } from "./Axios/Axios.js";
import { toast } from "./effects.js";

var fullname = document.querySelector('input[name="fullname"]')
var email = document.querySelector('input[name="email"]')
var phoneNumber = document.querySelector('input[name="phoneNumber"]')
var address = document.querySelector('input[name="address"]')
var birthDay = document.querySelector('input[name="birthDay"]')
var creationDate = document.querySelector('input[name="creationDate"]')
var male = document.getElementById('maleRadio')
var female = document.getElementById('femaleRadio')
var notGender = document.getElementById('notGender')
// var img = document.getElementById('fileInput')

var fileName;
var selectedFile;

// xử lý thêm hình ảnh
$('#fileInput').change(function () {
    fileName = $(this).val().split('\\').pop();
    $('.label-s').text(fileName || 'Tùy chỉnh');
    selectedFile = this.files[0];
    if (selectedFile) {
        // Hiển thị hình ảnh preview
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#previewImage').attr('src', e.target.result);
        };
        reader.readAsDataURL(selectedFile);
    } else {
        // Nếu không có tệp nào được chọn, đặt src của hình ảnh preview thành trống
        $('#previewImage').attr('src', '/images/user-profile.png');
    }
});

// function check edit
var inputs = document.querySelectorAll("input[readonly]");
var button = document.querySelector("button[type='button']");
var picture = document.querySelector("#previewImage");
var EditProfile = document.getElementById('EditProfile');
var buttonSubmit = document.querySelector("button[name='buttonSubmit']");

EditProfile.addEventListener("click", function () {
    inputs.forEach((input) => {
        if (!(input.name == 'email' || input.name == 'creationDate')) {
            input.removeAttribute("readonly");
        }
    })
    buttonSubmit.classList.remove('d-none')
    button.classList.add('d-none')
})

function getDate(date) {
    if (date != null) {

        var date = new Date(date);
        // Lấy các thành phần ngày tháng từ đối tượng Date
        var year = date.getFullYear();
        var month = (date.getMonth() + 1).toString().padStart(2, '0');
        var day = date.getDate().toString().padStart(2, '0');
        var hours = date.getHours().toString().padStart(2, '0');
        var minutes = date.getMinutes().toString().padStart(2, '0');
        var seconds = date.getSeconds().toString().padStart(2, '0');
        // Tạo một chuỗi định dạng mới
        var formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;

        return formattedDate;
    } else return null;
}

GetAPI('/Manage/ProfileUserJson', getProfileUser)
function getProfileUser(data) {

    fullname.value = data.data.fullName;
    email.value = data.data.email;
    phoneNumber.value = data.data.phoneNumber
    address.value = data.data.address
    birthDay.value = getDate(data.data.birthDay)
    creationDate.value = getDate(data.data.creationDate)
    if (data.data.stringImage!= null) {
        picture.setAttribute('src', data.data.stringImage)
    }

    if (data.data.gender != null) {
        if (data.data.gender == 1) {
            male.checked = true;
        } else if (data.data.gender == 0) {
            female.checked = true;
        }else if(data.data.gender == 2) {
            notGender.checked =true;
        }
    }
}

buttonSubmit.addEventListener('click', function () {
    var gender = null;
    if (male.checked) {
        gender = 1
    } else if (female.checked) {
        gender = 0 
    }else if(notGender.checked){
        gender = 2
    }

    var ob = {
        image: $("#fileInput")[0].files[0],
        fullname: fullname.value,
        phoneNumber: phoneNumber.value,
        address: address.value,
        birthDay: birthDay.value,
        gender: gender
    }
    PostAPI('/Manage/EditProfile', ob , (data)=>{
        if(data.code === 200){
            toast({
                title: "Thành công",
                message: "Cập nhật thông tin thành công",
                type: "success",
                duration: 3000
            })
        }else{
            data.errors.forEach((error) => {
                toast({
                    title: data.message,
                    message: error,
                    type: "error",
                    duration: 3000
                })
            })
        }
    },1)
    inputs.forEach((input) => {
        if (!(input.name == 'email' || input.name == 'creationDate')) {
            input.readOnly = true;
        }
    })
    buttonSubmit.classList.add('d-none')
    button.classList.remove('d-none')
})


