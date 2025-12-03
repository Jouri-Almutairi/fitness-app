<?php
/**
 * User Registration API
 * ======================
 * تسجيل مستخدم جديد
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
    empty($data->name) ||
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
$name = htmlspecialchars(strip_tags($data->name));
$email = htmlspecialchars(strip_tags($data->email));
$password = $data->password;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Please enter a valid email address"
    ]);
    exit();
}

// Validate password length
if (strlen($password) < 6) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Password must be at least 6 characters"
    ]);
    exit();
}

// Check if email already exists
$checkQuery = "SELECT id FROM users WHERE email = :email";
$checkStmt = $db->prepare($checkQuery);
$checkStmt->bindParam(":email", $email);
$checkStmt->execute();

if ($checkStmt->rowCount() > 0) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Email is already registered"
    ]);
    exit();
}

// Hash password
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

// Insert new user
$query = "INSERT INTO users (name, email, password) VALUES (:name, :email, :password)";
$stmt = $db->prepare($query);

$stmt->bindParam(":name", $name);
$stmt->bindParam(":email", $email);
$stmt->bindParam(":password", $hashedPassword);

try {
    if ($stmt->execute()) {
        $userId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Account created successfully",
            "user" => [
                "id" => $userId,
                "name" => $name,
                "email" => $email,
                "createdAt" => date('Y-m-d H:i:s')
            ]
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Registration failed: " . $e->getMessage()
    ]);
}
?>