<?php
define('USER', '');
define('PASS', '');
error_reporting(0);
try{
    $conn = new PDO('mysql:host=localhost;dbname=DB-NAME-HERE', USER, PASS);
}catch(PDOException $e){
    echo "Error Connecting to the Database!";
    exit();
}


?>