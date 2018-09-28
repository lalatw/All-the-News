$(function() {
  // When you click the savenote button
  $(document).on("click", ".saveBtn", function(event) {
    event.preventDefault();
    var thisId = $(this).data("id");
    console.log("id"+thisId);
    // Send the POST request.
    $.ajax({
      method: "POST",
      url: "/api/saved/" + thisId
    }).then(
      function(data) {
        console.log(data);
        location.reload();
      }
    );

  });



  $(document).on("click", ".unSaveBtn", function(event) {
    event.preventDefault();
    var thisId = $(this).data("id");
    console.log("id"+thisId);
    // Send the POST request.
    $.ajax({
      method: "POST",
      url: "/api/unsaved/" + thisId
    }).then(
      function(data) {
        console.log(data);
        location.reload();
      }
    );

  });
  
  $(document).on("click", ".scrapeBtn", function(event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/api/scrape/"
    }).then(
      function(data) {
        console.log(data);
        location.reload();
      }
    );

  });


  $(document).on("click", ".clearBtn", function(event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/api/clear/"
    }).then(
      function(data) {
        console.log(data);
        location.reload();
      }
    );

  });

})

