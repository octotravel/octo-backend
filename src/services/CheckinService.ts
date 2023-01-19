import { inject, singleton } from "tsyringe"
import { BackendParams, LookupSchema } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface ICheckInService {
  lookup(schema: LookupSchema, params: BackendParams): Promise<unknown>;
}

@singleton()
export class CheckInService implements ICheckInService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public lookup = (
    schema: LookupSchema,
    params: BackendParams,
  ): Promise<unknown> => this.api.lookup(schema, params);
}
