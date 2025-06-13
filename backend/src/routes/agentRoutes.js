// backend/src/routes/agentRoutes.js
import express from 'express';
import { runAgent } from '../agents/ecommerceAgent.js';

const router = express.Router();

router.post('/message', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    try {
        const agentResponse = await runAgent(message);
        // agentResponse will contain 'output' and 'intermediateSteps'
        res.json({
            agentOutput: agentResponse.output,
            intermediateSteps: agentResponse.intermediateSteps || [] // Show agent's thought process
        });
    } catch (error) {
        console.error('Error running agent:', error);
        // Provide a more user-friendly error message
        res.status(500).json({ error: 'Failed to get agent response. Please try again or rephrase.', details: error.message });
    }
});

export default router;