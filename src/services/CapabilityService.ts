import { inject, singleton } from "tsyringe"
import {
  Capability
} from "@octocloud/types";
import { BackendParams } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface ICapabilityService {
  getCapabilities(params: BackendParams): Promise<Capability[]>;
}

@singleton()
export class CapabilityService implements ICapabilityService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public getCapabilities = (params: BackendParams): Promise<Capability[]> =>
    this.api.getCapabilities(params);
}
