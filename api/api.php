<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('content-type: application/json; charset=utf-8');

require_once 'config.php';
require_once 'db_functions.php';

$email = $_POST['email'] ?? null;
$password = $_POST['password'] ?? null;
$name = $_POST['name'] ?? null;
$action = $_POST['action'] ?? null;
$arr = array(
    "message" => "Something went wrong!",
    "error" => "no"
);
if(notNull($email) && notNull($password) && notNull($action)){  
    if(is_email($email)){
        if($action === 'signin'){
            if(is_registered($email, $password)){
                $arr['message'] = "You've been logged in Successfully!";
                $arr['username'] = get_username($email);
                $arr['error'] = "ok";
            }else if(exists($email, $password)){
                $arr['message'] = "Account not yet verified!";
            }else if(verified($email) || exist_awaiting($email, $password)){
                $arr['message'] = "Your password is invalid, please try again";
            }else{
                $arr['message'] = "No account is associated with this address!";
            }
        }else if($action === 'signup' && notNull($name) && trim($name) !== ''){
            if(verified($email) || exists($email, $password)){
                $arr['message'] = "Account with the email {$email} already exists!";
            }else{
                $token = md5(uniqid());
                if(send_verification($email, $name, $token)){
                    register($email, $password, $token, $name);
                    $arr['message'] = "You've been registered Successfully!";
                    $arr['error'] = "ok";
                }
            }
        }
    }else{
        $arr['message'] = "Email in invalid!";
    }
}else{
    $arr['message'] = "Something went wrong!";
}

echo json_encode($arr);
?>