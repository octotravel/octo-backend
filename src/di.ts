import { container, Lifecycle } from "tsyringe";
import { CapabilityService } from "./services/CapabilityService";
import { CheckInService } from "./services/CheckinService";
import { PaymentService } from "./services/PaymentService";
import { OrderService } from "./services/OrderService";
import { WebhookService } from "./services/WebhookService";
import { SupplierService } from "./services/SupplierService";
import { ProductService } from "./services/ProductService";
import { MappingService } from "./services/MappingService";
import { BookingService } from "./services/BookingService";
import { AvailabilityService } from "./services/AvailabilityService";
import { API } from "./api/Api";

export const octoContainer = container.createChildContainer();

octoContainer.register(
  "IAPI",
  {
    useClass: API,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IAvailabilityService",
  {
    useClass: AvailabilityService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IBookingService",
  {
    useClass: BookingService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IMappingService",
  {
    useClass: MappingService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IProductService",
  {
    useClass: ProductService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "ISupplierService",
  {
    useClass: SupplierService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IWebhookService",
  {
    useClass: WebhookService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IOrderService",
  {
    useClass: OrderService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "IPaymentService",
  {
    useClass: PaymentService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "ICheckInService",
  {
    useClass: CheckInService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);

octoContainer.register(
  "ICapabilityService",
  {
    useClass: CapabilityService,
  },
  {
    lifecycle: Lifecycle.Singleton,
  },
);