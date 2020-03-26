<?php
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\SMTP;
    use PHPMailer\PHPMailer\Exception;

    require_once('vendor/autoload.php');
    function exists($email = null, $password = null){
        global $conn;
        $hash = md5($password);
        $stmt = $conn->prepare('SELECT * FROM tbl_awaiting_verf WHERE email = :email AND password = :password');
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hash);
        $stmt->execute();
        if($stmt->rowCount() >0){
            return true;
        }
        return false;
    }

    function verified($email = null){
        global $conn;
        $stmt = $conn->prepare('SELECT * FROM tbl_users WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        if($stmt->rowCount() >0){
            return true;
        }
        return false;
    }
    
    function exist_awaiting($email = null){
        global $conn;
        $stmt = $conn->prepare('SELECT * FROM tbl_awaiting_verf WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        if($stmt->rowCount() >0){
            return true;
        }
        return false;
    }
    
    function get_username($email = null){
        global $conn;
        $stmt = $conn->prepare('SELECT name FROM tbl_users WHERE email = :email');
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row['name'];
    }

    function is_registered($email = null, $password = null){
        global $conn;
        if(!is_email($email)){
            return false;
        }
        $hash = md5($password);
        $stmt = $conn->prepare('SELECT * FROM tbl_users WHERE email = :email AND password = :password LIMIT 1');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':password', $hash, PDO::PARAM_STR);
        $stmt->execute();
        if($stmt->rowCount() === 1){
            return true;
        }
        return false;
    }

    function verify_account($email = null, $token = null){
        global $conn;
        $stmt = $conn->prepare('INSERT INTO tbl_users(name,email,password) SELECT name,email,password FROM tbl_awaiting_verf WHERE email = :email AND token = :token;');
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->execute();
        if($stmt->rowCount() >0){
            $stmt2 = $conn->prepare('DELETE FROM tbl_awaiting_verf WHERE email = :email AND token = :token;');
            $stmt2->bindParam(':email', $email, PDO::PARAM_STR);
            $stmt2->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt2->execute();
            if($stmt2->rowCount() >0){
                return true;
            }
        }
        return false;
    }

    function is_email($email){
        if(filter_var($email, FILTER_VALIDATE_EMAIL)){
            return true;
        }
        return false;
    }

    function notNull($variable){
        if(!is_null($variable)){
            return true;
        }
        return false;
    }

    function register($email = null, $password = null, $token = null, $name = null){
        global $conn;
        $hash = md5($password);
        $stmt = $conn->prepare('INSERT INTO tbl_awaiting_verf(name, email, password, token) VALUES(:name, :email, :password, :token)');
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':password', $hash);
        $stmt->bindParam(':token', $token);
        
        if($stmt->execute()){
            return true;
        }
        return false;
    }

    function send_verification($email = null,$name = 'username', $token = null){
        $mail = new PHPMailer(true);
        try{
            $message = file_get_contents('template.html');
            $message = str_replace('%NAME%', $name, $message);
            $message = str_replace('%TOKEN%', $token, $message);
            $message = str_replace('%EMAIL%', $email, $message);

            $mail->isSMTP();
            $mail->Host       = 'SMTP Host';                    
            $mail->SMTPAuth   = true;                                 
            $mail->Username   = 'USERNAME';                     
            $mail->Password   = 'PASSWORD';                            
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         
            $mail->Port       = 587;                          

            $mail->setFrom('example@domain.com', 'Streamly Platform - Verify your Account');
            $mail->addAddress($email);
            $mail->addReplyTo('example@domain.com', 'My Name');

            $mail->isHTML(true);
            $mail->Subject = 'Verify your Account at Streamly';
            $mail->Body    = $message;

            $mail->send();
            return true;
        }catch (Exception $e) {
            // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            return false;
        }
    }
?>