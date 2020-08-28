<?php

if($_POST)
{
    // Get input values
    $tool_name = $_POST['tool_name'];
    $type = $_POST['type'];
    $description = $_POST['description'];
    $priority = $_POST['priority'];
    $tester = $_POST['tester'];
    $image_name = $_POST['image_name'];
    $status = $_POST['status'];
    $requestor_id = "John Doe";

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
        $query = "";

        if($status == "Closed"){
            $query .= "INSERT INTO back_log (requestor_id, tool_name, type, description, priority, tester, image_name, status, date_filed, date_closed)
            values ('$requestor_id','$tool_name','$type', '$description', '$priority', '$tester', '$image_name', '$status', NOW(), NOW())";
        }
        else{
            $query .= "INSERT INTO back_log (requestor_id, tool_name, type, description, priority, tester, image_name, status, date_filed)
            values ('$requestor_id','$tool_name','$type', '$description', '$priority', '$tester', '$image_name', '$status', NOW())";
        } 

        if (!$conn->query($query)){
            echo "Error: ". $conn->errorInfo()[0];
        }
    }

}

?>