/**
 * This module provides functions for working with Mermaid diagrams.
 * It implements:
 * - Argument validation for Mermaid diagram processing
 * - Functions for detecting diagram types
 * - Functions for parsing diagrams
 * - Functions for previewing diagrams in a browser
 * 
 * Copyright Jon Verrier, 2025
 */

import fs from "fs/promises";
import path from "path";
import os from 'os';

import { throwMcpInternalError, throwMcpInvalidArgs } from "./McpThrow.js";
import { IMcpFunction, IArgs, FnValidateArgs, FnExecuteFunction } from './McpBridgeTypes.js';
import { 
   readFileToolName, 
   readFileToolDesc, 
   listDirectoryToolName, 
   listDirectoryToolDesc, 
   writeFileToolName, 
   writeFileToolDesc 
} from "./UIStrings.js";


// ==========
// Argment types for the File Functions
// ==========

export interface IReadFile extends IArgs {
   filePath: string | undefined;
};

export interface IProcessValidatedReadFileArgs extends IArgs {
   filePath: string;
};

export interface IWriteFile extends IArgs {
   filePath: string | undefined;
   content: string | undefined;
};

export interface IProcessValidatedWriteFileArgs extends IArgs {
   filePath: string;
   content: string;
};

export interface IListDirectory extends IArgs {
   directoryPath: string | undefined;
};

export interface IProcessValidatedListDirectoryArgs extends IArgs {
   directoryPath: string;
};

// ==========
// Utility functions
// ==========

let allowedDirectories: Array<string> = [];

export async function setFileDirectories (argsIn: Array<string>) : Promise<void> {
   if (argsIn.length === 0) {
      console.error("Usage: agent-doc <allowed-directory> [additional-directories...]");
      process.exit(1);
   }
   
   await Promise.all(argsIn.map(async (dir: string) => {
      try {
        const stats = await fs.stat(dir);
        if (!stats.isDirectory()) {
          console.error(`Error: ${dir} is not a directory`);
          process.exit(1);
        }
      } catch (error) {
        console.error(`Error accessing directory ${dir}:`, error);
        process.exit(1);
      }
    }));

   // Store allowed directories in normalized form
   allowedDirectories = argsIn.map((dir: string) =>
   normalizePath(path.resolve(expandHome(dir)))
 );    
}

// Normalize all paths consistently
function normalizePath(p: string): string {
   return path.normalize(p);
 }
 
 function expandHome(filepath: string): string {
   if (filepath.startsWith('~/') || filepath === '~') {
     return path.join(os.homedir(), filepath.slice(1));
   }
   return filepath;
 }

 
 // Validate that all directories exist and are accessible
async function validatePath(requestedPath: string): Promise<string> {
   const expandedPath = expandHome(requestedPath);
   const absolute = path.isAbsolute(expandedPath)
     ? path.resolve(expandedPath)
     : path.resolve(process.cwd(), expandedPath);
 
   const normalizedRequested = normalizePath(absolute);
 
   // Check if path is within allowed directories
   const isAllowed = allowedDirectories.some((dir: string) => normalizedRequested.startsWith(dir));
   if (!isAllowed) {
     throw new Error(`Access denied - path outside allowed directories: ${absolute} not in ${allowedDirectories.join(', ')}`);
   }
 
   // Handle symlinks by checking their real path
   try {
     const realPath = await fs.realpath(absolute);
     const normalizedReal = normalizePath(realPath);
     const isRealPathAllowed = allowedDirectories.some((dir: string) => normalizedReal.startsWith(dir));
     if (!isRealPathAllowed) {
       throw new Error("Access denied - symlink target outside allowed directories");
     }
     return realPath;
   } catch (error) {
     // For new files that don't exist yet, verify parent directory
     const parentDir = path.dirname(absolute);
     try {
       const realParentPath = await fs.realpath(parentDir);
       const normalizedParent = normalizePath(realParentPath);
       const isParentAllowed = allowedDirectories.some((dir: string) => normalizedParent.startsWith(dir));
       if (!isParentAllowed) {
         throw new Error("Access denied - parent directory outside allowed directories");
       }
       return absolute;
     } catch {
       throw new Error(`Parent directory does not exist: ${parentDir}`);
     }
   }
 }


// ==========
// readFile Functions
// ==========

function validateReadFileArgs(args: IReadFile): IProcessValidatedReadFileArgs {

   if (!args || typeof args.filePath !== 'string') {
      throwMcpInvalidArgs ('Argument \'FilePath\' must be a string');
   }

   return { filePath: args.filePath };
}

async function executeReadFile(args: IProcessValidatedReadFileArgs): Promise<string> {
   
   try {
      const validPath = await validatePath(args.filePath);
      const content = await fs.readFile(validPath, "utf-8");
      return content;
   } catch (error) {
      console.log (error);
      throwMcpInternalError("Error reading file");
   }
}

// Function to read a file and return the content
export const readFileFunction: IMcpFunction = {
   name: readFileToolName,
   description: readFileToolDesc,
   validateArgs: validateReadFileArgs as unknown as FnValidateArgs,
   execute: executeReadFile as FnExecuteFunction
};

// ==========
// writeFile Functions
// ==========

function validateWriteFileArgs(args: IWriteFile): IProcessValidatedWriteFileArgs {

   if (!args || typeof args.filePath !== 'string') {
      throwMcpInvalidArgs ('Argument \'FilePath\' must be a string');
   }
   if (!args || typeof args.content !== 'string') {
      throwMcpInvalidArgs ('Argument \'Content\' must be a string');
   }   

   return { filePath: args.filePath, content: args.content as string};
}

async function executeWriteFile(args: IProcessValidatedWriteFileArgs): Promise<string> {
   
   try {
      const validPath = await validatePath(args.filePath);
      await fs.writeFile(validPath, args.content, "utf-8");
      return `Successfully wrote to ${args.filePath}`;
   } catch (error) {
      console.log (error);
      throwMcpInternalError("Error writing file");
   }
}

// Function to write content to a file
export const writeFileFunction: IMcpFunction = {
   name: writeFileToolName,
   description: writeFileToolDesc,
   validateArgs: validateWriteFileArgs as unknown as FnValidateArgs,
   execute: executeWriteFile as FnExecuteFunction
};


// ==========
// listDirectory Functions
// ==========

function validateListDirectoryArgs(args: IListDirectory): IProcessValidatedListDirectoryArgs {

   if (!args || typeof args.directoryPath !== 'string') {
      throwMcpInvalidArgs ('Argument \'Path\' must be a string');
   }

   return { directoryPath: args.directoryPath };
}

async function executeListDirectory(args: IProcessValidatedListDirectoryArgs): Promise<string> {
   
   try {
      const validPath = await validatePath(args.directoryPath);
      const entries = await fs.readdir(validPath, { withFileTypes: true });
      const formatted = entries
         .map((entry) => `${entry.isDirectory() ? "[DIR]" : "[FILE]"} ${entry.name}`)
         .join("\n");
      return formatted;
   } catch (error) {
      throwMcpInternalError("Error listing directory");
   }
}

// Function to list contents of a directory
export const listDirectoryFunction: IMcpFunction = {
   name: listDirectoryToolName, 
   description: listDirectoryToolDesc,
   validateArgs: validateListDirectoryArgs as unknown as FnValidateArgs,
   execute: executeListDirectory as FnExecuteFunction
};

