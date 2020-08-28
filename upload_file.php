<?php
$filename = $_FILES['file']['name'];

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