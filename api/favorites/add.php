<?php
/**
 * Add to Favorites API
 * =====================
 * إضافة تمرين للمفضلة
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
    empty($data->user_id) ||
    empty($data->exercise_id) ||
    empty($data->exercise_name)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "User ID, exercise ID, and exercise name are required"
    ]);
    exit();
}

// Sanitize input
$userId = (int)$data->user_id;
$exerciseId = htmlspecialchars(strip_tags($data->exercise_id));
$exerciseName = htmlspecialchars(strip_tags($data->exercise_name));
$bodyPart = isset($data->body_part) ? htmlspecialchars(strip_tags($data->body_part)) : '';
$target = isset($data->target) ? htmlspecialchars(strip_tags($data->target)) : '';
$equipment = isset($data->equipment) ? htmlspecialchars(strip_tags($data->equipment)) : '';
$gifUrl = isset($data->gif_url) ? htmlspecialchars(strip_tags($data->gif_url)) : '';

// Check if already in favorites
$checkQuery = "SELECT id FROM favorites WHERE user_id = :user_id AND exercise_id = :exercise_id";
$checkStmt = $db->prepare($checkQuery);
$checkStmt->bindParam(":user_id", $userId);
$checkStmt->bindParam(":exercise_id", $exerciseId);
$checkStmt->execute();

if ($checkStmt->rowCount() > 0) {
    http_response_code(409);
    echo json_encode([
        "success" => false,
        "message" => "Exercise is already in favorites"
    ]);
    exit();
}

// Insert into favorites
$query = "INSERT INTO favorites (user_id, exercise_id, exercise_name, body_part, target, equipment, gif_url) 
          VALUES (:user_id, :exercise_id, :exercise_name, :body_part, :target, :equipment, :gif_url)";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $userId);
$stmt->bindParam(":exercise_id", $exerciseId);
$stmt->bindParam(":exercise_name", $exerciseName);
$stmt->bindParam(":body_part", $bodyPart);
$stmt->bindParam(":target", $target);
$stmt->bindParam(":equipment", $equipment);
$stmt->bindParam(":gif_url", $gifUrl);

try {
    if ($stmt->execute()) {
        $favoriteId = $db->lastInsertId();
        
        http_response_code(201);
        echo json_encode([
            "success" => true,
            "message" => "Added to favorites successfully",
            "favorite" => [
                "id" => $favoriteId,
                "exerciseId" => $exerciseId,
                "exerciseName" => $exerciseName,
                "bodyPart" => $bodyPart,
                "target" => $target,
                "equipment" => $equipment,
                "gifUrl" => $gifUrl
            ]
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to add favorite: " . $e->getMessage()
    ]);
}
?>