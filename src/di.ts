import { Container } from '@needle-di/core';
import { OctoBackend } from '.';
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

export const octoContainer = new Container();

octoContainer.bind(OctoBackend);

octoContainer.bind({
  provide: 'IAPI',
  useClass: API,
});

octoContainer.bind({
  provide: 'IAvailabilityService',
  useClass: AvailabilityService,
});

octoContainer.bind({
  provide: 'IBookingService',
  useClass: BookingService,
});

octoContainer.bind({
  provide: 'IMappingService',
  useClass: MappingService,
});

octoContainer.bind({
  provide: 'IProductService',
  useClass: ProductService,
});

octoContainer.bind({
  provide: 'ISupplierService',
  useClass: SupplierService,
});

octoContainer.bind({
  provide: 'IWebhookService',
  useClass: WebhookService,
});

octoContainer.bind({
  provide: 'IOrderService',
  useClass: OrderService,
});

octoContainer.bind({
  provide: 'IPaymentService',
  useClass: PaymentService,
});

octoContainer.bind({
  provide: 'ICheckInService',
  useClass: CheckInService,
});

octoContainer.bind({
  provide: 'ICapabilityService',
  useClass: CapabilityService,
});
