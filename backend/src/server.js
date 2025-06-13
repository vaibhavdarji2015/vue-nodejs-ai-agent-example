// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import agentRoutes from './routes/agentRoutes.js';
import { initializeAgent } from './agents/ecommerceAgent.js';

// Load environment variables from .env file
dotenv.config();

// --- ADD THIS LINE FOR DEBUGGING ---
console.log("GOOGLE_API_KEY from .env:", process.env.GOOGLE_API_KEY ? "Loaded (not undefined)" : "UNDEFINED");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173' // Allow requests from your Vue frontend
}));
app.use(express.json()); // For parsing application/json

// Routes
app.use('/api/agent', agentRoutes);

// Initialize AI Agent before starting the server
initializeAgent().then(() => {
    app.listen(PORT, () => {
        console.log(`Backend server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to initialize AI Agent:", err);
    process.exit(1); // Exit if agent initialization fails
});