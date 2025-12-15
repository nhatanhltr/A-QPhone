var s = document.querySelector(".buttonDelete");
s.addEventListener('click ' , 
function () {
     swal({ title: "Sweet ajax request !!", text: "Submit to run ajax request !!", type: "info", showCancelButton: !0, closeOnConfirm: !1, showLoaderOnConfirm: !0 }, function () { setTimeout(function () { swal("Hey, your ajax request finished !!") }, 2e3) });

})