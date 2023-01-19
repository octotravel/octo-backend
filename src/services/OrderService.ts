import { inject, singleton } from "tsyringe"

import { BackendParams, CancelOrderSchema,
  ConfirmOrderSchema,
  CreateOrderSchema,
  ExtendOrderSchema,
  GetOrderSchema,
  UpdateOrderSchema, } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IOrderService {
  createOrder(schema: CreateOrderSchema, params: BackendParams): Promise<unknown>;
  updateOrder(schema: UpdateOrderSchema, params: BackendParams): Promise<unknown>;
  getOrder(schema: GetOrderSchema, params: BackendParams): Promise<unknown>;
  confirmOrder(schema: ConfirmOrderSchema, params: BackendParams): Promise<unknown>;
  cancelOrder(schema: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  deleteOrder(schema: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  extendOrder(schema: ExtendOrderSchema, params: BackendParams): Promise<unknown>;
}

@singleton()
export class OrderService implements IOrderService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public createOrder = (
    schema: CreateOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.createOrder(schema, params);

  public updateOrder = (
    schema: UpdateOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.updateOrder(schema, params);

  public getOrder = (
    schema: GetOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.getOrder(schema, params);

  public confirmOrder = (
    schema: ConfirmOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.confirmOrder(schema, params);

  public cancelOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.cancelOrder(schema, params);

  public deleteOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.deleteOrder(schema, params);

  public extendOrder = (
    schema: ExtendOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.extendOrder(schema, params);
}
