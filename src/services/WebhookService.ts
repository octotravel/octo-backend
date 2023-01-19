import { inject, singleton } from "tsyringe";
import { BackendParams,
  CreateWebhookSchema,
  DeleteWebhookSchema,
  Webhook,
 } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IWebhookService {
  createWebhook(
    schema: CreateWebhookSchema,
    params: BackendParams,
  ): Promise<Webhook>;
  deleteWebhook(schema: DeleteWebhookSchema, params: BackendParams): Promise<void>;
  listWebhooks(params: BackendParams): Promise<Webhook[]>;
}

@singleton()
export class WebhookService implements IWebhookService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public createWebhook = (
    schema: CreateWebhookSchema,
    params: BackendParams,
  ): Promise<Webhook> => this.api.createWebhook(schema, params);

  public deleteWebhook = (
    schema: DeleteWebhookSchema,
    params: BackendParams,
  ): Promise<void> => this.api.deleteWebhook(schema, params);

  public listWebhooks = (params: BackendParams): Promise<Webhook[]> =>
    this.api.listWebhooks(params);
}
