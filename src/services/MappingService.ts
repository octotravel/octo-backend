import { BackendParams, GetMappingsSchema, UpdateMappingsSchema } from '@octocloud/core';
import { Mapping } from '@octocloud/types';

import { inject } from '@needle-di/core';
import type { IAPI } from '../api/Api';

export interface IMappingService {
  updateMappings: (schema: UpdateMappingsSchema, params: BackendParams) => Promise<void>;
  getMappings: (schema: GetMappingsSchema, params: BackendParams) => Promise<Mapping[]>;
}

export class MappingService implements IMappingService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public updateMappings = async (schema: UpdateMappingsSchema, params: BackendParams): Promise<void> => {
    await this.api.updateMappings(schema, params);
  };

  public getMappings = async (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> =>
    await this.api.getMappings(schema, params);
}
