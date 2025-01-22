import { BackendParams } from '@octocloud/core';
import { CreateWebhookBodyParamsSchema, DeleteWebhookPathParamsSchema, Webhook } from '@octocloud/types';
import { inject, singleton } from 'tsyringe';
import type { IAPI } from '../api/Api';

export interface IWebhookService {
  createWebhook: (schema: CreateWebhookBodyParamsSchema, params: BackendParams) => Promise<Webhook>;
  deleteWebhook: (schema: DeleteWebhookPathParamsSchema, params: BackendParams) => Promise<void>;
  listWebhooks: (params: BackendParams) => Promise<Webhook[]>;
}

@singleton()
export class WebhookService implements IWebhookService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public createWebhook = async (schema: CreateWebhookBodyParamsSchema, params: BackendParams): Promise<Webhook> =>
    await this.api.createWebhook(schema, params);

  public deleteWebhook = async (schema: DeleteWebhookPathParamsSchema, params: BackendParams): Promise<void> => {
    await this.api.deleteWebhook(schema, params);
  };

  public listWebhooks = async (params: BackendParams): Promise<Webhook[]> => await this.api.listWebhooks(params);
}
