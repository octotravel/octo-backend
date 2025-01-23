import { BackendParams, LookupSchema } from '@octocloud/core';

import { inject } from '@needle-di/core';
import type { IAPI } from '../api/Api';

export interface ICheckInService {
  lookup: (schema: LookupSchema, params: BackendParams) => Promise<unknown>;
}

export class CheckInService implements ICheckInService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public lookup = async (schema: LookupSchema, params: BackendParams): Promise<unknown> =>
    await this.api.lookup(schema, params);
}
