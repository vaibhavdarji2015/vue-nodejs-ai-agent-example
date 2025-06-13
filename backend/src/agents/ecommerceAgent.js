import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { AgentExecutor, ZeroShotAgent } from "langchain/agents";
import { Tool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "langchain/memory";

import { productSearchTool } from '../tools/productSearchTool.js';

let agentExecutor;

// Initialize the agent
export const initializeAgent = async () => {
    const debugApiKey = process.env.GOOGLE_API_KEY;
    const llm = new ChatGoogleGenerativeAI({
        apiKey: debugApiKey,
        modelName: "gemini-1.5-flash",
        temperature: 0
    });

    // Define the tools your agent can use
    const tools = [
        productSearchTool,
        // new userProfileTool(), // Uncomment if you implement userProfileTool
        // Add more tools here (e.g., order management, add to cart, check inventory)
    ];

    // Define the prompt for the agent
    // This is crucial for guiding the agent's behavior and access to tools
    const prompt = ChatPromptTemplate.fromMessages([
        ["system", `
            You are a helpful and proactive AI E-commerce Assistant named "ShopPal".
            Your goal is to assist the user in their shopping journey by providing relevant product information,
            personalizing recommendations, and helping with tasks like updating preferences or finding deals.
            You should always strive to be helpful and anticipate user needs.
            If a user asks about products, offer to search for them using the 'product_search' tool.
            Do not make up product details; always use the product search tool when a product query is implied.
            Current date: ${new Date().toLocaleDateString()}
        `],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"], // For agent's internal thought process
    ]);

    // Initialize memory (short-term conversational memory)
    const memory = new BufferMemory({
        memoryKey: "chat_history",
        returnMessages: true,
        outputKey: "output"
    });

    // Create the agent
    const agent = await ZeroShotAgent.fromLLMAndTools(llm, tools, prompt);

    agentExecutor = AgentExecutor.fromAgentAndTools({
        agent,
        tools,
        memory, // Pass the short-term memory
        verbose: true, // Set to true to see agent's thought process in console
        returnIntermediateSteps: true // Useful for debugging and showing agent's actions in UI
    });

    console.log("AI Agent initialized successfully!");
};

// Function to run the agent with user input
export const runAgent = async (input) => {
    if (!agentExecutor) {
        throw new Error("Agent not initialized. Call initializeAgent() first.");
    }
    const result = await agentExecutor.call({ input });
    return result;
};