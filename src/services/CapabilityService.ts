import { BackendParams } from '@octocloud/core';
import { Capability } from '@octocloud/types';
import { inject, singleton } from 'tsyringe';
import type { IAPI } from '../api/Api';

export interface ICapabilityService {
  getCapabilities: (params: BackendParams) => Promise<Capability[]>;
}

@singleton()
export class CapabilityService implements ICapabilityService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getCapabilities = async (params: BackendParams): Promise<Capability[]> =>
    await this.api.getCapabilities(params);
}
