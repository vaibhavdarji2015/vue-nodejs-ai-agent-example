# Vue 3 + Node.js AI Agent Example: E-commerce Assistant

This repository contains a demonstration project illustrating how to build and integrate an autonomous AI agent into a web application using Vue 3 for the frontend, Node.js with Express for the backend, and LangChain.js for the AI agent orchestration.

The example showcases a "Proactive E-commerce Assistant" capable of understanding user queries, leveraging custom tools (like a product search), and providing intelligent, personalized responses. This project serves as a practical companion to the InfoQ article: **"[Your Article Title on InfoQ]"** (Link will be added here once published).

## Table of Contents

-   [Features](#features)
-   [Architecture](#architecture)
-   [Prerequisites](#prerequisites)
-   [Setup and Installation](#setup-and-installation)
-   [Running the Application](#running-the-application)
-   [Key Code Concepts](#key-code-concepts)
-   [Understanding the AI Agent](#understanding-the-ai-agent)
-   [Contributing](#contributing)
-   [License](#license)
-   [About the Author](#about-the-author)

## Features

-   **Interactive Chat Interface:** A simple Vue 3 chat UI for user-agent interaction.
-   **LangChain.js Agent:** A backend AI agent powered by an LLM (e.g., OpenAI's GPT models) orchestrated with LangChain.js.
-   **Custom Tools:** Demonstrates how to define and integrate custom tools (e.g., `product_search`) that the agent can autonomously use.
-   **Agent Memory:** Basic implementation of conversational memory for context.
-   **Express.js API:** Secure API endpoint for frontend-backend communication.
-   **Mock Data:** Uses a local JSON file for product data simulation.

## Architecture

The application follows a client-server architecture:

1.  **Frontend (Vue 3):** Provides the user interface, sends user messages to the backend, and displays agent responses.
2.  **Backend (Node.js with Express):**
    * Exposes a `/api/agent/message` endpoint.
    * Hosts the LangChain.js AI agent.
    * Manages the agent's tools and memory.
    * Orchestrates LLM calls and tool execution.
3.  **Large Language Model (LLM):** The core intelligence, used by the LangChain.js agent for reasoning and response generation (e.g., OpenAI API).
4.  **Tools:** Functions or services (e.g., `productSearchTool`) that the agent can call to interact with external data or perform actions.
5.  **Memory (Optional for this demo):** Could be extended to include a vector database (like ChromaDB or Pinecone) for long-term memory or retrieval-augmented generation (RAG).

+----------------+       +-------------------+       +-----------------+       +----------------+
|                |       |                   |       |                 |       |                |
|  Vue 3 Frontend  |&lt;---->| Node.js Backend   |&lt;----->| LangChain.js    |&lt;----->| LLM Provider   |
| (AgentChatInterface) |       | (Express API)     |       |   (AI Agent)    |       | (OpenAI API)   |
|                |       |                   |       |                 |       |                |
+----------------+       +---------^---------+       +--------^--------+       +----------------+
|                           |
|                           |
+------+------+         +----------+-----------+
| Custom Tools |         | Agent Memory (Buffer) |
| (e.g., product_search) | (Optional: Vector DB) |
+-------------+         +---------------------+

## Prerequisites

Before you begin, ensure you have the following installed:

-   Node.js (LTS version recommended)
-   npm (comes with Node.js) or yarn
-   An OpenAI API Key

## Setup and Installation

1.  **Clone the repository (if you downloaded, just navigate):**
    ```bash
    # If you created the structure manually, just be in the root directory.
    # If you cloned, then:
    # git clone [https://github.com/](https://github.com/)[YourUsername]/vue-nodejs-ai-agent-example.git
    # cd vue-nodejs-ai-agent-example
    ```

2.  **Set up environment variables:**
    * Create a `.env` file in the `backend` directory based on `.env.example`.
    * Add your OpenAI API key:
        ```
        # backend/.env
        OPENAI_API_KEY=your_openai_api_key_here
        ```
    * **(Important: Never commit your `.env` file to Git.)**

3.  **Install backend dependencies:**
    ```bash
    cd backend
    npm install
    cd ..
    ```

4.  **Install frontend dependencies:**
    ```bash
    cd frontend
    npm install
    cd ..
    ```

## Running the Application

1.  **Start the backend server:**
    ```bash
    cd backend
    npm start # Or node src/server.js if you don't add the script
    ```
    The backend will typically run on `http://localhost:3000`.

2.  **Start the frontend development server:**
    ```bash
    cd frontend
    npm run dev
    ```
    The frontend will typically run on `http://localhost:5173`.

3.  **Open your browser** and navigate to the frontend URL to interact with the AI E-commerce Assistant.

## Key Code Concepts

-   **`backend/src/agents/ecommerceAgent.js`**: This file defines the core AI agent using LangChain.js. It orchestrates the LLM, defines the agent's prompt, sets up memory, and registers the tools the agent can use.
-   **`backend/src/tools/productSearchTool.js`**: An example of a custom tool. The agent can "choose" to call this tool when it determines a product search is necessary. This abstracts complex logic (like querying a database) from the agent's core reasoning.
-   **`backend/src/services/productService.js`**: A mock service demonstrating how the `productSearchTool` might interact with a data source (here, a local JSON file).
-   **`backend/src/routes/agentRoutes.js`**: The Express.js route that receives messages from the frontend and passes them to the LangChain.js agent for processing.
-   **`frontend/src/components/AgentChatInterface.vue`**: The Vue 3 component handling the chat UI, sending user messages, and displaying agent responses (including its thought process, if `verbose` is enabled on the agent).

## Understanding the AI Agent

The LangChain.js agent in this project operates on a "plan and execute" loop. When you send a message:
1.  The agent receives your input.
2.  It uses the LLM to **reason** about your request and determine if it needs to use any of its available **tools**.
3.  If a tool is needed (e.g., `product_search` for "find me a blue shirt"), the agent calls that tool.
4.  The **observation** (result) from the tool call is fed back to the LLM.
5.  The LLM then generates a **final response** to the user, potentially incorporating information from the tool's output.
6.  This process continues until the agent believes it has fulfilled the user's request.

## Contributing

Feel free to fork this repository, open issues, and submit pull requests.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

## About the Author

[Your Name] is a [Your Title/Expertise]. You can connect with me on [LinkedIn Profile Link] or read my other articles on InfoQ, including the related piece: **"[Your Article Title on InfoQ]"** (Link will be added here once published).