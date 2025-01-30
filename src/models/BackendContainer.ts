import { Container } from '@needle-di/core';
import { Backend, BaseConfig, Logger } from '@octocloud/core';
import { OctoBackend } from '..';
import { API } from '../api/Api';
import { AvailabilityService } from '../services/AvailabilityService';
import { BookingService } from '../services/BookingService';
import { CapabilityService } from '../services/CapabilityService';
import { CheckInService } from '../services/CheckinService';
import { MappingService } from '../services/MappingService';
import { OrderService } from '../services/OrderService';
import { PaymentService } from '../services/PaymentService';
import { ProductService } from '../services/ProductService';
import { SupplierService } from '../services/SupplierService';
import { WebhookService } from '../services/WebhookService';
import { ConsoleLogger } from './ConsoleLogger';

export type BeforeRequest = ({ request }: { request: Request }) => Promise<Request>;

interface BackendContainerData {
  config: BaseConfig;
  logger?: Logger;
  beforeRequest?: BeforeRequest;
}

const noopBeforeRequest: BeforeRequest = async ({ request }) => {
  return await Promise.resolve(request);
};

export class BackendContainer {
  private readonly diContainer: Container = new Container();

  public constructor(data: BackendContainerData) {
    const { config, logger, beforeRequest } = data;

    this.diContainer.bind({ provide: 'Config', useValue: config });
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
      provide: 'IMappingService',
      useClass: MappingService,
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
      provide: 'IWebhookService',
      useClass: WebhookService,
    });

    this.diContainer.bind({
      provide: 'IOrderService',
      useClass: OrderService,
    });

    this.diContainer.bind({
      provide: 'IPaymentService',
      useClass: PaymentService,
    });

    this.diContainer.bind({
      provide: 'ICheckInService',
      useClass: CheckInService,
    });

    this.diContainer.bind({
      provide: 'ICapabilityService',
      useClass: CapabilityService,
    });
  }

  public get backend(): Backend {
    return this.diContainer.get(OctoBackend);
  }
}
