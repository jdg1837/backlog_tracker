$("#addNewForm").submit(function(e) {

    e.preventDefault();
    
    $.ajax({
           type: "POST",
           url: $(this).attr('action'),
           data: $(this).serialize(), // serializes the form's elements.
           success: function(data)
           {
            $('#addNewModal').modal('hide')
           }
         });
  });