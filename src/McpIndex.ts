/**
 * McpIndex module provides the main entry point for the MCP Documenter server.
 * It initializes the server, adds the necessary functions and prompts, and starts the server.
 * 
 * Copyright Jon Verrier, 2025
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { addFunctions } from "./McpFunctions.js";
import { addPrompts } from "./McpPrompts.js";

const server = new Server({
  name: "agent-doc",
  version: "1.0.0",
}, {
  capabilities: {
    tools: {},
    prompts: {},
    resources: {}
  }
});

export async function connectServer(): Promise<void> {

   addFunctions(server);

   addPrompts(server);

   const transport = new StdioServerTransport();

   await server.connect(transport);
}