import { v5 } from 'uuid';
import {
  OctoBackend,
  BaseConfig,
  SubRequestContext,
  BackendParams
} from "@octocloud/core";
import { BeforeRequest } from './../index';
import { OctoApiErrorHandler } from "./ErrorHandler";


interface ApiClientParams extends BackendParams {
  body?: { [key: string]: any } | Array<any>;
  headers?: HeadersInit;
};

export enum RequestMethod {
  Get = "GET",
  Post = "POST",
  Put = "PUT",
  Patch = "PATCH",
  Delete = "DELETE",
  Head = "HEAD",
  Options = "OPTIONS",
}

export abstract class APIClient {
  private errorHandler = new OctoApiErrorHandler();

  constructor(private beforeRequest: BeforeRequest, private config: BaseConfig) {}

  protected get = (url: string, params: ApiClientParams): Promise<Response> => {
    return this.fetch(url, RequestMethod.Get, params);
  };

  protected post = (
    url: string,
    params: ApiClientParams,
  ): Promise<Response> => {
    return this.fetch(url, RequestMethod.Post, params);
  };

  protected put = (url: string, params: ApiClientParams): Promise<Response> => {
    return this.fetch(url, RequestMethod.Put, params);
  };

  protected delete = (
    url: string,
    params: ApiClientParams,
  ): Promise<Response> => {
    return this.fetch(url, RequestMethod.Delete, params);
  };

  protected patch = (
    url: string,
    params: ApiClientParams,
  ): Promise<Response> => {
    return this.fetch(url, RequestMethod.Patch, params);
  };

  private fetch = async (
    url: string,
    method: RequestMethod,
    params: ApiClientParams,
    retryAttempt = 0,
  ): Promise<Response> => {
    console.log(new Date().toISOString(), method, url);
    const subRequestContext = new SubRequestContext();
    const request = await this.createRequest(url, method, params);
    const req = await this.beforeRequest({ request });
    subRequestContext.initRequestData({
      request: req.clone(),
      requestId: params.ctx.getRequestId(),
      accountId: params.ctx.getAccountId(),
    });

    const res = await fetch(req);

    const requestData = subRequestContext.getRequestData(res);
    params.ctx.addSubrequest(requestData.clone());

    const { shouldRetry } = await this.errorHandler.handleError(
      requestData,
      params.ctx,
      subRequestContext.getSubRequestId(),
      retryAttempt,
    );

    if (shouldRetry) {
      await this.delay(Math.pow(3, retryAttempt + 1) * 1000);
      return this.fetch(url, method, params, retryAttempt + 1);
    }
    return res.clone();
  };

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private createRequest = async (
    url: string,
    method: RequestMethod,
    params: ApiClientParams,
  ): Promise<Request> => {
    const env = this.config.isProduction ? "live" : "test";
    const connection = params.ctx.getConnection()
    const headersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${connection.apiKey}`,
      "Octo-Capabilities": this.mapCapabilities(params),
      "Octo-Env": env,
      "Ventrata-Parent-Request-ID": params.ctx.getRequestId(),
    };

    const headers: {[key:string]: string} = params.headers
      ? Object.assign(headersInit, params?.headers)
      : headersInit;

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
      body: body,
      headers: headers,
      method: method,
    });
  };

  private prepareBody = (body?: Record<string, unknown> | Array<unknown>) => {
    if (body) {
      if (Array.isArray(body)) {
        return JSON.stringify(body);
      } else {
        return JSON.stringify(
          Object.fromEntries(
            Object.entries(body).filter(([_, v]) => v != null),
          ),
        );
      }
    }

    return null;
  };

  private mapCapabilities = (params: ApiClientParams): string => {
    const request = params.ctx.getRequest();
    const capabilitiesHeader = request.headers.get("Octo-Capabilities");
    if (capabilitiesHeader) {
      return capabilitiesHeader;
    }
    const capabilities = params.capabilities ?? [];
    if (capabilities.length > 0) {
      return capabilities.join(", ");
    }
    return "";
  };
}
