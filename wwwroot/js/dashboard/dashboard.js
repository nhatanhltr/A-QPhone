import { GetAPI } from "../Axios/Axios.js";
import { formatCurrency ,ConvertDate} from "../Ajax/Convert.js";

function formatDateToLocalInput(date, check = true) {
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    let hours = check ? date.getHours().toString().padStart(2, '0') : '01';
    let minutes = check ? date.getMinutes().toString().padStart(2, '0') : '00';

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

let now = new Date();
let formDate = formatDateToLocalInput(now, false);
let toDate = formatDateToLocalInput(now);

function excuteDate(from, to) {
    $('.fromDate').val(from);
    $('.toDate').val(to);

    $('.box-formDate').html(ConvertDate(from, false));
    $('.box-toDate').html(ConvertDate(to, false));

     GetAPI('/admin/dashboard/Statistical' , function (data){
        console.log(data)
        $('.bought').html(data.data.bought + ' Sản phẩm')
        $('.revenue').html(formatCurrency(data.data.revenue))
        $('.customerNew').html(data.data.customerNew + ' Khách hàng')
        $('.inventory').html(data.data.inventory + ' Sản phẩm')

        $('.pedding').html(data.data.pendding )
        $('.delivering').html(data.data.delivering)
        $('.delived').html(data.data.delived)
        $('.guarantee').html(data.data.guarantee)

    } , {from:from, to:to })
}
excuteDate(formDate, toDate);
$('.btn-filter').on('click', function () {

    if(!($('.fromDate').val() == null || $('.fromDate').val() >$('.fromDate').val() )){
        excuteDate($('.fromDate').val(), $('.toDate').val())
    }
    else{
        alert('ERROR: Invalid')
    }
})
$('.btn-today').on('click', function (){
    excuteDate(formDate, toDate);
    console.log($('.fromDate').val())
})
$('.btn-thisWeek').on('click', function (){

    let currentDate = now; // Lấy thời gian hiện tại
    let firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay())); // Ngày đầu tiên của tuần (Chủ Nhật là ngày cuối cùng của tuần trước)
    excuteDate(firstDayOfWeek, toDate);  
})
$('.btn-thisMonth').on('click', function (){
    let currentDate =now
    let firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1); // Ngày đầu tiên của tháng
    excuteDate(firstDayOfMonth, toDate);
})
$('.btn-thisYear').on('click', function (){
    let currentDate =now
    let firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1); // Ngày đầu tiên của năm
    excuteDate(firstDayOfYear, toDate);
})

