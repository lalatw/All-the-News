  // When click the save article button
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


 // When click the unsave article button
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
  
   // When click the scrape artible button
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

  // $(document).on("click", ".allNotes", function(event) {
  //   event.preventDefault();
  //   $.ajax({
  //     method: "GET",
  //     url: "/api/notes/"
  //   }).then(
  //     function(data) {
  //       console.log(data);
  //       location.reload();
  //     }
  //   );

  // });

 // When click the clear article button
  $(document).on("click", ".clearBtn", function(event) {
    event.preventDefault();
    $.ajax({
      method: "GET",
      url: "/api/clear/"
    }).then(
      //after clear the data from database, there's an error message about UnhandledPromiseRejectionWarning
      //right now it will need to refresh the page on browser to show the empty container
      function() {
        console.log(data);
        $("#mainwrapper").empty();
        $("#mainwrapper").val("");
        location.reload();
      })
  });


 // When click the saved article note button
 // This part is still buggy. A user has to keep clicking the button to see data shown.
$(document).on("click", ".noteBtn", function(event) {
  event.preventDefault();
  var thisId = $(this).data("id");

  // Send the GET request.
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(
    function(data) {
      $(".noteList").toggle();
      $(".titleToShow").empty();
      $(".titleToShow").text(data.title);
      $(".titleToShow").attr("value", thisId);

      if (data.note) {
        // Place the body of the note in the body textarea
        $(".notesbody").text(data.note.body);
        // $(".noteList").append('<li class="noteList list-group mb-3"><div><h6>' + data.note.body + '</h6></div><span><button type="submit" class="btn btn-secondary">X</button></span></li>');
      }
      
      
    }
  );  

});


 // When click the submit note button
$(document).on("click", ".noteSubmitBtn", function(event) {
  event.preventDefault();
  var thisId = $(".titleToShow").attr("value");
  console.log(thisId);
  var newNote = {
    body: $("#noteInput").val().trim(),
  };

  // Send the POST request.
  $.ajax({
    method: "POST",
    url: "/api/notes/" + thisId,
    data: newNote
  }).then(
    function(sendData) {
      console.log(sendData);
      $("#noteInput").val("");
    }
  );

});



