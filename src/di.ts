import { Lifecycle, container } from 'tsyringe';
import { API } from './api/Api';
import { AvailabilityService } from './services/AvailabilityService';
import { BookingService } from './services/BookingService';
import { CapabilityService } from './services/CapabilityService';
import { CheckInService } from './services/CheckinService';
import { MappingService } from './services/MappingService';
import { OrderService } from './services/OrderService';
import { PaymentService } from './services/PaymentService';
import { ProductService } from './services/ProductService';
import { SupplierService } from './services/SupplierService';
import { WebhookService } from './services/WebhookService';

export const octoContainer = container.createChildContainer();

octoContainer.register(
  'IAPI',
  {
    useClass: API,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IAvailabilityService',
  {
    useClass: AvailabilityService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IBookingService',
  {
    useClass: BookingService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IMappingService',
  {
    useClass: MappingService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IProductService',
  {
    useClass: ProductService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'ISupplierService',
  {
    useClass: SupplierService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IWebhookService',
  {
    useClass: WebhookService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IOrderService',
  {
    useClass: OrderService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'IPaymentService',
  {
    useClass: PaymentService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'ICheckInService',
  {
    useClass: CheckInService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  'ICapabilityService',
  {
    useClass: CapabilityService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);
