<?php
class Server {
    // Databse metadata
    private $host = "localhost";
    private $dbusername = "root";
    private $dbpassword = "";
    private $dbname = "backlog";
    private $query;
    private $conn;

    function __construct() {
        $this->conn = new PDO('mysql:host='.$this->host.';dbname='.$this->dbname, 
        $this->dbusername, $this->dbpassword);

        // Check connection
        if(!$this->conn) {
            die("Connection failed");
        }
    }

    // Methods
    function set_name($name) {
    $this->name = $name;
    }
    function get_name() {
    return $this->name;
    }

    function read(){
        $table = 'back_log';
        $primaryKey = 'id';

        $columns = array(
                    array( '',     'dt' => 0 ),
                    array( 'db' => 'id', 'dt' => 1 ),
                    array( 'db' => 'requestor_id',  'dt' => 2 ),
                    array( 'db' => 'tool_name',   'dt' => 3 ),
                    array( 'db' => 'type',     'dt' => 4 ),
                    array( 'db' => 'description', 'dt' => 5 ),
                    array( 'db' => 'priority',  'dt' => 6 ),
                    array( 'db' => 'tester',   'dt' => 7 ),
                    array( 'db' => 'date_filed', 'dt' => 8 ),
                    array( 'db' => 'date_closed',  'dt' => 9 ),
                    array( 'db' => 'fix_confirm',   'dt' => 10 ),
                    array( 'db' => 'image_name',     'dt' => 11 ),  
                    array( 'db' => 'status',     'dt' => 12 )
        );

        $sql_details = array(
            'user' => $this->dbusername,
            'pass' => $this->dbpassword,
            'db'   => $this->dbname,
            'host' => $this->host
        );

        require( 'ssp.class.php' );
    
        echo json_encode(
            SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
        );
    }

    function add($requestor_id, $tool_name, $type, $description, $priority, $tester, $image_name, $status){
        if($status == "Closed"){
            $this->query .= "INSERT INTO back_log (requestor_id, tool_name, type, description, priority, tester, image_name, status, date_filed, date_closed, fix_confirm)
            values ('$requestor_id','$tool_name','$type', '$description', '$priority', '$tester', '$image_name', '$status', NOW(), NOW(), 1)";
        }
        elseif($status == "Completed"){
            $this->query .= "INSERT INTO back_log (requestor_id, tool_name, type, description, priority, tester, image_name, status, date_filed, fix_confirm)
            values ('$requestor_id','$tool_name','$type', '$description', '$priority', '$tester', '$image_name', '$status', NOW(), 1)";
        } 
        else{
            $this->query .= "INSERT INTO back_log (requestor_id, tool_name, type, description, priority, tester, image_name, status, date_filed, fix_confirm)
            values ('$requestor_id','$tool_name','$type', '$description', '$priority', '$tester', '$image_name', '$status', NOW(), 0)";
        } 

        $this->connect();
    }

    function edit($tool_name, $type, $description, $priority, $tester, $image_name, $status, $id){
        $this->query =   "UPDATE back_log
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
                        fix_confirm = 
                        ( CASE  
                            WHEN (status != 'Closed') AND ('$status') = 'Closed' THEN 1
                            WHEN (status != 'Completed') AND ('$status') = 'Completed' THEN 1
                            WHEN ((status = 'Closed') OR (status = 'Completed')) AND (('$status') != 'Closed') AND (('$status') != 'Completed') THEN 0
                            ELSE  (fix_confirm)
                        END ),
                        status = '$status'
                    WHERE id = $id";

        $this->connect();
    }

    function del($id){
        $this->query = "DELETE FROM back_log WHERE id = $id";
        $this->connect();
    }

    function upload($filename){
        $location = "images/".$filename;
        $extension = pathinfo($location,PATHINFO_EXTENSION);
        $valid_extensions = array("jpg","jpeg","png");

        if( in_array(strtolower($extension),$valid_extensions) ) 
        {
            if(move_uploaded_file($_FILES['file']['tmp_name'],$location))
            {
                echo $location;
            }
            else
            {
                echo 0;
            }
        }
        else
        {
            echo 0;
        }
    }

    function connect(){
        if (!$this->conn->query($this->query)){
            echo "Error: ". $this->conn->errorInfo()[0];
        }
    }
}

error_reporting(error_reporting() & ~E_NOTICE);


// Get input values
$foo = $_POST['foo'];

$sv = new Server();

if ($foo == "read"){
    $sv->read();
}

else{
    $id = $_POST['id'];
    $tool_name = $_POST['tool_name'];
    $type = $_POST['type'];
    $description = $_POST['description'];
    $priority = $_POST['priority'];
    $tester = $_POST['tester'];
    $image_name = $_POST['image_name'];
    $status = $_POST['status'];
    $requestor_id = $_POST['requested_by'];
    $filename = $_FILES['file']['name'];

    if ($foo == "add"){
        $sv->add($requestor_id,$tool_name,$type, $description, $priority, $tester, $image_name, $status);
    }
    elseif ($foo == "edit"){
        $sv->edit($tool_name, $type, $description, $priority, $tester, $image_name, $status, $id);
    }
    elseif ($foo == "del"){
        $sv->del($id);
    }
    elseif ($filename){
        $sv->upload($filename);
    }
}

?>