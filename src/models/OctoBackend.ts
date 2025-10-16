import {
  Availability,
  AvailabilityCalendar,
  Booking,
  Capability,
  Supplier,
  Product,
  GetProductSchema,
  GetProductsSchema,
  AvailabilityCheckSchema,
  AvailabilityCalendarSchema,
  GetBookingSchema,
  BookingConfirmationSchema,
  BookingReservationSchema,
  BookingUpdateSchema,
  BookingCancellationSchema,
  ExtendReservationSchema,
  GetBookingsSchema,
} from '@octocloud/types';


import { inject } from '@needle-di/core';
import { AvailabilityService } from '../services/AvailabilityService';
import { BookingService } from '../services/BookingService';
import { CapabilityService } from '../services/CapabilityService';
import { ProductService } from '../services/ProductService';
import { SupplierService } from '../services/SupplierService';
import { BackendParams } from '../types/Params';


export class OctoBackend {
  public constructor(
    private readonly productService: ProductService = inject('IProductService'),
    private readonly availabilityService: AvailabilityService = inject('IAvailabilityService'),
    private readonly bookingService: BookingService = inject('IBookingService'),
    private readonly supplierService: SupplierService = inject('ISupplierService'),
    private readonly capabilityService: CapabilityService = inject('ICapabilityService'),
  ) {}

  public getProduct = async (schema: GetProductSchema, params: BackendParams): Promise<Product> =>
    await this.productService.getProduct(schema, params);

  public getProducts = async (schema: GetProductsSchema, params: BackendParams): Promise<Product[]> =>
    await this.productService.getProducts(schema, params);

  public getAvailability = async (schema: AvailabilityCheckSchema, params: BackendParams): Promise<Availability[]> =>
    await this.availabilityService.getAvailability(schema, params);

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarSchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => await this.availabilityService.getAvailabilityCalendar(schema, params);

  public createBooking = async (schema: BookingReservationSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.createBooking(schema, params);

  public updateBooking = async (schema: BookingUpdateSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.updateBooking(schema, params);

  public getBooking = async (schema: GetBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.getBooking(schema, params);

  public confirmBooking = async (schema: BookingConfirmationSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.confirmBooking(schema, params);

  public cancelBooking = async (schema: BookingCancellationSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.cancelBooking(schema, params);

  public deleteBooking = async (schema: BookingCancellationSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.deleteBooking(schema, params);

  public extendBooking = async (schema: ExtendReservationSchema, params: BackendParams): Promise<Booking> =>
    await this.bookingService.extendBooking(schema, params);

  public getBookings = async (schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]> =>
    await this.bookingService.getBookings(schema, params);

  public getSupplier = async (params: BackendParams): Promise<Supplier> =>
    await this.supplierService.getSupplier(params);

  public getSuppliers = async (params: BackendParams): Promise<Supplier[]> =>
    await this.supplierService.getSuppliers(params);

  public getCapabilities = async (params: BackendParams): Promise<Capability[]> =>
    await this.capabilityService.getCapabilities(params);
}
