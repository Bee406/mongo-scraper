
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class = 'row'><div class = 'col-sm-8 align-self-center'><h2><a href='" + data[i].url + "'>" + data[i].headline + "</a></h2><p>" + data[i].summary + "</p><button id = 'notesBtn' type='button' class='btn btn-primary' data-toggle='modal' data-target = '#articleNotes' data-id = '" + data[i]._id + "'> Article Notes </button></div><div class = 'col-sm-4'><img src = '"+ data[i].photoLink + "'/></div></div></br>");
    }
  });
  
  

  $(document).on("click", "#notesBtn", function() {
       
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {

        $(".articleName").html(data.headline);
        $(".articlePhoto").html("<img src = '"+ data.photoLink + "'/>");
        $(".modal-body").append("<h4> Comments </h4>" + data.comments);
        // An input to enter a new title
        $(".modal-body").append("<input id='titleinput' name='title' placeholder = 'Note Title' >");
        // A textarea to add a new note body
        $(".modal-body").append("<textarea id='bodyinput' name='body' placeholder = 'Note Body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".modal-footer").html("<button data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button>");
  
      });
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
        title: $("#titleinput").val().trim(),
        // Value taken from note textarea
        body: $("#bodyinput").val().trim(),
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log("New comment: ", data);
      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
