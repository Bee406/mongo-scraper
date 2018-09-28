$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<div class = 'row'><div class = 'col-sm-8 align-self-center'><h2><a href='" + data[i].url + "'>" + data[i].headline + "</a></h2><p>" + data[i].summary + "</p><button id = 'notesBtn' data-toggle='modal' data-target = 'articleNotes' data-id = '" + data[i]._id + "'> Article Notes </button></div><div class = 'col-sm-4'><img src = '"+ data[i].photoLink + "'/></div></div></br>");
    }
  });
  
  

  $(document).on("click", "#notesBtn", function() {

    $("#articleNotes").empty();
   
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#articleName").append("<h2>" + data.headline + "</h2>");
        $("#articlePhoto").append("<img src = '"+ data.photoLink + "'/>");
        // An input to enter a new title
        $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".modal-footer").append("<button data-id='" + data._id + "' id='savenote' data-dismiss='modal'>Save Note</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
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
  