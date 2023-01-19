import { Mapping } from "@octocloud/types";
import { inject, singleton } from "tsyringe";
import { BackendParams, UpdateMappingsSchema, GetMappingsSchema } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IMappingService {
  updateMappings(
    schema: UpdateMappingsSchema,
    params: BackendParams,
  ): Promise<void>;
  getMappings(schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]>;
}

@singleton()
export class MappingService implements IMappingService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public updateMappings = (
    schema: UpdateMappingsSchema,
    params: BackendParams,
  ): Promise<void> => this.api.updateMappings(schema, params);

  public getMappings = (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> =>
    this.api.getMappings(schema, params);
}
