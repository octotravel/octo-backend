import { BackendParams, GetProductsPathParamsSchema } from '@octocloud/core';
import { GetProductPathParamsSchema, Product } from '@octocloud/types';

import { inject } from '@needle-di/core';
import type { IAPI } from '../api/Api';
import { ProductHelper } from '../util/ProductHelper';

export interface IProductService {
  getProduct: (schema: GetProductPathParamsSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsPathParamsSchema, params: BackendParams) => Promise<Product[]>;
}

export class ProductService implements IProductService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getProduct = async (schema: GetProductPathParamsSchema, params: BackendParams): Promise<Product> => {
    const product = await this.api.getProduct(schema, params);

    return ProductHelper.updateWithFilteredUnitPricing(product);
  };

  public getProducts = async (schema: GetProductsPathParamsSchema, params: BackendParams): Promise<Product[]> => {
    const products = await this.api.getProducts(schema, params);

    return products.map((product) => ProductHelper.updateWithFilteredUnitPricing(product));
  };
}
