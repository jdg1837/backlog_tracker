$(document).ready(function() {
    // We load the table whenever the page is loaded
    read_db();
    
    // Reads from db and fills table. Adds button with dropdown options to update and delete
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
                <a class="dropdown-item" id="editlink"" href="#">Edit</a>
                <a class="dropdown-item" id="deletelink" href="#">Delete</a>
                <div>
              </div>`
            } ]
        } );
    }

    // Supercedes new entry form submittal to send it to server with AJAX
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

    // Supercedes new entry form submittal to send it to server with AJAX
    $("#submitForm").click(function(){
        var file = $('#file')[0].files[0];

        if(file != undefined){
            var image_data = new FormData();
            image_data.append('file',file);
            var filename = file['name'];

            $.ajax({
                url: 'upload_file.php',
                type: 'post',
                data: image_data,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response != 0){
                        $("#img").attr("src",response); 
                    }else{
                        alert('file not uploaded');
                    }
                },
            });
            
            $('#image_name').val(filename);
        }

        $.ajax({
            type: "POST",
            url: 'add_records.php',
            data: $('#addNewForm').serialize(), // serializes the form's elements.
            success: function(d)
            {
                $('#addNewModal').modal('hide');
                $('#addNewForm').trigger("reset");
                read_db();
            }
        });
      });

    // Supercedes editing form submittal to send it to server with AJAX
    $("#editOldForm").submit(function(e) {

        e.preventDefault();
    
        $.ajax({
            type: "POST",
            url: $(this).attr('action'),
            data: $(this).serialize(), // serializes the form's elements.
            success: function(data)
            {
                $('#editOldModal').modal('hide');
                $('#editOldForm').trigger("reset");
                read_db();
            }
        });
        });

    // Action upon chosing to update a row: open editing modal prefilled with current values
    $("#trackertable").on('click', '#editlink', function(e){

        e.stopPropagation();
        e.stopImmediatePropagation();

        var table = $('#trackertable').DataTable();
        var row_data = table.row( $(this).parents('tr') ).data();

        var id = row_data[1];
        var tool_name = row_data[3];
        var type = row_data[4];
        var description = row_data[5];
        var priority = row_data[6];
        var tester = row_data[7];
        var image_name = row_data[11];
        var status = row_data[12];

        $('#id2').val(id);
        $('#tool_name2').val(tool_name);
        $('#type2').val(type);
        $('#description2').val(description);
        $('#priority2').val(priority);
        $('#tester2').val(tester);
        $('#image_name2').val(image_name);
        $('#status2').val(status);

        $('#editOldModal').modal('show');
    });

    // Action upon chosing to delete a row: order server to delete entry with that id
    $("#trackertable").on('click', '#deletelink', function(e){

        e.stopPropagation();
        e.stopImmediatePropagation();

        var table = $('#trackertable').DataTable();
        var row_data = table.row( $(this).parents('tr') ).data();

        var id = row_data[1];

        $.ajax({
            type: "POST",
            url: "delete_records.php",
            data: {id: id},
            success: function(data)
            {
                read_db();
            }
        });
    });

    $("#but_upload").click(function(){
        var fd = new FormData();
        var files = $('#file')[0].files[0];
        fd.append('file',files);

        $.ajax({
            url: 'upload_file.php',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false,
            success: function(response){
                if(response != 0){
                    $("#img").attr("src",response); 
                }else{
                    alert('file not uploaded');
                }
            },
        });
    });
} );