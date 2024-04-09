import { UnitHelper } from '@octocloud/core';
import { Product } from '@octocloud/types';

export class ProductHelper {
  public static updateWithFilteredUnitPricing(product: Product): Product {
    for (const productOption of product.options) {
      if (!productOption.units || productOption.units.length === 0) {
        continue;
      }

      productOption.units = UnitHelper.getUniqueUnitsByType(productOption.units);
    }

    return product;
  }
}
