import {
  Backend,
  BackendParams,
  CancelBookingSchema,
  CancelOrderSchema,
  ConfirmBookingSchema,
  ConfirmOrderSchema,
  CreateBookingSchema,
  CreateOrderSchema,
  ExtendBookingSchema,
  ExtendOrderSchema,
  GetBookingSchema,
  GetBookingsSchema,
  GetMappingsSchema,
  GetOrderSchema,
  GetProductsPathParamsSchema,
  Logger,
  LookupSchema,
  UpdateBookingSchema,
  UpdateMappingsSchema,
  UpdateOrderSchema,
} from '@octocloud/core';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  Capability,
  CreateWebhookBodyParamsSchema,
  DeleteWebhookPathParamsSchema,
  GetProductPathParamsSchema,
  Mapping,
  Order,
  Product,
  Supplier,
  Webhook,
} from '@octocloud/types';

import { connectionPatchSchema, connectionSchema } from '../schemas/Connection';

import { inject } from '@needle-di/core';
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

export class OctoBackend implements Backend {
  public constructor(
    private readonly productService: ProductService = inject('IProductService'),
    private readonly availabilityService: AvailabilityService = inject('IAvailabilityService'),
    private readonly bookingService: BookingService = inject('IBookingService'),
    private readonly supplierService: SupplierService = inject('ISupplierService'),
    private readonly webhookService: WebhookService = inject('IWebhookService'),
    private readonly mappingService: MappingService = inject('IMappingService'),
    private readonly orderService: OrderService = inject('IOrderService'),
    private readonly paymentService: PaymentService = inject('IPaymentService'),
    private readonly checkinService: CheckInService = inject('ICheckInService'),
    private readonly capabilityService: CapabilityService = inject('ICapabilityService'),
  ) {}

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
