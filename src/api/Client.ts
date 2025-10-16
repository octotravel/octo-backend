import {
  Logger,
  ShouldForceRetryResult,
  SubRequestContext,
  fetchRetry,
} from '@octocloud/core';
import { v5 } from 'uuid';
import { BeforeRequest } from './../index';
import { OctoApiErrorHandler } from './ErrorHandler';
import { BackendParams } from '../types/Params';

interface ApiClientParams extends BackendParams {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  body?: Record<string, any> | any[];
  headers?: HeadersInit;
}

export enum RequestMethod {
  Get = 'GET',
  Post = 'POST',
  Put = 'PUT',
  Patch = 'PATCH',
  Delete = 'DELETE',
  Head = 'HEAD',
  Options = 'OPTIONS',
}

export abstract class APIClient {
  private readonly errorHandler = new OctoApiErrorHandler();

  public constructor(
    private readonly beforeRequest: BeforeRequest,
    private readonly logger: Logger,
  ) {}

  protected get = async (url: string, params: ApiClientParams): Promise<Response> => {
    return await this.fetch(url, RequestMethod.Get, params);
  };

  protected post = async (url: string, params: ApiClientParams): Promise<Response> => {
    return await this.fetch(url, RequestMethod.Post, params);
  };

  protected put = async (url: string, params: ApiClientParams): Promise<Response> => {
    return await this.fetch(url, RequestMethod.Put, params);
  };

  protected delete = async (url: string, params: ApiClientParams): Promise<Response> => {
    return await this.fetch(url, RequestMethod.Delete, params);
  };

  protected patch = async (url: string, params: ApiClientParams): Promise<Response> => {
    return await this.fetch(url, RequestMethod.Patch, params);
  };

  public readonly fetch = async (url: string, method: RequestMethod, params: ApiClientParams): Promise<Response> => {
    const request = await this.createRequest(url, method, params);
    const req = await this.beforeRequest({ request });
    const subRequestContext = new SubRequestContext({
      request: req,
      requestId: params.ctx.getRequestId(),
      accountId: params.ctx.getAccountId(),
    });

    const res = await fetchRetry(req, {
      subRequestContext,
      shouldForceRetry: async (response: Response): Promise<ShouldForceRetryResult> => {
        try {
          if (response.status !== 400) {
            return { forceRetry: false, retryAfter: 0 };
          }

          const jsonResponse = await response.json();

          if (jsonResponse?.error === 'TOO_MANY_REQUESTS' && jsonResponse?.retryAfter > 0) {
            return { forceRetry: true, retryAfter: jsonResponse.retryAfter };
          }

          return { forceRetry: false, retryAfter: 0 };
        } catch (e: unknown) {
          return { forceRetry: false, retryAfter: 0 };
        }
      },
    });
    const subRequestData = subRequestContext.getRequestData();
    params.ctx.addSubrequest(subRequestData);

    if (res.status < 200 || res.status >= 400) {
      await this.errorHandler.handleError(res, subRequestData, params.ctx);
    }

    return res;
  };

  private readonly createRequest = async (
    url: string,
    method: RequestMethod,
    params: ApiClientParams,
  ): Promise<Request> => {
    params.ctx.getEnvironment()
    const env = params.ctx.getEnvironment() === 'production' ? 'live' : 'test';
    const connection = params.ctx.getConnection();
    const headersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${connection.apiKey}`,
      'Octo-Capabilities': this.mapCapabilities(params),
      'Octo-Env': env,
      'Ventrata-Parent-Request-ID': params.ctx.getRequestId(),
      'Ventrata-Ratelimit-Key': connection.id,
    };

    const headers: Record<string, string> = params.headers ? Object.assign(headersInit, params?.headers) : headersInit;

    const body = this.prepareBody(params.body);

    if (params.useIdempotency) {
      const mainRequest = params.ctx.getRequest().clone();
      let mainRequestBody = '';
      try {
        mainRequestBody = await mainRequest.json();
      } catch (_) {
        mainRequestBody = '';
      }
      const hash = JSON.stringify({
        method: mainRequest.method,
        url: mainRequest.url,
        body: mainRequestBody,
        reqUrl: url,
        reqBody: body,
      });

      const uuid = v5(hash, 'de36ac66-f18f-50a9-86af-98988fd343df');
      headers['Idempotency-Key'] = uuid;
    }

    if (params.useQueueOverflow === true) {
      headers['Ventrata-Queue-Overflow'] = 'true';
    }

    return new Request(url, {
      body,
      headers,
      method,
    });
  };

  private readonly prepareBody = (body?: Record<string, unknown> | unknown[]): string | null => {
    if (body) {
      if (Array.isArray(body)) {
        return JSON.stringify(body);
      } else {
        return JSON.stringify(Object.fromEntries(Object.entries(body).filter(([_, v]) => v != null)));
      }
    }

    return null;
  };

  private readonly mapCapabilities = (params: ApiClientParams): string => {
    const request = params.ctx.getRequest();
    const capabilitiesHeader = request.headers.get('Octo-Capabilities');
    if (capabilitiesHeader) {
      return capabilitiesHeader;
    }
    const capabilities = params.capabilities ?? [];
    if (capabilities.length > 0) {
      return capabilities.join(', ');
    }
    return '';
  };
}
