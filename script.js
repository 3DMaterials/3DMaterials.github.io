function addData() {
    // Get the selected values from the dropdowns
    var process = document.getElementById("process_menu").value;
    var material = document.getElementById("material_menu").value;
    var brand = document.getElementById("brand_menu").value;
  
    // Add the shape to the page
    var shapeContainer = document.getElementById("line_list");
    shapeContainer.innerHTML +='<p>Sample Test</p>'
  }