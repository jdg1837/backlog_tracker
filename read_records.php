<?php



header('Set-Cookie: cross-site-cookie=name; SameSite=None; Secure');
    $table = 'back_log';

    $primaryKey = 'id';

    $columns = array(
        array( 'db' => 'id', 'dt' => 0 ),
        array( 'db' => 'requestor_id',  'dt' => 1 ),
        array( 'db' => 'tool_name',   'dt' => 2 ),
        array( 'db' => 'type',     'dt' => 3 ),
        array( 'db' => 'description', 'dt' => 4 ),
        array( 'db' => 'priority',  'dt' => 5 ),
        array( 'db' => 'tester',   'dt' => 6 ),
        array( 'db' => 'date_filed', 'dt' => 7 ),
        array( 'db' => 'date_closed',  'dt' => 8 ),
        array( 'db' => 'fix_confirm',   'dt' => 9 ),
        array( 'db' => 'image_name',     'dt' => 10 ),  
        array( 'db' => 'status',     'dt' => 11 ),        
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