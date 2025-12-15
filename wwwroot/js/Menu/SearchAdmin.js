import { Search } from "../Axios/Axios.js";

$("#search").on("input", function() {
    var inputValue = $(this).val();
    // console.log('kdjalk')
    Search('/admin/search' , function(data){
        $('.render-search').empty()
        console.log(data)
        $.each(data.data, function(index, value){
            let html = `
                <a href="${value.link}" class="p-3 mb-1 d-flex text-dark align-items-center border">
                    <span class="px-3">${value.name}</span>
                </a>
            `
            $('.render-search').append(html)
        })

    },{search: inputValue} )

    // $(this).blur(function(){
    //     $('.render-search').empty()
    // })

});