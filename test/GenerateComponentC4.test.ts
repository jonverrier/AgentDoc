/**
 * This module provides tests for the GenerateComponentC4Prompt module.
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import path from 'path';
import { C4DiagrammerName } from '../src/UIStrings.js';
import { generateComponentC4DiagramPromptId } from '../src/PromptIds.js';
import { PromptFileRepository, throwIfUndefined } from '@jonverrier/prompt-repository';

describe('GenerateComponentC4Prompt', () => {

   const repository = new PromptFileRepository(path.join(process.cwd(), 'src/Prompts.json'));
   const componentC4Prompt = repository.getPrompt(generateComponentC4DiagramPromptId);
   throwIfUndefined(componentC4Prompt);

  describe('validateGenerateComponentC4DiagramArgs', () => {
    it('should validate correct arguments', () => {
      const args = {
        rootDirectory: '/test/path'
      };

      const result = repository.expandUserPrompt(componentC4Prompt, args);
      expect(result).toContain(args.rootDirectory);
    });

    it('should throw error when rootDirectory is undefined', () => {
      const args = {
        rootDirectory: undefined
      };

      expect(() => repository.expandUserPrompt(componentC4Prompt, args))
        .toThrow();
    });

    it('should throw error when rootDirectory is not a string', () => {
      const args = {
        rootDirectory: 123 as any
      };

      expect(() => repository.expandUserPrompt(componentC4Prompt, args))
        .toThrow();
    });

    it('should throw error when args is null', () => {
      expect(() => repository.expandUserPrompt(componentC4Prompt, null as any))
        .toThrow();
    });
  });

  describe('expandGenerateComponentC4DiagramPrompt', () => {
    it('should generate correct prompt string with given rootDirectory', () => {
      const args = {
        rootDirectory: '/test/path'
      };

      const result = repository.expandUserPrompt(componentC4Prompt, args);

      expect(typeof result).toBe('string');
      expect(result).toContain('/test/path');
      expect(result).toContain('Use the ' + C4DiagrammerName + ' tool');
      expect(result).toContain('C4Component.' + C4DiagrammerName + '.md');
    });

    it('should include all required C4 diagram instructions', () => {
      const args = {
        rootDirectory: '/test/path'
      };

      const result = repository.expandUserPrompt(componentC4Prompt, args);

      expect(result).toContain('C4Component');
      expect(result).toContain('Person()');
      expect(result).toContain('Container()');
      expect(result).toContain('System()');
      expect(result).toContain('System_Boundary()');
      expect(result).toContain('System_Ext()');
      expect(result).toContain('Rel()');
    });

    it('should include validation instructions', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(componentC4Prompt, args);

      expect(result).toContain('parse and validate');
      expect(result).toContain('valid Mermaid code');
    });
  });

  describe('generateComponentC4Prompt object', () => {
    it('should have all required properties', () => {
      expect(componentC4Prompt).toHaveProperty('name');
      expect(componentC4Prompt).toHaveProperty('description');
      expect(componentC4Prompt).toHaveProperty('userPromptParameters');
    });
  });
});
