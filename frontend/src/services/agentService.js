// frontend/src/services/agentService.js
const API_BASE_URL = 'http://localhost:3000/api'; // Your backend URL

export const sendMessageToAgent = async (message) => {
    try {
        const response = await fetch(`${API_BASE_URL}/agent/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in sendMessageToAgent:', error);
        throw error;
    }
};