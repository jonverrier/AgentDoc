#!/usr/bin/env node
import { connectServer } from "./McpIndex.js";
import { setFileDirectories } from "./FileFunctions.js";

setFileDirectories(process.argv.slice(2));

connectServer();