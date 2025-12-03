<?php
/**
 * User Login API
 * ===============
 * تسجيل دخول المستخدم
 */

// Include database connection
require_once '../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get POST data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    empty($data->email) ||
    empty($data->password)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please fill in all fields"
    ]);
    exit();
}

// Sanitize input
$email = htmlspecialchars(strip_tags($data->email));
$password = $data->password;

// Find user by email
$query = "SELECT id, name, email, password, created_at FROM users WHERE email = :email";
$stmt = $db->prepare($query);
$stmt->bindParam(":email", $email);
$stmt->execute();

// Check if user exists
if ($stmt->rowCount() == 0) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
    exit();
}

// Get user data
$user = $stmt->fetch(PDO::FETCH_ASSOC);

// Verify password
if (!password_verify($password, $user['password'])) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email or password"
    ]);
    exit();
}

// Login successful - return user data (without password)
http_response_code(200);
echo json_encode([
    "success" => true,
    "message" => "Login successful",
    "user" => [
        "id" => $user['id'],
        "name" => $user['name'],
        "email" => $user['email'],
        "createdAt" => $user['created_at']
    ]
]);
?>