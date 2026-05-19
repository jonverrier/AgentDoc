/**
 * McpPrompts module provides the prompts for the MCP Documenter server.
 * It adds a prompt for generating a C4 diagram from the context provided.
 * 
 * Copyright Jon Verrier, 2025
 */
import path from 'path';
import { fileURLToPath } from 'url';

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
   GetPromptRequestSchema,
   ListPromptsRequestSchema,
   ListPromptsResult,
   GetPromptRequest,
   GetPromptResult,
} from '@modelcontextprotocol/sdk/types.js';

import { IPromptRepository, PromptFileRepository } from '@jonverrier/prompt-repository';

import { throwMcpMethodNotFound } from "./McpThrow.js";
import { getMcpPrompt, expandPrompt } from "./McpBridgeTypes.js";
import { generateComponentC4DiagramPromptId, 
   generateReadmePromptId, 
   generateRollupC4DiagramPromptId } from "./PromptIds.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createPromptMessages(prompt: string): GetPromptResult {
   return {
      messages: [
         {
            role: 'user',
            content: { type: 'text', text: prompt }
         }
      ]
   };
}

let repository: IPromptRepository = new PromptFileRepository(path.join(__dirname, './Prompts.json'));
/**
 * Adds prompt handlers to the MCP server for generating documentation.
 * 
 * This function sets up handlers for three types of documentation generation:
 * 1. README.' + C4DiagrammerName + '.md - Module-level documentation summarizing code in each directory
 * 2. C4Component.' + C4DiagrammerName + '.md - Component-level C4 architecture diagrams for each module
 * 3. C4Context.' + C4DiagrammerName + '.md or C4Container.' + C4DiagrammerName + '.md - System-level C4 architecture diagrams
 * 
 * @param server - The MCP server instance to add handlers to
 * @throws {McpError} If invalid parameters are provided to the prompts
 */
export function addPrompts(server: Server): void {

   const readmePrompt = getMcpPrompt(generateReadmePromptId, repository);
   if (!readmePrompt) {
      throw new Error('Readme prompt not found');
   }

   const componentC4Prompt = getMcpPrompt(generateComponentC4DiagramPromptId, repository);
   if (!componentC4Prompt) {
      throw new Error('Component C4 prompt not found');
   }

   const rollupC4Prompt = getMcpPrompt(generateRollupC4DiagramPromptId, repository);
   if (!rollupC4Prompt) {
      throw new Error('Rollup C4 prompt not found');
   }

   // Prompts
   server.setRequestHandler(ListPromptsRequestSchema, async (): Promise<ListPromptsResult> => {
      return Promise.resolve({
         prompts: [
            readmePrompt,
            componentC4Prompt,
            rollupC4Prompt
         ]
      });
   });

   server.setRequestHandler(GetPromptRequestSchema, async (request: GetPromptRequest): Promise<GetPromptResult> => {

      if (request.params.name === readmePrompt?.name) {

         const args = request.params.arguments;

         const expandedPrompt = expandPrompt (generateReadmePromptId, repository, {
            rootDirectory: args?.rootDirectory,
            languages: args?.languages ?? undefined,
            wordCount: args?.wordCount ?? undefined
         });

         return createPromptMessages(expandedPrompt);
      }
      else
      if (request.params.name === componentC4Prompt.name) {

         const args = request.params.arguments;

         const expandedPrompt = expandPrompt(generateComponentC4DiagramPromptId, repository, {
            rootDirectory: args?.rootDirectory
         });

         return createPromptMessages(expandedPrompt);
      }
      else
      if (request.params.name === rollupC4Prompt.name) {

         const args = request.params.arguments;

         const expandedPrompt = expandPrompt(generateRollupC4DiagramPromptId, repository, {
            rootDirectory: args?.rootDirectory,
            c4Type: args?.c4Type
         });

         return createPromptMessages(expandedPrompt);
      }

      throwMcpMethodNotFound('Prompt not found');
   });
};
 

