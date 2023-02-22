import { inject, singleton } from "tsyringe"

import { BackendParams, CancelOrderSchema,
  ConfirmOrderSchema,
  CreateOrderSchema,
  ExtendOrderSchema,
  GetOrderSchema,
  UpdateOrderSchema, } from '@octocloud/core';
import type { IAPI } from "../api/Api";
import { Order } from "@octocloud/types";

export interface IOrderService {
  createOrder(schema: CreateOrderSchema, params: BackendParams): Promise<Order>;
  updateOrder(schema: UpdateOrderSchema, params: BackendParams): Promise<Order>;
  getOrder(schema: GetOrderSchema, params: BackendParams): Promise<Order>;
  confirmOrder(schema: ConfirmOrderSchema, params: BackendParams): Promise<Order>;
  cancelOrder(schema: CancelOrderSchema, params: BackendParams): Promise<Order>;
  deleteOrder(schema: CancelOrderSchema, params: BackendParams): Promise<Order>;
  extendOrder(schema: ExtendOrderSchema, params: BackendParams): Promise<Order>;
}

@singleton()
export class OrderService implements IOrderService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public createOrder = (
    schema: CreateOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.createOrder(schema, params);

  public updateOrder = (
    schema: UpdateOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.updateOrder(schema, params);

  public getOrder = (
    schema: GetOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.getOrder(schema, params);

  public confirmOrder = (
    schema: ConfirmOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.confirmOrder(schema, params);

  public cancelOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.cancelOrder(schema, params);

  public deleteOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.deleteOrder(schema, params);

  public extendOrder = (
    schema: ExtendOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.api.extendOrder(schema, params);
}
