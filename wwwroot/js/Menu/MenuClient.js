import { GetAPI, PostAPI } from "../Axios/Axios.js";

GetAPI("/menu", RenderMenu)

function RenderMenu(data) {
    // console.log(data)
    $(".menu-list").empty();
    $.each(data.data, (index, item) => {
        // console.log(item)
        if(item.categoryChildren != null){
            let html = `
                <li class="parent-category d-flex justify-content-between align-items-center font-weight-bold my-2 p-2 border-bottom"><span
                    class="item-category "><i class="${item.description} mx-2"></i>${item.title}</span><i class="fa-solid fa-chevron-right"></i>
                </li>
                `
        $(".menu-list").append(html)
        }
    })

    $(document).on('mouseenter', '.parent-category', function () {
        $('.containerMenu-child ').addClass('d-block')
        $('.containerMenu-child ').addClass('animate-menu')
        $.each(data.data, (index, item)=>{
            var i = this.querySelector(".item-category")
            if(item.title === i.textContent){
                i.classList.add("actives")
                $(".menu-details").empty();
                $.each(item.categoryChildren,(index, child)=>{
                    let html = `
                    <div class="col col-3 mt-3"> 
                        <span class="font-weight-bold">
                            <a class="text-dark box-shadow p-2" href="/san-pham/${child.slugc}"> 
                                ${child.title} <i class="fa-regular fa-hand-point-left"></i>
                            </a>
                        </span>
                        <div class="row pt-3 ${child.slugc}">
                        </div>
                    </div>
                    `
                    $(".menu-details").append(html);
                    $.each(data.products, (index, prs)=>{
                        if(prs.categoryId === child.id){
                            $.each(prs.products, (index, pr)=>{
                                let html = `
                                    <div class="col col-12 py-2 pr-item"><a href="/${pr.slug}" class="">${pr.name}</a></div>
                                `
                                $(`.${child.slugc}`).append(html);
                            })
                        }
                    })
                })
                return
            }
        })
    })

    $(document).on('mouseleave', '.parent-category', function () {
        var i = this.querySelector(".item-category")
        i.classList.remove("actives")

    })
    $(document).on('mouseleave', '.handMouse', function () {
        if($('.containerMenu-child').hasClass('d-block')){
        $('.containerMenu-child ').removeClass('animate-menu')
            $('.containerMenu-child ').removeClass('d-block')

        }
    })

    $(document).on('click', '.menu-close', function () {
        $('.containerMenu-child ').removeClass('animate-menu')
        $('.containerMenu-child ').removeClass('d-block')
    })
    
}