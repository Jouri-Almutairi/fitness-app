<?php
/**
 * Remove from Favorites API
 * ==========================
 * حذف تمرين من المفضلة
 */

// Include database connection
require_once '../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get DELETE data
$data = json_decode(file_get_contents("php://input"));

// Validate input
if (
    empty($data->user_id) ||
    empty($data->exercise_id)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID and exercise ID are required"
    ]);
    exit();
}

// Sanitize input
$userId = (int)$data->user_id;
$exerciseId = htmlspecialchars(strip_tags($data->exercise_id));

// Check if favorite exists
$checkQuery = "SELECT id FROM favorites WHERE user_id = :user_id AND exercise_id = :exercise_id";
$checkStmt = $db->prepare($checkQuery);
$checkStmt->bindParam(":user_id", $userId);
$checkStmt->bindParam(":exercise_id", $exerciseId);
$checkStmt->execute();

if ($checkStmt->rowCount() == 0) {
    http_response_code(404);
    echo json_encode([
        "success" => false,
        "message" => "Favorite not found"
    ]);
    exit();
}

// Delete from favorites
$query = "DELETE FROM favorites WHERE user_id = :user_id AND exercise_id = :exercise_id";
$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $userId);
$stmt->bindParam(":exercise_id", $exerciseId);

try {
    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode([
            "success" => true,
            "message" => "Removed from favorites successfully"
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to remove favorite: " . $e->getMessage()
    ]);
}
?>