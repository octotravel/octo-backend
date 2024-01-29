import { inject, singleton } from 'tsyringe';
import { Supplier } from '@octocloud/types';
import { BackendParams } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface ISupplierService {
  getSupplier: (params: BackendParams) => Promise<Supplier>;
  getSuppliers: (params: BackendParams) => Promise<Supplier[]>;
}

@singleton()
export class SupplierService implements ISupplierService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getSupplier = async (params: BackendParams): Promise<Supplier> => await this.api.getSupplier(params);

  public getSuppliers = async (params: BackendParams): Promise<Supplier[]> => await this.api.getSuppliers(params);
}
