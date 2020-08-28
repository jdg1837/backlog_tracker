$(document).ready(function() {
    // We load the table whenever the page is loaded
    $('#username').text("John Doe");
    read_db();
    initialize_up_widget();

    function initialize_up_widget(){
        var image_loader = $('#fileupload'); //file input 
        //initialize blueimp fileupload plugin
        image_loader.fileupload({
            url: 'upload_file.php',
            dataType: 'json',
            autoUpload: false,
            acceptFileTypes: /(\.|\/)(jpg|jpeg|png)$/i,
            // maxFileSize: 1048576, //1MB
            dropZone: $('#dropzone')
        });
    }
    
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
                <a class="dropdown-item" id="editlink" href="#">Edit</a>
                <a class="dropdown-item" id="deletelink" href="#">Delete</a>
                <div>
              </div>`
            } ]
        } );
    }

    // Refresh forms and clear all fields when the modal gets dismissed
    $('#formModal').on('hidden.bs.modal', function () {
        $('#entryForm').trigger("reset");
        $('#imageForm').trigger("reset");
        $('#image_name').val('');
    });

    // When form is submitted, the image (if any) gets updated first, then the form data
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
                        $('#image_name').val(filename);
                        update_db();
                    }
                },
            });
        }
        else{
            update_db();
        }     
    });

    // Form gets sent to server, for entry addition or editing, depending on formType attr
    function update_db(){
        $('#requested_by').val($('#username').text());
        var formType = $('#formType').val();
        var url = "add_records.php";
        if (formType == "edit"){
            url = "edit_records.php"
        }
        $.ajax({
            type: "POST",
            url: url,
            data: $('#entryForm').serialize(), // serializes the form's elements.
            success: function(d)
            {
                $('#formModal').modal('hide');
                read_db();
            }
        });
    }

    // Callback on button to add new item. Sets modal on new entry mode and opens it up
    $("#addNewModal").click(function(e){
        $('#formType').val("new");
        $('#formModal').modal('show');
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

        $('#id').val(id);
        $('#tool_name').val(tool_name);
        $('#type').val(type);
        $('#description').val(description);
        $('#priority').val(priority);
        $('#tester').val(tester);
        $('#image_name').val(image_name);
        $('#status').val(status);
        $('#formType').val("edit");

        $('#formModal').modal('show');
    });

    // Action upon chosing to delete a row: set that row's id as the one to delete, and trigger confirmation modal
    $("#trackertable").on('click', '#deletelink', function(e){

        e.stopPropagation();
        e.stopImmediatePropagation();

        var table = $('#trackertable').DataTable();
        var row_data = table.row( $(this).parents('tr') ).data();

        var id = row_data[1];
        $('#deleteid').val(id)
        $('#deleteModal').modal('show');
    });

    // When user confirms row deletion, hide the modal and order the delete from the server
    $("#confirmDelete").click(function(e){
        e.stopPropagation();
        e.stopImmediatePropagation();

        var id = $('#deleteid').val();
        $('#deleteModal').modal('hide');

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

    // Open log-in modal when prompted
    $("#userlink").click(function(e){

        e.stopPropagation();
        e.stopImmediatePropagation();

        $('#userModal').modal('show');
    });

    // Refresh forms and clear all fields when the modal gets dismissed
    $('#userModal').on('hidden.bs.modal', function () {
        $('#userEnter').trigger("reset");
    });

    $("#submitUser").click(function(){
        var user = $('#username_in').val();
        $('#username').text(user);
        $('#userModal').modal('hide');
    });
} );