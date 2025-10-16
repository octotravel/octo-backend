import { Supplier } from '@octocloud/types';

import { inject } from '@needle-di/core';
import type { IAPI } from '../api/Api';
import { BackendParams } from '../types/Params';

export interface ISupplierService {
  getSupplier: (params: BackendParams) => Promise<Supplier>;
  getSuppliers: (params: BackendParams) => Promise<Supplier[]>;
}

export class SupplierService implements ISupplierService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getSupplier = async (params: BackendParams): Promise<Supplier> => await this.api.getSupplier(params);

  public getSuppliers = async (params: BackendParams): Promise<Supplier[]> => await this.api.getSuppliers(params);
}
