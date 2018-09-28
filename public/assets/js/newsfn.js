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



$(document).on("click", ".noteBtn", function(event) {
  event.preventDefault();
  var thisId = $(this).data("id");
  console.log("id"+thisId);
  // Send the POST request.
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(
    function() {
      $("#noteList").style.visibility = "visible";
    }
  );  

});

$(document).on("click", ".noteSubmitBtn", function(event) {
  event.preventDefault();
  var thisId = $(this).data("id");
  var newNote = {
    body: $("#noteInput").val().trim(),
  };
  console.log("id"+thisId);
  // Send the POST request.
  $.ajax({
    method: "POST",
    url: "/api/notes" + thisId,
    data: newNote
  }).then(
    function(sendData) {
      console.log(sendData);
      $("#noteInput").empty()
    }
  );

});






// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});



})

