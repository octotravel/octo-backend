import { inject, singleton } from 'tsyringe';

import {
  BackendParams,
  CancelOrderSchema,
  ConfirmOrderSchema,
  CreateOrderSchema,
  ExtendOrderSchema,
  GetOrderSchema,
  UpdateOrderSchema,
} from '@octocloud/core';
import { Order } from '@octocloud/types';
import type { IAPI } from '../api/Api';

export interface IOrderService {
  createOrder: (schema: CreateOrderSchema, params: BackendParams) => Promise<Order>;
  updateOrder: (schema: UpdateOrderSchema, params: BackendParams) => Promise<Order>;
  getOrder: (schema: GetOrderSchema, params: BackendParams) => Promise<Order>;
  confirmOrder: (schema: ConfirmOrderSchema, params: BackendParams) => Promise<Order>;
  cancelOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  deleteOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  extendOrder: (schema: ExtendOrderSchema, params: BackendParams) => Promise<Order>;
}

@singleton()
export class OrderService implements IOrderService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public createOrder = async (schema: CreateOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.createOrder(schema, params);

  public updateOrder = async (schema: UpdateOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.updateOrder(schema, params);

  public getOrder = async (schema: GetOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.getOrder(schema, params);

  public confirmOrder = async (schema: ConfirmOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.confirmOrder(schema, params);

  public cancelOrder = async (schema: CancelOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.cancelOrder(schema, params);

  public deleteOrder = async (schema: CancelOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.deleteOrder(schema, params);

  public extendOrder = async (schema: ExtendOrderSchema, params: BackendParams): Promise<Order> =>
    await this.api.extendOrder(schema, params);
}
