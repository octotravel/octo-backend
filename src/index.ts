import { connectionSchema, connectionPatchSchema } from './schemas/Connection';
import { inject, singleton } from "tsyringe";
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
} from "@octocloud/types";
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
} from "@octocloud/core";

import { CheckInService } from "./services/CheckinService";
import { PaymentService } from "./services/PaymentService";
import { OrderService } from "./services/OrderService";
import { MappingService } from "./services/MappingService";
import { WebhookService } from "./services/WebhookService";
import { SupplierService } from "./services/SupplierService";
import { BookingService } from "./services/BookingService";
import { AvailabilityService } from "./services/AvailabilityService";
import { ProductService } from "./services/ProductService";
import { CapabilityService } from "./services/CapabilityService";
import { octoContainer } from "./di";


export type BeforeRequest = ({request}: {request: Request}) => Promise<Request>

interface BackendContainerData {
  beforeRequest?: BeforeRequest
  config: BaseConfig
}

const noopBeforeRequest: BeforeRequest = ({request}) => {
  return Promise.resolve(request)
}

export class BackendContainer {
  private _backend: OctoBackend;

  constructor(data: BackendContainerData) {
    const { beforeRequest, config } = data
    octoContainer.register('BeforeRequest', { useValue: beforeRequest ?? noopBeforeRequest });
    octoContainer.register('Config', { useValue: config });
    this._backend = octoContainer.resolve(OctoBackend);
  }

  public get backend () {
    return this._backend;
  }
}

@singleton()
class OctoBackend implements Backend {
  constructor(
    @inject("IProductService") private productService: ProductService,
    @inject("IAvailabilityService") private availabilityService:
      AvailabilityService,
    @inject("IBookingService") private bookingService: BookingService,
    @inject("ISupplierService") private supplierService: SupplierService,
    @inject("IWebhookService") private webhookService: WebhookService,
    @inject("IMappingService") private mappingService: MappingService,
    @inject("IOrderService") private orderService: OrderService,
    @inject("IPaymentService") private paymentService: PaymentService,
    @inject("ICheckInService") private checkinService: CheckInService,
    @inject("ICapabilityService") private capabilityService: CapabilityService,
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

  public getProduct = (
    schema: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product> => this.productService.getProduct(schema, params);

  public getProducts = (
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Product[]> => this.productService.getProducts(schema, params);

  public getAvailability = (
    schema: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Availability[]> =>
    this.availabilityService.getAvailability(schema, params);

  public getAvailabilityCalendar = (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> =>
    this.availabilityService.getAvailabilityCalendar(schema, params);

  public createBooking = (
    schema: CreateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.createBooking(schema, params);

  public updateBooking = (
    schema: UpdateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.updateBooking(schema, params);

  public getBooking = (
    schema: GetBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.getBooking(schema, params);

  public confirmBooking = (
    schema: ConfirmBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.confirmBooking(schema, params);

  public cancelBooking = (
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.cancelBooking(schema, params);

  public deleteBooking = (
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.deleteBooking(schema, params);

  public extendBooking = (
    schema: ExtendBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.bookingService.extendBooking(schema, params);

  public getBookings = (
    schema: GetBookingsSchema,
    params: BackendParams,
  ): Promise<Booking[]> => this.bookingService.getBookings(schema, params);

  public getSupplier = (params: BackendParams): Promise<Supplier> =>
    this.supplierService.getSupplier(params);

  public createWebhook = (
    schema: CreateWebhookBodyParamsSchema,
    params: BackendParams,
  ): Promise<Webhook> => this.webhookService.createWebhook(schema, params);

  public deleteWebhook = (
    schema: DeleteWebhookPathParamsSchema,
    params: BackendParams,
  ): Promise<void> => this.webhookService.deleteWebhook(schema, params);

  public listWebhooks = (params: BackendParams): Promise<Webhook[]> =>
    this.webhookService.listWebhooks(params);

  public updateMappings = (
    schema: UpdateMappingsSchema,
    params: BackendParams,
  ): Promise<void> => this.mappingService.updateMappings(schema, params);

  public getMappings = (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> =>
    this.mappingService.getMappings(schema, params);

  public createOrder = (
    schema: CreateOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.createOrder(schema, params);

  public updateOrder = (
    schema: UpdateOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.updateOrder(schema, params);

  public getOrder = (
    schema: GetOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.getOrder(schema, params);

  public confirmOrder = (
    schema: ConfirmOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.confirmOrder(schema, params);

  public cancelOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.cancelOrder(schema, params);

  public deleteOrder = (
    schema: CancelOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.deleteOrder(schema, params);

  public extendOrder = (
    schema: ExtendOrderSchema,
    params: BackendParams,
  ): Promise<Order> => this.orderService.extendOrder(schema, params);

  public getGateway = (params: BackendParams): Promise<unknown> =>
    this.paymentService.getGateway(params);

  public lookup = (
    schema: LookupSchema,
    params: BackendParams,
  ): Promise<unknown> => this.checkinService.lookup(schema, params);

  public getCapabilities = (params: BackendParams): Promise<Capability[]> =>
    this.capabilityService.getCapabilities(params);

  /**
   *
   * @param data
   * @throws yup.ValidationError
   * @returns OctoConnectionBackend
   */
  public validateConnectionSchema = <OctoConnectionBackend>(data: unknown): OctoConnectionBackend => {
    connectionSchema.validateSync(data);
    return connectionSchema.cast(data) as OctoConnectionBackend;
  }

  /**
   *
   * @param data
   * @throws yup.ValidationError
   * @returns OctoConnectionPatchBackend
   */
  public validateConnectionPatchSchema = <OctoConnectionPatchBackend>(data: unknown): OctoConnectionPatchBackend => {
    connectionPatchSchema.validateSync(data);
    return connectionPatchSchema.cast(data) as OctoConnectionPatchBackend;
  }
}