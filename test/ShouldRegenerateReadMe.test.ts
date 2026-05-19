/**
 * Tests for the ShouldRegenerateReadMe function.
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { C4DiagrammerName } from '../src/UIStrings.js';
import { shouldRegenerateReadMeFunction, shouldRegenerateReadMe } from '../src/ShouldRegenerateReadMeFunction.js';

describe('ShouldRegenerateReadMeFunction', () => {
   describe('validateShouldRegenerateReadMeArgs', () => {
      it('should validate correct arguments', () => {
         const args = {
            directory: '/test/path',
            sourceFileExtensions: ['.ts', '.js']
         };

         const result = shouldRegenerateReadMeFunction.validateArgs(args);
         expect(result).toEqual(args);
      });

      it('should throw error when directory is undefined', () => {
         const args = {
            directory: undefined,
            sourceFileExtensions: ['.ts']
         };

         expect(() => shouldRegenerateReadMeFunction.validateArgs(args))
            .toThrow();
      });

      it('should throw error when sourceFileExtensions is undefined', () => {
         const args = {
            directory: '/test/path',
            sourceFileExtensions: undefined
         };

         expect(() => shouldRegenerateReadMeFunction.validateArgs(args))
            .toThrow();
      });

      it('should throw error when sourceFileExtensions is empty', () => {
         const args = {
            directory: '/test/path',
            sourceFileExtensions: []
         };

         expect(() => shouldRegenerateReadMeFunction.validateArgs(args))
            .toThrow();
      });

      it('should throw error when sourceFileExtensions contains non-strings', () => {
         const args = {
            directory: '/test/path',
            sourceFileExtensions: ['.ts', 123] as any
         };

         expect(() => shouldRegenerateReadMeFunction.validateArgs(args))
            .toThrow();
      });
   });

   describe('executeShouldRegenerateReadmeFunction', () => {

      const testDir = path.join(os.tmpdir(), 'mcp-test');
      const readmePath = path.join(testDir, 'README.' + C4DiagrammerName + '.md');
      const tsPath = path.join(testDir, 'test.ts');
      const jsPath = path.join(testDir, 'test.js');
      const txtPath = path.join(testDir, 'other.txt');

      beforeEach(() => {
         fs.mkdirSync(testDir, { recursive: true });
         fs.writeFileSync(readmePath, 'test');
         fs.writeFileSync(tsPath, '//test');
         fs.writeFileSync(jsPath, '//test');
         fs.writeFileSync(txtPath, '//test');
      });

      afterEach(() => {
         fs.rmSync(testDir, { recursive: true, force: true });
      });

      it('should return "True" when source files are newer than README', () => {
         const now = new Date();
         fs.utimesSync(readmePath, now, now);
         const now1s = new Date(now.getTime() + 1000);
         fs.utimesSync(tsPath, now1s, now1s);

         const result = shouldRegenerateReadMe({
            directory: testDir,
            sourceFileExtensions: ['.ts']
         });

         expect(result).toBe('True');
      });

      it('should return "False" when README is newer than source files', () => {
         const now = new Date();
         fs.utimesSync(tsPath, now, now);
         fs.utimesSync(jsPath, now, now);
         const now1s = new Date(now.getTime() + 1000);
         fs.utimesSync(readmePath, now1s, now1s);

         const result = shouldRegenerateReadMe({
            directory: testDir,
            sourceFileExtensions: ['.ts']
         });

         expect(result).toBe('False');
      });

      it('should return "True" when README does not exist', () => {
         const invalidDir = path.join(os.tmpdir(), 'invalid-test');

         const result = shouldRegenerateReadMe({
            directory: invalidDir,
            sourceFileExtensions: ['.ts']
         });

         expect(result).toBe('True');
      });

      it('should handle multiple file extensions', () => {
         const now = new Date();
         fs.utimesSync(readmePath, now, now);

         const now1s = new Date(now.getTime() + 1000);
         fs.utimesSync(jsPath, now1s, now1s);

         const result = shouldRegenerateReadMe({
            directory: testDir,
            sourceFileExtensions: ['.ts', '.js']
         });

         expect(result).toBe('True');
      });

      it('should ignore non-matching file extensions', () => {
         const now = new Date();
         fs.utimesSync(jsPath, now, now);
         fs.utimesSync(tsPath, now, now);

         const now1s = new Date(now.getTime() + 1000);
         fs.utimesSync(readmePath, now1s, now1s);

         fs.utimesSync(txtPath, now1s, now1s);

         const result = shouldRegenerateReadMe({
            directory: testDir,
            sourceFileExtensions: ['.ts', '.js']
         });

         expect(result).toBe('False');
      });
   });
});
