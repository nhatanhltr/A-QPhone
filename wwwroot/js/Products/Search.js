import { Search } from "../Axios/Axios.js";

$("#search").on("input", function() {
    var inputValue = $(this).val();
    if(inputValue.length != 0){
        $('.close-search').removeClass('d-none')
    }else{
        $('.close-search').addClass('d-none')
    }
    Search('/search' , function(data){
        $('.render-search').empty()
        $.each(data.data, function(index, value){
            let html = `
                <a href="/${value.slugp}" class="p-3 mb-1 d-flex text-dark align-items-center border">
                    <img height="40px" width="35px" src="${value.image}" alt="">
                    <span class="px-3">${value.title}</span>
                </a>
            `
            $('.render-search').append(html)
        })

    },{search: inputValue} )
});

$('#search').focus(function() {
    console.log('search')
    $('.close-search').removeClass('d-none')
});

$('.close-search').on('click', function(){
    console.log('close')
    $("#search").val('');
    $('.render-search').empty()
    $('.close-search').addClass('d-none')
})


