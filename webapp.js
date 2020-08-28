$(document).ready(function() {
    // We load the table whenever the page is loaded, and set user to John Doe
    $('#username').text("John Doe");
    read_db();

    // Drag over upload area
    $('.uploadbox').on('dragover', function (e) {
        e.stopPropagation();
        e.preventDefault();
    });

    // Drop image on upload area
    $('.uploadbox').on('drop', function (e) {
        e.stopPropagation();
        e.preventDefault();
        var file_form = $('#file');
        var file_in = e.originalEvent.dataTransfer.files;
        file_form[0].files = file_in;
        update_image_name()
    });

    // Open file selector when clicking link to chose an image
    $("#uploadlink").click(function(){
        $('#file').click();
    });

    // Update name box whenever a new image is added
    $('#file').on('change', function(){
        update_image_name()
    });

    // Fill name box
    function update_image_name(){
        var file = $('#file');
        if(file){
            var file1 = file[0].files[0];
            $('#image_name').val(file1['name']);
        }
    }

    // Reads from db and fills table. Adds button with dropdown options to update and delete
    function read_db(){
        $('#foo').val("read");
        $('#trackertable').DataTable( {
            "processing": true,
            "bDestroy": true,
            
            "ajax": {
                "data": {"foo": "read"},
                "url": "server.php",
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
            },
            {
                "targets": 11,
                "render": function ( data, type, row, meta ) {
                    return '<a target="_blank" rel="noopener noreferrer" href="'+data+'">'+data+'</a>';
                  }
            } 
            ]
        } );
        // $('.imglink' span).each(function(i, obj) {
        //     obj.children()
        // });
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
                url: 'server.php',
                type: 'post',
                data: image_data,
                contentType: false,
                processData: false,
                success: function(response){
                    if(response != 0){
                        $('#image_name').val(response);
                    }
                    else{
                        $('#image_name').val('');
                    }
                    update_db();
                }
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
        var url = "server.php"
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
        $('#foo').val("add");
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
        $('#foo').val("edit");

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
        var foo = "del";
        $('#deleteModal').modal('hide');

        $.ajax({
            type: "POST",
            url: "server.php",
            data: {id: id, foo:foo},
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