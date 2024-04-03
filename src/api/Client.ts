import { v5 } from 'uuid';
import { OctoBackend, BaseConfig, SubRequestContext, BackendParams, Logger, fetchRetry } from '@octocloud/core';
import { BeforeRequest } from './../index';
import { OctoApiErrorHandler } from './ErrorHandler';

interface ApiClientParams extends BackendParams {
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
    private readonly config: BaseConfig,
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
    this.logger.log(`${new Date().toISOString()} ${method} ${url}`);

    const request = await this.createRequest(url, method, params);
    const req = await this.beforeRequest({ request });

    const res = await fetchRetry(req, undefined, { params });

    if (res.status < 200 || res.status >= 400) {
      await this.errorHandler.handleError(res, params.ctx);

      return res.clone();
    }

    return res;
  };

  private readonly createRequest = async (
    url: string,
    method: RequestMethod,
    params: ApiClientParams,
  ): Promise<Request> => {
    const env = this.config.isProduction ? 'live' : 'test';
    const connection = params.ctx.getConnection();
    const headersInit = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${connection.apiKey}`,
      'Octo-Capabilities': this.mapCapabilities(params),
      'Octo-Env': env,
      'Ventrata-Parent-Request-ID': params.ctx.getRequestId(),
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
