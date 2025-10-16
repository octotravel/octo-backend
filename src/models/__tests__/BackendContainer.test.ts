import { beforeEach, describe, expect, it } from 'vitest';
import { BackendContainer } from '../BackendContainer';

describe('BackendContainer', () => {
  beforeEach(() => {});

  describe('constructor', () => {
    it('should correctly initialize and set class properties', () => {
      const backendContainer = new BackendContainer({});
      expect(backendContainer.backend).toBeDefined();
    });
  });
});
