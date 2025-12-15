import { GetAPI, PostAPI } from "../Axios/Axios.js";
import { Validate } from "../validateform.js";
import { handlePriceInput, formatCurrency } from "../Ajax/Convert.js";
import { toast } from "../effects.js";
$("#fileInputs").on("change", function (event) {
  handleFiles(event);
});
const selectedFiles = [];

function handleFiles(event) {
  const fileList = event.target.files;
  const imageContainer = $("#imageContainer");

  // Clear existing images
  imageContainer.html("");

  // Create an array to store selected file information

  // Process each selected file
  for (const file of fileList) {
    const image = $("<img>").addClass("imageContainer-product-img");
    const imagePath = URL.createObjectURL(file);

    image.attr("src", imagePath);
    image.attr("alt", file.name);

    const fileInfo = {
      origin: file,
      name: file.name,
      path: imagePath,
    };

    // Add the file information to the selectedFiles array
    selectedFiles.push(fileInfo);

    const removeButton = $("<button>")
      .addClass("imageContainer-product-img-button")
      .text("X");

    removeButton.on("click", function () {
      // Find the parent container of the button (which is the div)
      const container = $(this).parent();

      // Remove the container from the imageContainer
      container.remove();

      // Remove the file information from the selectedFiles array
      const index = selectedFiles.findIndex((item) => item.path === imagePath);
      if (index !== -1) {
        selectedFiles.splice(index, 1);
      }

      // Optionally, you can also remove the file from the input field
      $("#fileInput").val(null);

      // Log the updated selectedFiles array
      console.log(selectedFiles);
    });

    const container = $("<div>")
      .addClass("col col-3 w-100 h-100")
      .css("position", "relative");
    container.append(image);
    container.append(removeButton);

    imageContainer.append(container);
  }

  // Log the final selectedFiles array
  console.log(selectedFiles);
}

var colors = {
  0: "primary",
  1: "success",
  2: "warning",
  3: "secondary",
  4: `danger`,
  5: "info",
  6: "dark",
};

var options = [];
GetAPI("/admin/products/category/indexJson", (data) => {
  const Trees = buildMenu(data, null);
  function buildMenu(datas, parentId, level = 0) {
    let submenu = datas.data.filter(
      (item) => item.parentCategoryId === parentId
    );
    if (submenu.length > 0) {
      var object = {};
      submenu.forEach((item) => {
        let s = " . . . ";
        for (let i = 0; i < level; i++) {
          s += " . . . ";
        }
        object = {
          value: item.id,
          text: s.concat(item.title),
          classes: `bg-${colors[level]} text-white rounded my-1 mx-2`,
        };
        let ob = buildMenu(datas, item.id, level + 1);
        options.unshift(object);
      });
      return object;
    }
  }
  $("#multiple").multipleSelect({
    data: options,
    animate: "slide",
    single: true,
    filter: true,
    placeholder: "Yêu cầu chọn danh mục sản phẩm (*)",
  });
});
var fileName;
$("#fileInput").change(function () {
  fileName = $(this).val().split("\\").pop();
  console.log(fileName);
  $(".label-s").text(fileName || "Tùy chỉnh");
  var selectedFile = this.files[0];
  if (selectedFile) {
    // Hiển thị hình ảnh preview
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#previewImage").attr("src", e.target.result);
    };
    reader.readAsDataURL(selectedFile);
  } else {
    // Nếu không có tệp nào được chọn, đặt src của hình ảnh preview thành trống
    $("#previewImage").attr("src", "/images/loader.gif");
  }
});
var editor = new FroalaEditor("#Editor", {
  charCounterCount: false,
  attribution: false,
  heightMin: 50,
  heightMax: 200,
  // events: {
  //     'initialized': function () {
  //             var editor = this;
  //             // editor.html.set(params.content);
  //     }
  // }
});
// $(document).on("click", ".form-submit", function () {
//   var dataInput = {};

//   dataInput.ListImage = selectedFiles.map((e) => e.origin);
//   console.log(dataInput);
//   PostAPI(
//     "/admin/products/CreateJson",
//     dataInput,
//     (data) => {
//       if (data.code === 500) {
//         toast({
//           title: "Tồn tại",
//           type: "error",
//           message: data.data,
//         });
//       } else if (data.code === 200) {
//         toast({
//           title: "Thông báo",
//           type: "success",
//           message: "Thêm sản phẩm thành công",
//         });
//         // setTimeout(() => window.location.href = "/admin/products/index", 1000)
//       }
//     },
//     0
//   );
// });
Validate("#Create", (dataInput) => {
  dataInput.CategoryIDs = [
    +$("#multiple").multipleSelect("getSelects") === 0
      ? null
      : +$("#multiple").multipleSelect("getSelects"),
  ];
  var isChecked = $("#check").is(":checked");
  dataInput.Status = isChecked === true ? 1 : 0;
  dataInput.Image = $("#fileInput")[0].files[0];
  dataInput.Discription = editor.html.get();
  
  dataInput.ListImage = selectedFiles.map(e=> e.origin);

  console.log(dataInput);

  PostAPI('/admin/products/CreateJson', dataInput, (data) => {

      if (data.code === 500) {
          toast({
              title: "Tồn tại",
              type: 'error',
              message: data.data
          })
      } else if (data.code === 200) {
          toast({
              title: "Thông báo",
              type: 'success',
              message: "Thêm sản phẩm thành công"
          })
          setTimeout(() => window.location.href = "/admin/products/index", 1000)
      }
  }, 0)
});
