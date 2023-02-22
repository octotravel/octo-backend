import { inject, singleton } from "tsyringe";
import { BackendParams,
 } from '@octocloud/core';
import type { IAPI } from "../api/Api";
import { CreateWebhookBodyParamsSchema, DeleteWebhookPathParamsSchema, Webhook } from "@octocloud/types";

export interface IWebhookService {
  createWebhook(
    schema: CreateWebhookBodyParamsSchema,
    params: BackendParams,
  ): Promise<Webhook>;
  deleteWebhook(schema: DeleteWebhookPathParamsSchema, params: BackendParams): Promise<void>;
  listWebhooks(params: BackendParams): Promise<Webhook[]>;
}

@singleton()
export class WebhookService implements IWebhookService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public createWebhook = (
    schema: CreateWebhookBodyParamsSchema,
    params: BackendParams,
  ): Promise<Webhook> => this.api.createWebhook(schema, params);

  public deleteWebhook = (
    schema: DeleteWebhookPathParamsSchema,
    params: BackendParams,
  ): Promise<void> => this.api.deleteWebhook(schema, params);

  public listWebhooks = (params: BackendParams): Promise<Webhook[]> =>
    this.api.listWebhooks(params);
}
