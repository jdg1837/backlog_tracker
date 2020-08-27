function read_db(){
    $('#tracker-table').DataTable( {
        "processing": true,
        "ajax": {
            "url": "read_records.php",
            "type": "POST"
        }
    } );
}


$(document).ready(function() {
   read_db();
} );

$("#addNewForm").submit(function(e) {

    e.preventDefault();
    
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(), // serializes the form's elements.
        success: function(data)
        {
            $('#addNewModal').modal('hide');
            //read_db();
        }
    });
  });