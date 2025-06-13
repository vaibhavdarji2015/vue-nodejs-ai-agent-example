<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" :class="['message', msg.sender]">
        <div class="sender-name">{{ msg.sender === 'user' ? 'You' : 'ShopPal' }}</div>
        <div class="message-content" v-html="formatMessage(msg.text)"></div>
        <div v-if="msg.intermediateSteps && msg.intermediateSteps.length" class="agent-thoughts">
          <p>ShopPal's thoughts:</p>
          <ul class="thought-list">
            <li v-for="(step, stepIndex) in msg.intermediateSteps" :key="stepIndex">
              <span class="thought-label">Action:</span> <span class="thought-action">{{ step.action.tool }}</span><br/>
              <span class="thought-label">Input:</span> <span class="thought-input">{{ step.action.toolInput }}</span><br/>
              <span class="thought-label">Observation:</span> <span class="thought-observation">{{ step.observation }}</span>
              <details class="full-log">
                <summary>Show full log</summary>
                <pre>{{ step.log }}</pre>
              </details>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="input-area">
      <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Ask ShopPal about products, or just say hi!" :disabled="loading" />
      <button @click="sendMessage" :disabled="loading">
        <span v-if="loading">Sending...</span>
        <span v-else>Send</span>
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { sendMessageToAgent } from '../services/agentService'; // API service

export default {
  name: 'AgentChatInterface',
  setup() {
    const userInput = ref('');
    const messages = ref([
      { sender: 'agent', text: "Hello! I'm ShopPal, your AI E-commerce Assistant. How can I help you today?" }
    ]);
    const loading = ref(false);

    const sendMessage = async () => {
      if (userInput.value.trim() === '') return;

      const userMessage = userInput.value;
      messages.value.push({ sender: 'user', text: userMessage });
      userInput.value = '';
      loading.value = true; // Set loading to true

      try {
        // Show a temporary "Thinking..." message
        messages.value.push({ sender: 'agent', text: 'ShopPal is thinking...', loading: true });

        const response = await sendMessageToAgent(userMessage);
        
        // Remove the temporary loading message
        messages.value.pop();

        messages.value.push({
          sender: 'agent',
          text: response.agentOutput,
          intermediateSteps: response.intermediateSteps
        });
      } catch (error) {
        console.error('Error sending message:', error);
        // Remove the temporary loading message
        messages.value.pop();
        messages.value.push({ sender: 'agent', text: 'Sorry, I encountered an error. Please try again.' });
      } finally {
        loading.value = false; // Set loading to false regardless of success or failure
      }
    };

    const formatMessage = (text) => {
      // Basic formatting for product lists if the agent returns them in a structured way
      // This is a simple example; you might need more robust parsing for complex outputs.
      try {
        const jsonMatch = text.match(/\[\s*\{.*?\}\s*\]/s); // Find JSON array
        if (jsonMatch) {
            const products = JSON.parse(jsonMatch[0]);
            if (Array.isArray(products) && products.every(p => p.id && p.name && p.price)) {
                let html = text.replace(jsonMatch[0], '<br/>'); // Replace raw JSON with break
                html += '<div class="product-list">';
                products.forEach(p => {
                    html += `<div class="product-item"><strong>${p.name}</strong> - $${p.price} (Category: ${p.category})</div>`;
                });
                html += '</div>';
                return html;
            }
        }
      } catch (e) {
          // console.warn("Could not parse message as product JSON:", e);
      }
      return text; // Return original text if no special formatting
    };


    return {
      userInput,
      messages,
      loading,
      sendMessage,
      formatMessage
    };
  },
};
</script>

<style scoped>
/* Basic styling for chat interface */
.chat-container {
  display: flex;
  flex-direction: column;
  height: 600px; /* Increased height */
  width: 100%;
  max-width: 900px; /* Increased max-width */
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  margin: 20px auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.messages {
  flex-grow: 1;
  overflow-y: auto;
  padding: 15px;
  background-color: #f0f2f5; /* Lighter background */
  display: flex;
  flex-direction: column; /* Ensure messages stack */
}
.message {
  margin-bottom: 15px; /* Increased margin */
  padding: 10px 15px;
  border-radius: 18px; /* More rounded corners */
  max-width: 85%; /* Slightly wider messages */
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.message.user {
  background-color: #e3f2fd; /* Light blue */
  align-self: flex-end;
  margin-left: auto;
}
.message.agent {
  background-color: #e8f5e9; /* Light green */
  align-self: flex-start;
  margin-right: auto;
}
.sender-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9em;
  color: #555;
}
.message-content {
  white-space: pre-wrap; /* Preserve whitespace and wrap text */
  word-wrap: break-word;
  color: #555;
}
.input-area {
  display: flex;
  padding: 15px; /* Increased padding */
  border-top: 1px solid #eee;
  background-color: #fff;
  gap: 10px; /* Space between input and button */
}
.input-area input {
  flex-grow: 1;
  padding: 10px 15px; /* Increased padding */
  border: 1px solid #ddd;
  border-radius: 20px; /* Rounded input */
  font-size: 1em;
}
.input-area button {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 20px; /* Rounded button */
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.2s ease;
}
.input-area button:hover:not(:disabled) {
  background-color: #45a049;
}
.input-area button:disabled {
    background-color: #a5d6a7;
    cursor: not-allowed;
}

.agent-thoughts {
    background-color: #f0f0f0;
    padding: 10px;
    margin-top: 10px;
    border-radius: 10px;
    font-size: 0.8em;
    color: #666;
    border: 1px dashed #ddd;
}
.agent-thoughts p {
    margin-top: 0;
    margin-bottom: 5px;
    font-weight: bold;
}
.thought-list {
    list-style: none;
    padding-left: 0;
    margin: 0;
}
.thought-list li {
    margin-bottom: 8px;
    padding: 5px;
    background-color: #fcfcfc;
    border-radius: 5px;
    line-height: 1.4;
}
.thought-label {
    font-weight: bold;
    color: #333;
}
.thought-action {
    color: #007bff; /* Blue for action */
}
.thought-input {
    color: #d32f2f; /* Red for input */
}
.thought-observation {
    color: #388e3c; /* Green for observation */
}
.full-log {
    margin-top: 5px;
    border-top: 1px dotted #e0e0e0;
    padding-top: 5px;
}
.full-log summary {
    cursor: pointer;
    font-size: 0.9em;
    color: #666;
}
.full-log pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    font-size: 0.8em;
    background-color: #eceff1;
    padding: 8px;
    border-radius: 5px;
    margin-top: 5px;
    overflow-x: auto; /* Allow horizontal scroll for long logs */
}
.product-list {
  margin-top: 10px;
  padding: 10px;
  background-color: #e0f2f7;
  border-radius: 8px;
  border: 1px solid #b3e5fc;
}
.product-item {
  margin-bottom: 5px;
  padding: 5px 0;
  border-bottom: 1px dashed #c1e7ff;
}
.product-item:last-child {
  border-bottom: none;
}
</style>