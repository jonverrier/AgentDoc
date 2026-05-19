import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { expect } from 'expect';
import { setFileDirectories, readFileFunction, writeFileFunction, listDirectoryFunction } from '../src/FileFunctions.js';

describe('File Functions', () => {

   const testDir = path.join(os.tmpdir(), 'mcp-test');
   const testFilePath = path.join(testDir, 'test.txt');
   const testContent = 'Hello, World!';

   beforeEach(async () => {
      await fs.mkdir(testDir, { recursive: true });
      setFileDirectories([testDir]);
   });

   afterEach(async () => {
      try {
         await fs.rm(testDir, { recursive: true, force: true });
      } catch {
         // Ignore cleanup errors
      }
   });

   describe('readFileFunction', () => {
      it('should read file content successfully', async () => {
         await fs.writeFile(testFilePath, testContent);

         const result = await readFileFunction.execute({ filePath: testFilePath });

         expect(result).toBe(testContent);
      });

      it('should throw error when file does not exist', async () => {
         const nonExistentFile = path.join(testDir, 'nonexistent.txt');

         await expect(readFileFunction.execute({ filePath: nonExistentFile }))
            .rejects.toThrow();
      });

      it('should throw error when filePath is invalid', async () => {
         await expect(readFileFunction.execute({ filePath: '' }))
            .rejects.toThrow();
      });
   });

   describe('writeFileFunction', () => {
      it('should write content to file successfully', async () => {
         const result = await writeFileFunction.execute({
            filePath: testFilePath,
            content: testContent
         });

         expect(result).toContain('Successfully wrote to');

         const writtenContent = await fs.readFile(testFilePath, 'utf-8');
         expect(writtenContent).toBe(testContent);
      });

      it('should throw error when filePath is invalid', async () => {
         await expect(writeFileFunction.execute({
            filePath: '',
            content: testContent
         }))
            .rejects.toThrow();
      });

      it('should throw error when content is invalid', async () => {
         await expect(writeFileFunction.execute({
            filePath: testFilePath,
            content: undefined as any
         }))
            .rejects.toThrow();
      });
   });

   describe('listDirectoryFunction', () => {
      it('should list directory contents successfully', async () => {
         await fs.writeFile(testFilePath, testContent);
         const subDir = path.join(testDir, 'subdir');
         await fs.mkdir(subDir);

         const result = await listDirectoryFunction.execute({ directoryPath: testDir });

         expect(result).toContain('[FILE] test.txt');
         expect(result).toContain('[DIR] subdir');
      });

      it('should throw error when directory does not exist', async () => {
         const nonExistentDir = path.join(testDir, 'nonexistent');

         await expect(listDirectoryFunction.execute({ directoryPath: nonExistentDir }))
            .rejects.toThrow();
      });

      it('should throw error when directoryPath is invalid', async () => {
         await expect(listDirectoryFunction.execute({ directoryPath: '' }))
            .rejects.toThrow();
      });
   });
});
