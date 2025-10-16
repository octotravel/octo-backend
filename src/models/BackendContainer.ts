import { Container } from '@needle-di/core';
import { Logger } from '@octocloud/core';
import { OctoBackend } from '..';
import { API } from '../api/Api';
import { AvailabilityService } from '../services/AvailabilityService';
import { BookingService } from '../services/BookingService';
import { CapabilityService } from '../services/CapabilityService';
import { ProductService } from '../services/ProductService';
import { SupplierService } from '../services/SupplierService';
import { ConsoleLogger } from './ConsoleLogger';

export type BeforeRequest = ({ request }: { request: Request }) => Promise<Request>;

interface BackendContainerData {
  logger?: Logger;
  beforeRequest?: BeforeRequest;
}

const noopBeforeRequest: BeforeRequest = async ({ request }) => {
  return await Promise.resolve(request);
};

export class BackendContainer {
  private readonly diContainer: Container = new Container();

  public constructor(data: BackendContainerData) {
    const { logger, beforeRequest } = data;

    this.diContainer.bind({ provide: 'Logger', useValue: logger ?? new ConsoleLogger() });
    this.diContainer.bind({ provide: 'BeforeRequest', useValue: beforeRequest ?? noopBeforeRequest });

    this.diContainer.bind(OctoBackend);

    this.diContainer.bind({
      provide: 'IAPI',
      useClass: API,
    });

    this.diContainer.bind({
      provide: 'IAvailabilityService',
      useClass: AvailabilityService,
    });

    this.diContainer.bind({
      provide: 'IBookingService',
      useClass: BookingService,
    });

    this.diContainer.bind({
      provide: 'IProductService',
      useClass: ProductService,
    });

    this.diContainer.bind({
      provide: 'ISupplierService',
      useClass: SupplierService,
    });


    this.diContainer.bind({
      provide: 'ICapabilityService',
      useClass: CapabilityService,
    });
  }

  public get backend(): OctoBackend {
    return this.diContainer.get(OctoBackend);
  }
}
