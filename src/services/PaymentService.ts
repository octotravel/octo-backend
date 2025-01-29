import { BackendParams } from '@octocloud/core';

import { inject } from '@needle-di/core';
import type { IAPI } from '../api/Api';

export interface IPaymentService {
  getGateway: (params: BackendParams) => Promise<unknown>;
}

export class PaymentService implements IPaymentService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getGateway = async (params: BackendParams): Promise<unknown> => await this.api.getGateway(params);
}
