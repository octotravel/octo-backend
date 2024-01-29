import { inject, singleton } from 'tsyringe';
import { GetProductPathParamsSchema, Product } from '@octocloud/types';
import { BackendParams, GetProductsPathParamsSchema } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface IProductService {
  getProduct: (schema: GetProductPathParamsSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsPathParamsSchema, params: BackendParams) => Promise<Product[]>;
}

@singleton()
export class ProductService implements IProductService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getProduct = async (schema: GetProductPathParamsSchema, params: BackendParams): Promise<Product> =>
    await this.api.getProduct(schema, params);

  public getProducts = async (schema: GetProductsPathParamsSchema, params: BackendParams): Promise<Product[]> =>
    await this.api.getProducts(schema, params);
}
