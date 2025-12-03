<?php
/**
 * User Profile API
 * =================
 * عرض وتحديث الملف الشخصي
 */

// Include database connection
require_once '../config/database.php';

// Initialize database
$database = new Database();
$db = $database->getConnection();

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Handle different methods
switch ($method) {
    case 'GET':
        // Get user profile
        getProfile($db);
        break;
    
    case 'PUT':
        // Update user profile
        updateProfile($db);
        break;
    
    default:
        http_response_code(405);
        echo json_encode([
            "success" => false,
            "message" => "Method not allowed"
        ]);
        break;
}

/**
 * Get User Profile
 */
function getProfile($db) {
    // Get user ID from query parameter
    $userId = isset($_GET['user_id']) ? $_GET['user_id'] : null;
    
    if (!$userId) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "User ID is required"
        ]);
        return;
    }
    
    // Get user data
    $query = "SELECT id, name, email, created_at FROM users WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $userId);
    $stmt->execute();
    
    if ($stmt->rowCount() == 0) {
        http_response_code(404);
        echo json_encode([
            "success" => false,
            "message" => "User not found"
        ]);
        return;
    }
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    // Get favorites count
    $favQuery = "SELECT COUNT(*) as count FROM favorites WHERE user_id = :id";
    $favStmt = $db->prepare($favQuery);
    $favStmt->bindParam(":id", $userId);
    $favStmt->execute();
    $favCount = $favStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    // Get workouts count
    $workQuery = "SELECT COUNT(*) as count FROM workout_plans WHERE user_id = :id";
    $workStmt = $db->prepare($workQuery);
    $workStmt->bindParam(":id", $userId);
    $workStmt->execute();
    $workCount = $workStmt->fetch(PDO::FETCH_ASSOC)['count'];
    
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "user" => [
            "id" => $user['id'],
            "name" => $user['name'],
            "email" => $user['email'],
            "createdAt" => $user['created_at'],
            "favoritesCount" => (int)$favCount,
            "workoutsCount" => (int)$workCount
        ]
    ]);
}

/**
 * Update User Profile
 */
function updateProfile($db) {
    // Get PUT data
    $data = json_decode(file_get_contents("php://input"));
    
    if (empty($data->user_id) || empty($data->name)) {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "User ID and name are required"
        ]);
        return;
    }
    
    $userId = $data->user_id;
    $name = htmlspecialchars(strip_tags($data->name));
    
    // Update user
    $query = "UPDATE users SET name = :name, updated_at = datetime('now') WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":id", $userId);
    
    try {
        if ($stmt->execute()) {
            // Get updated user data
            $selectQuery = "SELECT id, name, email, created_at FROM users WHERE id = :id";
            $selectStmt = $db->prepare($selectQuery);
            $selectStmt->bindParam(":id", $userId);
            $selectStmt->execute();
            $user = $selectStmt->fetch(PDO::FETCH_ASSOC);
            
            http_response_code(200);
            echo json_encode([
                "success" => true,
                "message" => "Profile updated successfully",
                "user" => $user
            ]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Update failed: " . $e->getMessage()
        ]);
    }
}
?>