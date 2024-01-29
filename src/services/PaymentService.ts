import { inject, singleton } from 'tsyringe';
import { BackendParams } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface IPaymentService {
  getGateway: (params: BackendParams) => Promise<unknown>;
}

@singleton()
export class PaymentService implements IPaymentService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getGateway = async (params: BackendParams): Promise<unknown> => await this.api.getGateway(params);
}
