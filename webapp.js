$(document).ready(function() {
    // We load the table whenever the page is loaded
    read_db();
    
    // Reads from db and fills table. Adds options to update and delete
    function read_db(){
        $('#trackertable').DataTable( {
            "processing": true,
            "bDestroy": true,
            "ajax": {
                "url": "read_records.php",
                "type": "POST"
            },
            "columnDefs": [ {
                "targets": 0,
                "data": null,
                "defaultContent": `<div class="dropdown">
                <button class="btn btn-primary btn-xs dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">...</button>
                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <a class="dropdown-item" id = editlink" href="#">Edit</a>
                <a class="dropdown-item" id = "deletelink" href="#">Delete</a>
                <div>
              </div>`
            } ]
        } );
    }

    // Supercedes form submittal to send it to server with AJAX
    $("#addNewForm").submit(function(e) {

        e.preventDefault();
    
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                $('#addNewModal').modal('hide');
                $('#addNewForm').trigger("reset");
                read_db();
            }
        });
      });

    //   $('#trackertable tbody').on( 'click', 'button', function () {
    //     //alert(555);
    //     var table = $('#trackertable').DataTable();
    //     var data = table.row( $(this).parents('tr') ).data();
        
    // } );

    // Action upon chosing to delete a row
    $("#trackertable").on('click', '#deletelink', function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();
        var table = $('#trackertable').DataTable();
        var data = table.row( $(this).parents('tr') ).data();
        alert(data[1]);
    });
} );