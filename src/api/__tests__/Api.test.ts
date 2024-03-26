import { beforeEach, describe, expect, it, vi } from 'vitest';
import { API } from '../Api';
import { BaseConfig, Environment, Logger, NullLogger, RequestContext, RequestMethod } from '@octocloud/core';
import { BeforeRequest } from '../..';

describe('API', () => {
  let api: API;
  let beforeRequest: BeforeRequest;
  let baseConfig: BaseConfig;
  let logger: Logger;
  let requestContext: RequestContext;

  beforeEach(() => {
    global.fetch = vi.fn(async () => {
      return await Promise.resolve(new Response());
    });

    beforeRequest = async ({ request }) => {
      return await Promise.resolve(request);
    };
    baseConfig = new BaseConfig({
      environment: Environment.TEST,
      productionURL: '',
      stagingURL: '',
    });
    logger = new NullLogger();
    api = new API(beforeRequest, baseConfig, logger);
    requestContext = new RequestContext({
      request: new Request('https://octo.ventrata.com', {
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    });

    requestContext.setConnection({
      id: '89d08dfb-6bff-4ad6-b01c-1b2f643fddce',
      supplierId: '56e214cb-cf04-4741-8851-92603d4bda3d',
      apiKey: '04c45167-d015-469f-9340-ca84e1d8655c',
      endpoint: 'https://octo.ventrata.com',
      accountId: '2635034e-3094-428b-b8f0-9d0cc0960c0c',
      name: 'testConnection',
    });
  });

  describe('fetch', () => {
    it('should succeed at first try', async () => {
      global.fetch = vi.fn().mockReturnValueOnce(Promise.resolve(new Response('', { status: 200 })));
      await api.fetch('https://octo.ventrata.com', RequestMethod.Get, {
        ctx: requestContext,
      });
      expect(requestContext.getSubrequest()[0].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(1);
    });

    it('should succeed at second retry', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      await api.fetch('https://octo.ventrata.com', RequestMethod.Get, {
        ctx: requestContext,
      });
      expect(requestContext.getSubrequest()[0].response.status).toBe(503);
      expect(requestContext.getSubrequest()[1].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(2);
    });

    it('should succeed at third retry', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('{}', { status: 200 })));
      await api.fetch('https://octo.ventrata.com', RequestMethod.Get, {
        ctx: requestContext,
      });
      expect(requestContext.getSubrequest()[0].response.status).toBe(503);
      expect(requestContext.getSubrequest()[1].response.status).toBe(502);
      expect(requestContext.getSubrequest()[2].response.status).toBe(200);
      expect(requestContext.getSubrequest().length).toBe(3);
    });

    it('should fail after three retries', async () => {
      global.fetch = vi
        .fn()
        .mockReturnValueOnce(Promise.resolve(new Response('503 Service Unavailable', { status: 503 })))
        .mockReturnValueOnce(Promise.resolve(new Response('502 Bad Gateway', { status: 502 })))
        .mockReturnValueOnce(Promise.resolve(new Response('500 Internal Server Error', { status: 500 })));
      await api.fetch('https://octo.ventrata.com', RequestMethod.Get, {
        ctx: requestContext,
      });
      const subrequests = requestContext.getSubrequest();
      expect(subrequests[0].response.status).toBe(503);
      expect(subrequests[1].response.status).toBe(502);
      expect(subrequests[2].response.status).toBe(500);
      expect(requestContext.getSubrequest().length).toBe(3);
    });
  });
});
