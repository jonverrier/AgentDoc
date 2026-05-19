/**
 * This module provides tests for the GenerateRollupC4Prompt module.
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import path from 'path';

import { C4DiagrammerName } from '../src/UIStrings.js';
import { PromptFileRepository, throwIfUndefined } from '@jonverrier/prompt-repository';
import { generateRollupC4DiagramPromptId } from '../src/PromptIds.js';

describe('GenerateRollupC4Prompt', () => {

   const repository = new PromptFileRepository(path.join(process.cwd(), 'src/Prompts.json'));
   const rollupC4Prompt = repository.getPrompt(generateRollupC4DiagramPromptId);
   throwIfUndefined(rollupC4Prompt);

  describe('validateGenerateRollupC4DiagramArgs', () => {
    it('should validate correct arguments', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);
      expect(result).toContain(args.rootDirectory);
      expect(result).toContain(args.c4Type);
    });

    it('should throw error when rootDirectory is undefined', () => {
      const args = {
        rootDirectory: undefined,
        c4Type: 'C4Context'
      };

      expect(() => repository.expandUserPrompt(rollupC4Prompt, args))
        .toThrow();
    });

    it('should throw error when c4Type is undefined', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: undefined
      };

      expect(() => repository.expandUserPrompt(rollupC4Prompt, args))
        .toThrow();
    });

    it('should throw error when c4Type is invalid type', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 1 as any
      };

      expect(() => repository.expandUserPrompt(rollupC4Prompt, args))
        .toThrow();
    });

    it('should throw error when c4Type is not an allowed value', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'InvalidC4Type'
      };

      expect(() => repository.expandUserPrompt(rollupC4Prompt, args))
        .toThrow();
    });

    it('should throw error when args is null', () => {
      expect(() => repository.expandUserPrompt(rollupC4Prompt, null as any))
        .toThrow();
    });
  });

  describe('expandGenerateRollupC4DiagramPrompt', () => {
    it('should generate correct prompt string for C4Context', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);

      expect(typeof result).toBe('string');
      expect(result).toContain('/test/path');
      expect(result).toContain('C4Context');
      expect(result).toContain('README.' + C4DiagrammerName + '.md');
      expect(result).toContain('C4Context.' + C4DiagrammerName + '.md');
    });

    it('should generate correct prompt string for C4Container', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Container'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);

      expect(result).toContain('C4Container');
      expect(result).toContain('C4Container.' + C4DiagrammerName + '.md');
    });

    it('should include all required C4 diagram instructions', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);

      expect(result).toContain('Person()');
      expect(result).toContain('Container()');
      expect(result).toContain('System()');
      expect(result).toContain('System_Boundary()');
      expect(result).toContain('System_Ext()');
      expect(result).toContain('Rel()');
    });

    it('should include tool instructions', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);

      expect(result).toContain('Use the ' + C4DiagrammerName + ' tool');
      expect(result).toContain('recursively search');
      expect(result).toContain('README.' + C4DiagrammerName + '.md');
    });

    it('should include validation instructions', () => {
      const args = {
        rootDirectory: '/test/path',
        c4Type: 'C4Context'
      };

      const result = repository.expandUserPrompt(rollupC4Prompt, args);

      expect(result).toContain('parse and validate');
      expect(result).toContain('valid Mermaid code');
    });
  });

  describe('generateRollupC4Prompt object', () => {
    it('should have all required properties', () => {
      expect(rollupC4Prompt).toHaveProperty('name');
      expect(rollupC4Prompt).toHaveProperty('description');
      expect(rollupC4Prompt).toHaveProperty('userPromptParameters');
    });
  });
});
