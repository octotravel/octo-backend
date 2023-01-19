import { inject, singleton } from "tsyringe"
import { BackendParams } from '@octocloud/core';
import type {  IAPI } from "../api/Api";

export interface IPaymentService {
  getGateway(params: BackendParams): Promise<unknown>;
}

@singleton()
export class PaymentService implements IPaymentService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public getGateway = (params: BackendParams): Promise<unknown> =>
    this.api.getGateway(params);
}
