import { BackendType } from '@octocloud/core';
import { object, ObjectSchema, string } from 'yup';

export interface OctoConnectionBackend {
  type: BackendType.octo;
  endpoint: string;
  apiKey: string;
  supplierId: string;
}

export interface OctoConnectionPatchBackend {
  type: BackendType.octo;
  endpoint?: string;
  apiKey?: string;
  supplierId?: string;
}

export const connectionSchema: ObjectSchema<OctoConnectionBackend> = object().shape({
  type: string<BackendType.octo>().required(),
  endpoint: string().url().required(),
  apiKey: string().required(),
  supplierId: string().required(),
});

export const connectionPatchSchema: ObjectSchema<OctoConnectionPatchBackend> = object().shape({
  type: string<BackendType.octo>().required(),
  endpoint: string().url().optional(),
  apiKey: string().optional(),
  supplierId: string().optional(),
});
