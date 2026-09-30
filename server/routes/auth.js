const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../config/database");

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const [existingUsers] = await db.query(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Use customer as default role
        const userRole = role || "customer";

        // Insert user
        const [result] = await db.query(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                id: result.insertId,
                name: name,
                email: email,
                role: userRole
            }
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });
    }
});

module.exports = router;