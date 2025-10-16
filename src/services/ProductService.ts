import { inject } from '@needle-di/core';
import { GetProductSchema, GetProductsSchema, Product } from '@octocloud/types';
import type { IAPI } from '../api/Api';
import { BackendParams } from '../types/Params';

export interface IProductService {
  getProduct: (schema: GetProductSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsSchema, params: BackendParams) => Promise<Product[]>;
}

export class ProductService implements IProductService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getProduct = async (schema: GetProductSchema, params: BackendParams): Promise<Product> => {
    const product = await this.api.getProduct(schema, params);
    return product;
  };

  public getProducts = async (schema: GetProductsSchema, params: BackendParams): Promise<Product[]> => {
    const products = await this.api.getProducts(schema, params);
    return products;
  };
}
