import { inject, singleton } from "tsyringe"
import {
  Supplier
} from "@octocloud/types";
import { BackendParams } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface ISupplierService {
  getSupplier(params: BackendParams): Promise<Supplier>;
}

@singleton()
export class SupplierService implements ISupplierService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public getSupplier = (params: BackendParams): Promise<Supplier> =>
    this.api.getSupplier(params);
}
