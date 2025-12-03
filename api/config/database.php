<?php
/**
 * Database Configuration (SQLite)
 * ================================
 * اتصال قاعدة البيانات
 */

class Database {
    // Database file path
    private $dbFile = __DIR__ . '/../../database/fitness.db';
    
    public $conn;

    // Get database connection
    public function getConnection() {
        $this->conn = null;

        try {
            // Create database directory if not exists
            $dbDir = dirname($this->dbFile);
            if (!is_dir($dbDir)) {
                mkdir($dbDir, 0777, true);
            }

            // Connect to SQLite
            $this->conn = new PDO("sqlite:" . $this->dbFile);
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Enable foreign keys
            $this->conn->exec("PRAGMA foreign_keys = ON");

            // Initialize database tables if not exist
            $this->initDatabase();

        } catch(PDOException $e) {
            echo json_encode([
                "success" => false,
                "message" => "Connection Error: " . $e->getMessage()
            ]);
            exit();
        }

        return $this->conn;
    }

    // Initialize database tables
    private function initDatabase() {
        // Users table
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        ");

        // Favorites table
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS favorites (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                exercise_id TEXT NOT NULL,
                exercise_name TEXT NOT NULL,
                body_part TEXT,
                target TEXT,
                equipment TEXT,
                gif_url TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE (user_id, exercise_id)
            )
        ");

        // Workout plans table
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS workout_plans (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                day TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        ");

        // Workout exercises table
        $this->conn->exec("
            CREATE TABLE IF NOT EXISTS workout_exercises (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                workout_id INTEGER NOT NULL,
                exercise_id TEXT NOT NULL,
                exercise_name TEXT NOT NULL,
                FOREIGN KEY (workout_id) REFERENCES workout_plans(id) ON DELETE CASCADE
            )
        ");
    }
}

// CORS Headers - السماح لـ React بالاتصال
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}
?>