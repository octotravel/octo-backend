import { inject, singleton } from 'tsyringe';
import { BackendParams, LookupSchema } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface ICheckInService {
  lookup: (schema: LookupSchema, params: BackendParams) => Promise<unknown>;
}

@singleton()
export class CheckInService implements ICheckInService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public lookup = async (schema: LookupSchema, params: BackendParams): Promise<unknown> =>
    await this.api.lookup(schema, params);
}
