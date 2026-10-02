require("dotenv").config();

const express = require("express");
const db = require("./config/database");
const authRoutes = require("./routes/auth");

const app = express();

const PORT = process.env.PORT || 5000;

// Allow JSON request bodies
app.use(express.json());
app.use("/api/auth", authRoutes);

// Basic API health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "QueueMate API is running"
    });
});

// Test database connection
app.get("/api/db-test", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT 1 AS connected");

        res.status(200).json({
            success: true,
            message: "Database connected successfully",
            result: rows[0]
        });
    } catch (error) {
        console.error("Database connection error:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed"
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`QueueMate server is running on port ${PORT}`);
});