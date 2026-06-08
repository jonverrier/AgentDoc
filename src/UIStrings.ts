/**
 * UIStrings.ts
 * 
 * This module contains string constants used throughout the application.
 */
// Global Names
export const AgentDocName = 'AgentDoc';

/** Legacy filename brand for generated documentation artifacts (README.C4Diagrammer.md, etc.). */
export const C4DiagrammerName = 'C4Diagrammer';

// Strings used in Prompt definitions 

export const c4TypeParamName = 'C4Type';
export const c4TypeParamDesc = 'The type of C4 diagram to generate. C4Context, C4Container, C4Component, or C4Deployment';

export const mermaidFileParamName = "FilePath";
export const mermaidFileParamDesc = "The path to the mermaid file to preview.";

// shouldRegenerateReadmeFunction
export const shouldRegenerateReadmeFunctionName = "should_regenerate_readme";
export const shouldRegenerateReadmeFunctionDesc = "Determine if the README.C4Diagrammer.md file should be regenerated for a given directory.";
export const shouldRegenerateReadmeFunctionReturnDesc = "'True' if the README.C4Diagrammer.md file should be regenerated, 'False' otherwise.";

export const directoryParamName = "Directory";
export const sourceFileExtensionsParamName = "SourceFileExtensions";

export const directoryParamDesc = "The directory to check for the timestamp of the README.C4Diagrammer.md file.";
export const sourceFileExtensionsParamDesc = "The file extensions to use to check the timestamps of source files in the directory vs. the README.C4Diagrammer.md file."

// detectMermaidDiagramTypeFunction
export const detectMermaidDiagramTypeToolName = "detect_mermaid_diagram_type";
export const detectMermaidDiagramTypeToolDesc = "Detect the mermaid diagram type represented in a text string";
export const detectmermaidDiagramReturnDesc = "The detected diagram type if possible, otherwise an empty string.";
export const mermaidParamName = "Mermaid";
export const mermaidParamDesc = "The mermaid.js diagram markdown text to process to see if a valid mermaid diagram is present.";

// parseMermaidFunction
export const parseMermaidToolName = "parse_mermaid";
export const parseMermaidToolDesc = "Parse a mermaid diagram represented in a text string";
export const parseMermaidReturnDesc = "'No errors' if the mermaid is parsed correctly, else an error message.";

// previewMermaidFunction
export const previewMermaidToolName = "preview_mermaid";
export const previewMermaidToolDesc = "Preview a mermaid diagram represented in a text string using the default browser";
export const previewMermaidReturnDesc = "'True' if the preview was successful, 'false' otherwise.";

// previewExistingMermaidDiagram
export const previewExistingMermaidToolName = "preview_existing_mermaid_diagram";
export const previewExistingMermaidToolDesc = "Preview a mermaid diagram from an existing markdown file using the default browser";
export const previewExistingMermaidReturnDesc = "'True' if the preview was successful, 'false' otherwise.";

// readFileFunction
export const readFileToolName = "read_file";
export const readFileToolDesc = "Read the complete contents of a file from the file system. " +
                  "Handles various text encodings and provides detailed error messages " +
                  "if the file cannot be read. Use this tool when you need to examine " +
                  "the contents of a single file. Only works within allowed directories.";
export const readFileReturnDesc = "The contents of the file as a string.";
export const readFileParamName = "FilePath";
export const readFileParamDesc = "The path to the file to read.";

// writeFileFunction 
export const writeFileToolName = "write_file";
export const writeFileToolDesc = "Create a new file or completely overwrite an existing file with new content. " +
                  "Use with caution as it will overwrite existing files without warning. " +
                  "Handles text content with proper encoding. Only works within allowed directories.";
export const writeFileReturnDesc = "A string confirming the file was written successfully.";
export const writeFileParamName = "FilePath";
export const writeFileParamDesc = "The path to the file to write.";


// listDirectoryFunction
export const listDirectoryToolName = "list_directory";
export const listDirectoryToolDesc = "Get a detailed listing of all files and directories in a specified path. " +
                 "Results clearly distinguish between files and directories with [FILE] and [DIR] " +
                 "prefixes. This tool is essential for understanding directory structure and " +
                 "finding specific files within a directory. Only works within allowed directories.";
export const listDirectoryReturnDesc = "The contents of the directory as a string.";
export const listDirectoryParamName = "DirectoryPath";
export const listDirectoryParamDesc = "The path to the directory to list.";
