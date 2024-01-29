import { connectionSchema, connectionPatchSchema } from './schemas/Connection';
import { inject, singleton } from 'tsyringe';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  Capability,
  GetProductPathParamsSchema,
  Mapping,
  Product,
  Supplier,
  CreateWebhookBodyParamsSchema,
  DeleteWebhookPathParamsSchema,
  Webhook,
  Order,
} from '@octocloud/types';
import {
  CancelOrderSchema,
  ConfirmOrderSchema,
  CreateOrderSchema,
  ExtendOrderSchema,
  GetBookingsSchema,
  GetOrderSchema,
  LookupSchema,
  UpdateMappingsSchema,
  UpdateOrderSchema,
  Backend,
  CancelBookingSchema,
  ConfirmBookingSchema,
  CreateBookingSchema,
  ExtendBookingSchema,
  GetBookingSchema,
  GetProductsPathParamsSchema,
  UpdateBookingSchema,
  GetMappingsSchema,
  BackendParams,
  BaseConfig,
  Logger,
} from '@octocloud/core';

import { CheckInService } from './services/CheckinService';
import { PaymentService } from './services/PaymentService';
import { OrderService } from './services/OrderService';
import { MappingService } from './services/MappingService';
import { WebhookService } from './services/WebhookService';
import { SupplierService } from './services/SupplierService';
import { BookingService } from './services/BookingService';
import { AvailabilityService } from './services/AvailabilityService';
import { ProductService } from './services/ProductService';
import { CapabilityService } from './services/CapabilityService';
import { octoContainer } from './di';
import { ConsoleLogger } from './models/ConsoleLogger';

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
  private readonly _backend: OctoBackend;

  public constructor(data: BackendContainerData) {
    const { config, logger, beforeRequest } = data;
    octoContainer.register('Config', { useValue: config });
    octoContainer.register('Logger', { useValue: logger ?? new ConsoleLogger() });
    octoContainer.register('BeforeRequest', { useValue: beforeRequest ?? noopBeforeRequest });
    this._backend = octoContainer.resolve(OctoBackend);
  }

  public get backend(): Backend {
    return this._backend;
  }
}

@singleton()
class OctoBackend implements Backend {
  public constructor(
    @inject('IProductService') private readonly productService: ProductService,
    @inject('IAvailabilityService') private readonly availabilityService: AvailabilityService,
    @inject('IBookingService') private readonly bookingService: BookingService,
    @inject('ISupplierService') private readonly supplierService: SupplierService,
    @inject('IWebhookService') private readonly webhookService: WebhookService,
    @inject('IMappingService') private readonly mappingService: MappingService,
    @inject('IOrderService') private readonly orderService: OrderService,
    @inject('IPaymentService') private readonly paymentService: PaymentService,
    @inject('ICheckInService') private readonly checkinService: CheckInService,
    @inject('ICapabilityService') private readonly capabilityService: CapabilityService,
  ) {
    this.productService = productService;
    this.availabilityService = availabilityService;
    this.bookingService = bookingService;
    this.supplierService = supplierService;
    this.webhookService = webhookService;
    this.mappingService = mappingService;
    this.orderService = orderService;
    this.paymentService = paymentService;
    this.checkinService = checkinService;
    this.capabilityService = capabilityService;
  }

  public getProduct = async (schema: GetProductPathParamsSchema, params: BackendParams): Promise<Product> =>
    await this.productService.getProduct(schema, params);

  public getProducts = async (schema: GetProductsPathParamsSchema, params: BackendParams): Promise<Product[]> =>
    await this.productService.getProducts(schema, params);

  public getAvailability = async (schema: AvailabilityBodySchema, params: BackendParams): Promise<Availability[]> =>
    await this.availabilityService.getAvailability(schema, params);

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => await this.availabilityService.getAvailabilityCalendar(schema, params);

  public createBooking = async (schema: CreateBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.createBooking(schema, params);

  public updateBooking = async (schema: UpdateBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.updateBooking(schema, params);

  public getBooking = async (schema: GetBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.getBooking(schema, params);

  public confirmBooking = async (schema: ConfirmBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.confirmBooking(schema, params);

  public cancelBooking = async (schema: CancelBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.cancelBooking(schema, params);

  public deleteBooking = async (schema: CancelBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.deleteBooking(schema, params);

  public extendBooking = async (schema: ExtendBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.extendBooking(schema, params);

  public getBookings = async (schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]> =>
    await this.bookingService.getBookings(schema, params);

  public getSupplier = async (params: BackendParams): Promise<Supplier> =>
    await this.supplierService.getSupplier(params);

  public getSuppliers = async (params: BackendParams): Promise<Supplier[]> =>
    await this.supplierService.getSuppliers(params);

  public createWebhook = async (schema: CreateWebhookBodyParamsSchema, params: BackendParams): Promise<Webhook> =>
    await this.webhookService.createWebhook(schema, params);

  public deleteWebhook = async (schema: DeleteWebhookPathParamsSchema, params: BackendParams): Promise<void> => {
    await this.webhookService.deleteWebhook(schema, params);
  };

  public listWebhooks = async (params: BackendParams): Promise<Webhook[]> =>
    await this.webhookService.listWebhooks(params);

  public updateMappings = async (schema: UpdateMappingsSchema, params: BackendParams): Promise<void> => {
    await this.mappingService.updateMappings(schema, params);
  };

  public getMappings = async (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> =>
    await this.mappingService.getMappings(schema, params);

  public createOrder = async (schema: CreateOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.createOrder(schema, params);

  public updateOrder = async (schema: UpdateOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.updateOrder(schema, params);

  public getOrder = async (schema: GetOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.getOrder(schema, params);

  public confirmOrder = async (schema: ConfirmOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.confirmOrder(schema, params);

  public cancelOrder = async (schema: CancelOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.cancelOrder(schema, params);

  public deleteOrder = async (schema: CancelOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.deleteOrder(schema, params);

  public extendOrder = async (schema: ExtendOrderSchema, params: BackendParams): Promise<Order> =>
    await this.orderService.extendOrder(schema, params);

  public getGateway = async (params: BackendParams): Promise<unknown> => await this.paymentService.getGateway(params);

  public lookup = async (schema: LookupSchema, params: BackendParams): Promise<unknown> =>
    await this.checkinService.lookup(schema, params);

  public getCapabilities = async (params: BackendParams): Promise<Capability[]> =>
    await this.capabilityService.getCapabilities(params);

  /**
   *
   * @param data
   * @throws yup.ValidationError
   * @returns OctoConnectionBackend
   */
  public validateConnectionSchema = <OctoConnectionBackend>(data: unknown): OctoConnectionBackend => {
    connectionSchema.validateSync(data);
    return connectionSchema.cast(data) as OctoConnectionBackend;
  };

  /**
   *
   * @param data
   * @throws yup.ValidationError
   * @returns OctoConnectionPatchBackend
   */
  public validateConnectionPatchSchema = <OctoConnectionPatchBackend>(data: unknown): OctoConnectionPatchBackend => {
    connectionPatchSchema.validateSync(data);
    return connectionPatchSchema.cast(data) as OctoConnectionPatchBackend;
  };
}
