import { GetAPI } from "./Axios/Axios.js";
$(document).ready(function(){
    GetAPI('/CartQuantity' , data=>{
        console.log(data)
        $('.cart-quantity').append(data)
    })
})