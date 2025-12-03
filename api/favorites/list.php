<?php
/**
 * List Favorites API
 * ===================
 * عرض قائمة المفضلة للمستخدم
 */

// Include database connection
require_once '../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get user ID from query parameter
$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;

// Validate input
if (!$userId) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID is required"
    ]);
    exit();
}

// Check if user exists
$userQuery = "SELECT id FROM users WHERE id = :id";
$userStmt = $db->prepare($userQuery);
$userStmt->bindParam(":id", $userId);
$userStmt->execute();

if ($userStmt->rowCount() == 0) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "User not found"
    ]);
    exit();
}

// Get favorites
$query = "SELECT 
            id,
            exercise_id,
            exercise_name,
            body_part,
            target,
            equipment,
            gif_url,
            created_at
          FROM favorites 
          WHERE user_id = :user_id 
          ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $userId);
$stmt->execute();

$favorites = [];

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $favorites[] = [
        "id" => $row['exercise_id'],
        "name" => $row['exercise_name'],
        "bodyPart" => $row['body_part'],
        "target" => $row['target'],
        "equipment" => $row['equipment'],
        "gifUrl" => $row['gif_url'],
        "addedAt" => $row['created_at']
    ];
}

http_response_code(200);
echo json_encode([
    "success" => true,
    "count" => count($favorites),
    "favorites" => $favorites
]);
?>