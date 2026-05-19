/**
 * Test cases for the detectMermaidDiagramType function
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import { detectMermaidDiagramType, parseMermaid, parseMermaidInBrowser, noErrors } from '../src/ParseMermaid.js';
import { C4DiagrammerName } from '../src/UIStrings.js';

const diagramWithSyntaxError = `C4Component
    title Component diagram for ${C4DiagrammerName} Test Suite

    Person(tester, "Test Developer", "Maintains test suite")

    System_Boundary(test_suite, "${C4DiagrammerName} Test Suite") {
        Component(generator_tests, "Generator Tests", "Tests for README and C4 diagram generation")
        Component(mermaid_tests, "Mermaid Tests", "Tests for diagram parsing and preview")
        Component(util_tests, "Utility Tests", "Tests for regeneration logic")

        Rel(generator_tests, mermaid_tests, "Uses", "Validates diagram output")
        Rel(mermaid_tests, util_tests, "Uses", "Validates file handling")
    }

    System_Ext(chai, "Chai", "Testing assertion library")
    System_Ext(mermaidjs, "Mermaid.js", "Diagram library being tested")

    Rel(tester, test_suite, "Maintains", "Writes and runs tests")
    Rel(mermaid_tests, mermaidjs, "Tests", "Diagram functionality")`;

const diagramWithNoError = `C4Component
    title Component diagram for ${C4DiagrammerName} Test Suite

    Person(tester, "Test Developer", "Maintains test suite")

    System_Boundary(test_suite, "${C4DiagrammerName} Test Suite") {
        Component(generator_tests, "Generator Tests", "Tests for README and C4 diagram generation")
        Component(mermaid_tests, "Mermaid Tests", "Tests for diagram parsing and preview")
        Component(util_tests, "Utility Tests", "Tests for regeneration logic")

        Rel(generator_tests, mermaid_tests, "Uses", "Validates diagram output")
        Rel(mermaid_tests, util_tests, "Uses", "Validates file handling")
    }

    System_Ext(chai, "Chai", "Testing assertion library")
    System_Ext(mermaidjs, "Mermaid.js", "Diagram library being tested")

    Rel(tester, generator_tests, "Maintains", "Writes and runs tests")
    Rel(mermaid_tests, mermaidjs, "Tests", "Diagram functionality")`;

describe('detectMermaidDiagramType', () => {
   it('should detect a valid flowchart diagram', async () => {
      const input = `
            flowchart LR
                A --> B`;
      expect(await detectMermaidDiagramType(input)).toBe('flowchart-v2');
   });

   it('should detect a valid sequence diagram', async () => {
      const input = `
            sequenceDiagram
                Alice->>John: Hello John, how are you?
                John-->>Alice: Great!`;
      expect(await detectMermaidDiagramType(input)).toBe('sequence');
   });

   it('should detect a valid C4 diagram', async () => {
      const input = `
            C4Component
                title Component diagram
                Container_Boundary(b1, "boundary") {
                    Component(c1, "component")
                }`;
      expect(await detectMermaidDiagramType(input)).toBe('c4');
   });

   it('should handle input without mermaid code fence markers', async () => {
      const input = `
            flowchart LR
                A --> B
        `;
      expect(await detectMermaidDiagramType(input)).toBe('flowchart-v2');
   });

   it('should handle mangled syntax', async () => {
      const input = `
          flewchart LR
              A --> B
              Banana
      `;
      expect(await detectMermaidDiagramType(input)).toBe('');
   });

   it('should return empty string for invalid diagram syntax', async () => {
      const input = `
            invalid diagram syntax`;
      expect(await detectMermaidDiagramType(input)).toBe('');
   });

   it('should handle empty input', async () => {
      expect(await detectMermaidDiagramType('')).toBe('');
   });

   it('should handle whitespace-only input', async () => {
      expect(await detectMermaidDiagramType('   \n   \t   ')).toBe('');
   });

   it('should handle code fence markers', async () => {
      const input = `
          \`\`\`mermaid
          flowchart LR
              A --> B
          \`\`\`
      `;
      expect(await detectMermaidDiagramType(input)).toBe('flowchart-v2');
   });

   it('should handle multiple code fence markers', async () => {
      const input = `
            \`\`\`mermaid
            \`\`\`mermaid
            flowchart LR
                A --> B
            \`\`\`
            \`\`\`
        `;
      expect(await detectMermaidDiagramType(input)).toBe('flowchart-v2');
   });
});


describe('parseMermaid', () => {
   it('should validate correct flowchart syntax', async () => {
      const input = `
            flowchart LR
                A --> B
        `;
      expect(await parseMermaid(input)).toBe(noErrors);
   });

   it('should detect simple syntax errors', async () => {
      const input = `
            flochart LR
                A --- > B
        `;
      expect(await parseMermaid(input)).not.toBe(noErrors);
   });

   it('should detect C4 syntax errors', async () => {
      const input = diagramWithSyntaxError;
      expect(await parseMermaidInBrowser(input)).not.toBe(noErrors);
   }, 60_000);

   it('should pass C4 without syntax errors', async () => {
      const input = diagramWithNoError;
      expect(await parseMermaidInBrowser(input)).toBe(noErrors);
   }, 60_000);

   it('should handle empty input', async () => {
      expect(await parseMermaid('')).not.toBe(noErrors);
   });

   it('should handle whitespace-only input', async () => {
      expect(await parseMermaid('   \n   \t   ')).not.toBe(noErrors);
   });

   it('should validate diagram with code fence markers', async () => {
      const input = `
            \`\`\`mermaid
            flowchart LR
                A --> B
            \`\`\`
        `;
      expect(await parseMermaid(input)).toBe(noErrors);
   });

   it('should validate sequence diagram syntax', async () => {
      const input = `
            sequenceDiagram
                Alice->>John: Hello John, how are you?
                John-->>Alice: Great!
        `;
      expect(await parseMermaid(input)).toBe(noErrors);
   });

   it('should detect errors in sequence diagram', async () => {
      const input = `
            sequenceDiagram
                Alice calls John: Missing arrow
        `;
      expect(await parseMermaid(input)).not.toBe(noErrors);
   });

   it('should detect errors in malformed diagram', async () => {
      const input = `
            This is not a valid diagram
            Just some random text
        `;
      expect(await parseMermaid(input)).not.toBe(noErrors);
   });
});
