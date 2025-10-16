import { CoreParams } from '@octocloud/core';
import { CapabilityId } from '@octocloud/types';

export interface BackendParams extends CoreParams {
  capabilities?: CapabilityId[];
}