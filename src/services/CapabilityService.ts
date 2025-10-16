import { inject } from '@needle-di/core';
import { Capability } from '@octocloud/types';
import type { IAPI } from '../api/Api';
import { BackendParams } from '../types/Params';

export interface ICapabilityService {
  getCapabilities: (params: BackendParams) => Promise<Capability[]>;
}

export class CapabilityService implements ICapabilityService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getCapabilities = async (params: BackendParams): Promise<Capability[]> =>
    await this.api.getCapabilities(params);
}
