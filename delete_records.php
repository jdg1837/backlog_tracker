<?php

if($_POST)
{
    // Get input values
    $id = $_POST['id'];

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
        $query = "DELETE FROM back_log WHERE id = $id";

        if (!$conn->query($query)){
            echo "Error: ". $conn->errorInfo()[0];
        }
    }

}

?>