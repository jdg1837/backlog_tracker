<?php

if($_POST)
{
    // Get input values
    $id = $_POST['id'];
    $tool_name = $_POST['tool_name'];
    $type = $_POST['type'];
    $description = $_POST['description'];
    $priority = $_POST['priority'];
    $tester = $_POST['tester'];
    $image_name = $_POST['image_name'];
    $status = $_POST['status'];
    
    // Databse metadata
    $host = "localhost";
    $dbusername = "root";
    $dbpassword = "";
    $dbname = "backlog";

    // Create connection
    $conn = new PDO('mysql:host='.$host.';dbname='.$dbname, 
                    $dbusername, $dbpassword);
                    
    // Check connection
    if(!$conn) {
        die("Connection failed");
    }
    else {
        $query =   "UPDATE back_log
                    SET tool_name = '$tool_name',
                        type = '$type',
                        description = '$description',
                        priority = '$priority',
                        tester = '$tester',
                        image_name = '$image_name',
                        date_closed = 
                        ( CASE  
                            WHEN (status != 'Closed') AND ('$status') = 'Closed' THEN NOW()
                            WHEN (status = 'Closed') AND ('$status') != 'Closed' THEN NULL 
                            ELSE  (date_closed)
                        END ),
                        status = '$status'
                    WHERE id = $id";

        if (!$conn->query($query)){
            echo "Error: ". $conn->errorInfo()[0];
        }
    }

}

?>