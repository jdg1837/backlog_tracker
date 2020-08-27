<?php



header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
    $table = 'back_log';

    $primaryKey = 'id';
    $button = "echo \"<button>Click!</button>\"";
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
        'user' => 'root',
        'pass' => '',
        'db'   => 'backlog',
        'host' => 'localhost'
    );

    require( 'ssp.class.php' );
 
    echo json_encode(
        SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
    );

?>