<?php


require_once 'config.php';
require_once 'db_functions.php';

$email = $_GET['email'] ?? null;
$token = $_GET['token'] ?? null;

if(notNull($email) && notNull($token)){
    if(verify_account($email, $token)){
        header('Location: http://salim-streamly.000webhostapp.com/verified.html');
    }else{
        echo "<h2>Something went wrong!</h2?";
    }
}
?>