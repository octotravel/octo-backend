import { Mapping } from '@octocloud/types';
import { inject, singleton } from 'tsyringe';
import { BackendParams, UpdateMappingsSchema, GetMappingsSchema } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface IMappingService {
  updateMappings: (schema: UpdateMappingsSchema, params: BackendParams) => Promise<void>;
  getMappings: (schema: GetMappingsSchema, params: BackendParams) => Promise<Mapping[]>;
}

@singleton()
export class MappingService implements IMappingService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public updateMappings = async (schema: UpdateMappingsSchema, params: BackendParams): Promise<void> => {
    await this.api.updateMappings(schema, params);
  };

  public getMappings = async (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> =>
    await this.api.getMappings(schema, params);
}
