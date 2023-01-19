import { inject, singleton } from "tsyringe"
import {
  GetProductPathParamsSchema,
  Product,
} from "@octocloud/types";
import { BackendParams, GetProductsPathParamsSchema } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IProductService {
  getProduct(
    schema: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product>;
  getProducts(
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Product[]>;
}

@singleton()
export class ProductService implements IProductService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public getProduct = (
    schema: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product> => this.api.getProduct(schema, params);

  public getProducts = (
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Product[]> => this.api.getProducts(schema, params);
}
