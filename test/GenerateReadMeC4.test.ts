/**
 * This module provides tests for the GenerateReadMePrompt module.
 * It includes tests for validating arguments and expanding prompts.
 *
 * Copyright Jon Verrier, 2025
 */

import { expect } from 'expect';
import path from 'path';
import { C4DiagrammerName } from '../src/UIStrings.js';
import { PromptFileRepository, throwIfUndefined } from '@jonverrier/prompt-repository';
import { generateReadmePromptId } from '../src/PromptIds.js';

describe('GenerateReadMePrompt', () => {

  const repository = new PromptFileRepository(path.join(process.cwd(), 'src/Prompts.json'));
  const readmePrompt = repository.getPrompt(generateReadmePromptId);
  throwIfUndefined(readmePrompt);

  describe('validateGenerateReadmeArgs', () => {
    it('should validate correct arguments with all parameters', () => {
      const args = {
        rootDirectory: '/test/path',
        languages: 'typescript2',
        wordCount: '101'
      };

      const result = repository.expandUserPrompt(readmePrompt, args);
      expect(result).toContain(args.rootDirectory);
      expect(result).toContain(args.languages);
      expect(result).toContain(args.wordCount);
    });

    it('should set default values when optional parameters are missing', () => {
      const args = {
        rootDirectory: '/test/path'
      };

      const result = repository.expandUserPrompt(readmePrompt, args);
      expect(result).toContain(args.rootDirectory);
      expect(result).toContain('Typescript');
      expect(result).toContain('50');
    });

    it('should throw error when rootDirectory is not present', () => {
      const args = {};

      expect(() => repository.expandUserPrompt(readmePrompt, args))
        .toThrow();
    });

    it('should throw error when rootDirectory is undefined', () => {
      const args = {
        rootDirectory: undefined
      };

      expect(() => repository.expandUserPrompt(readmePrompt, args))
        .toThrow();
    });

    it('should throw error when languages is not a string', () => {
      const args = {
        rootDirectory: '/test/path',
        languages: 123 as any
      };

      expect(() => repository.expandUserPrompt(readmePrompt, args))
        .toThrow();
    });

    it('should throw error when wordCount is not a number', () => {
      const args = {
        rootDirectory: '/test/path',
        wordCount: 'not-a-number'
      };

      expect(() => repository.expandUserPrompt(readmePrompt, args))
        .toThrow();
    });

    it('should throw error when args is null', () => {
      expect(() => repository.expandUserPrompt(readmePrompt, null as any))
        .toThrow();
    });
  });

  describe('expandGenerateReadmePrompt', () => {
    it('should generate correct prompt string with all parameters', () => {
      const args = {
        rootDirectory: '/test/path',
        languages: 'typescript',
        wordCount: '100'
      };

      const result = repository.expandUserPrompt(readmePrompt, args);

      expect(typeof result).toBe('string');
      expect(result).toContain('/test/path');
      expect(result).toContain('typescript');
      expect(result).toContain('100 word');
      expect(result).toContain('README.' + C4DiagrammerName + '.md');
    });

    it('should generate prompt with correct file system instructions', () => {
      const args = {
        rootDirectory: '/test/path',
        languages: 'javascript',
        wordCount: '75'
      };

      const result = repository.expandUserPrompt(readmePrompt, args);

      expect(result).toContain('Use the ' + C4DiagrammerName + ' tool');
      expect(result).toContain('README.' + C4DiagrammerName + '.md');
    });

    it('should mention all key operations in the prompt', () => {
      const args = {
        rootDirectory: '/test/path',
        languages: 'typescript',
        wordCount: '50'
      };

      const result = repository.expandUserPrompt(readmePrompt, args);

      expect(result).toContain('recursively list');
      expect(result).toContain('read every');
      expect(result).toContain('create a');
      expect(result).toContain('write a concatenated summary');
    });
  });

  describe('generateReadmePrompt object', () => {
    it('should have all required properties', () => {
      expect(readmePrompt).toHaveProperty('name');
      expect(readmePrompt).toHaveProperty('description');
      expect(readmePrompt).toHaveProperty('userPromptParameters');
    });
  });
});
