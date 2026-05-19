/**
 * This module provides types and interfaces for defining functions and prompts in the MCP Documenter.
 * It includes base interfaces for prompt arguments, validation functions, and prompt expansion.
 * 
 * Copyright Jon Verrier, 2025
 */

import { ListPromptsResult } from "@modelcontextprotocol/sdk/types.js";
import {IPrompt, IPromptRepository} from "@jonverrier/prompt-repository";

/**
 * Base interface for argument objects
 */
export interface IArgs {
}

/**
 * Function type for validating arguments
 */
export type FnValidateArgs = (args: IArgs) => IArgs;

/**
 * Function type for executing MCP functions
 */
export type FnExecuteFunction = (args: IArgs) => Promise<string>;

/**
 * Base interface for MCP elements with name and description
 */
export interface IMcpElement
 {
   name: string;
   description: string;
}

/**
 * Interface for MCP prompts with optional argument definitions
 */
export interface IMcpPrompt extends IMcpElement {
   arguments?: {
      name: string;
      description: string;
      required: boolean;
      type?: string;      
   }[];
}

/**
 * Interface for executable MCP functions
 */
export interface IMcpFunction extends IMcpElement {
   validateArgs: FnValidateArgs;     
   execute: FnExecuteFunction;
}

/**
 * Converts IPrompt to IMcpPrompt format
 */
export function toMcpPrompt(prompt: IPrompt): IMcpPrompt {
   return {
      name: prompt.name,
      description: prompt.description ?? "",
      arguments: prompt.userPromptParameters?.map(param => ({
         name: param.name,
         description: param.description ?? "",
         required: param.required,
         type: param.type === "kString" ? "string" : param.type === "kEnum" ? "string" : "number"
      })) ?? [],
   };
}

/**
 * Converts IMcpPrompt to ListPromptsResult format
 */
function toListPromptResult(prompt: IMcpPrompt): ListPromptsResult['prompts'][0] {
   return {
      name: prompt.name,
      description: prompt.description,
      arguments: prompt.arguments
   };
}

/**
 * Retrieves a prompt by ID and converts to MCP format
 */
export function getMcpPrompt(promptId: string, repository: IPromptRepository): ListPromptsResult['prompts'][0]  | undefined {
   const prompt = repository.getPrompt(promptId);
   if (!prompt) {
      return undefined;
   }
   return toListPromptResult (toMcpPrompt(prompt));
}

/**
 * Expands a prompt template with provided parameters
 */
export function expandPrompt(promptId: string, repository: IPromptRepository, params: { [key: string]: string | undefined }): string {
   
   const prompt = repository.getPrompt(promptId);
   if (!prompt) {
      return "";
   }
   return repository.expandUserPrompt(prompt, params);
}

