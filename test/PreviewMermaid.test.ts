/**
 * Tests for the previewMermaidDiagram function.
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import { previewMermaidDiagram, previewMermaidDiagramFromFile } from '../src/PreviewMermaid.js';
import fs from 'fs';

describe('PreviewMermaidDiagram', () => {

   function verifyMermaidPreview(tempFile: string, diagram: string) {
      expect(tempFile.length).toBeGreaterThan(0);
      expect(fs.existsSync(tempFile)).toBe(true);
      expect(tempFile).toContain('preview');

      const content = fs.readFileSync(tempFile, 'utf8');
      expect(content).toContain(diagram);
      expect(content).toContain('mermaid.initialize');
      expect(content).toContain('<script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js">');
      expect(content).toContain('<pre class="mermaid">');
   }

   describe('previewMermaidDiagram', () => {

      it('should create HTML file with mermaid diagram', async () => {
         const diagram = 'graph TD; A-->B;';

         const tempFile = previewMermaidDiagram(diagram);
         verifyMermaidPreview(tempFile, diagram);
      });

      it('should handle empty diagram text', async () => {
         const tempFile = previewMermaidDiagram('');
         expect(fs.existsSync(tempFile)).toBe(true);
      });
   });

   describe('previewMermaidDiagramFromFile', () => {

      it('should successfully read file and return preview', () => {
        const testContent = '```mermaid\ngraph TD\nA-->B\n```';

        const tempPath = `${process.env.TEMP || '/tmp'}/test-${Date.now()}.html`;
        fs.writeFileSync(tempPath, testContent);

        const result = previewMermaidDiagramFromFile(tempPath);

        verifyMermaidPreview(result, testContent);
      });

      it('should return empty string when file does not exist', () => {
        const tempFile = previewMermaidDiagramFromFile('');
        expect(fs.existsSync(tempFile)).toBe(false);
      });

      it('should handle empty file content', () => {
         const tempPath = `${process.env.TEMP || '/tmp'}/test-${Date.now()}.html`;
         fs.writeFileSync(tempPath, '');

        const tempFile = previewMermaidDiagramFromFile(tempPath);
        expect(fs.existsSync(tempFile)).toBe(true);
      });
    });
});
