<?php
/**
 * ExerciseDB API Proxy
 * =====================
 * وسيط لإخفاء الـ API Key
 */

// Include database connection for CORS headers
require_once '../config/database.php';

// API Configuration - ضع الـ API Key حقك هنا
define('RAPIDAPI_KEY', 'a2d954e5e4mshe8be1d5261be56ap19653cjsn9770beafdc00');
define('RAPIDAPI_HOST', 'exercisedb.p.rapidapi.com');
define('API_BASE_URL', 'https://exercisedb.p.rapidapi.com');

// Get request parameters
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : 'exercises';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$id = isset($_GET['id']) ? $_GET['id'] : null;

// Build API URL based on endpoint
switch ($endpoint) {
    case 'exercises':
        $apiUrl = API_BASE_URL . "/exercises?limit={$limit}&offset={$offset}";
        break;
    
    case 'exercise':
        if (!$id) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Exercise ID is required"
            ]);
            exit();
        }
        $apiUrl = API_BASE_URL . "/exercises/exercise/{$id}";
        break;
    
    case 'bodyPartList':
        $apiUrl = API_BASE_URL . "/exercises/bodyPartList";
        break;
    
    case 'bodyPart':
        $bodyPart = isset($_GET['bodyPart']) ? $_GET['bodyPart'] : null;
        if (!$bodyPart) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Body part is required"
            ]);
            exit();
        }
        $apiUrl = API_BASE_URL . "/exercises/bodyPart/{$bodyPart}?limit={$limit}&offset={$offset}";
        break;
    
    case 'targetList':
        $apiUrl = API_BASE_URL . "/exercises/targetList";
        break;
    
    case 'target':
        $target = isset($_GET['target']) ? $_GET['target'] : null;
        if (!$target) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Target muscle is required"
            ]);
            exit();
        }
        $apiUrl = API_BASE_URL . "/exercises/target/{$target}?limit={$limit}&offset={$offset}";
        break;
    
    case 'equipmentList':
        $apiUrl = API_BASE_URL . "/exercises/equipmentList";
        break;
    
    case 'equipment':
        $equipment = isset($_GET['equipment']) ? $_GET['equipment'] : null;
        if (!$equipment) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Equipment is required"
            ]);
            exit();
        }
        $apiUrl = API_BASE_URL . "/exercises/equipment/{$equipment}?limit={$limit}&offset={$offset}";
        break;
    
    case 'name':
        $name = isset($_GET['name']) ? $_GET['name'] : null;
        if (!$name) {
            http_response_code(400);
            echo json_encode([
                "success" => false,
                "message" => "Exercise name is required"
            ]);
            exit();
        }
        $apiUrl = API_BASE_URL . "/exercises/name/{$name}?limit={$limit}&offset={$offset}";
        break;
    
    default:
        $apiUrl = API_BASE_URL . "/exercises?limit={$limit}&offset={$offset}";
        break;
}

// Initialize cURL
$curl = curl_init();

curl_setopt_array($curl, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "GET",
    CURLOPT_HTTPHEADER => [
        "x-rapidapi-host: " . RAPIDAPI_HOST,
        "x-rapidapi-key: " . RAPIDAPI_KEY
    ],
]);

// Execute request
$response = curl_exec($curl);
$err = curl_error($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

curl_close($curl);

// Handle response
if ($err) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "API Error: " . $err
    ]);
} else {
    http_response_code($httpCode);
    echo $response;
}
?>