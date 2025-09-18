import { BaseConfig, Environment } from '@octocloud/core';
import { beforeEach, describe, expect, it } from 'vitest';
import { BackendContainer } from '../BackendContainer';

describe('BackendContainer', () => {
  beforeEach(() => {});

  describe('constructor', () => {
    it('should correctly initialize and set class properties', () => {
      const baseConfig = new BaseConfig({
        environment: Environment.TEST,
        productionURL: '',
        stagingURL: '',
        alertWebhookURL: '',
      });

      const backendContainer = new BackendContainer({ config: baseConfig });
      expect(backendContainer.backend).toBeDefined();
    });
  });
});
