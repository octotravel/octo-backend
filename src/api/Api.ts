import { inject } from '@needle-di/core';
import { Logger } from '@octocloud/core';
import type {
  Availability,
  AvailabilityCalendar,
  AvailabilityCalendarSchema,
  AvailabilityCheckSchema,
  Booking,
  BookingCancellationSchema,
  BookingConfirmationSchema,
  BookingReservationSchema,
  BookingUpdateSchema,
  Capability,
  ExtendReservationSchema,
  GetBookingSchema,
  GetBookingsSchema,
  GetProductSchema,
  GetProductsSchema,
  Product,
  Supplier,
} from '@octocloud/types';
import qs from 'query-string';
import { BeforeRequest } from './../index';
import { BackendParams } from '../types/Params';
import { APIClient } from './Client';

export interface IAPI {
  getProduct: (schema: GetProductSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsSchema, params: BackendParams) => Promise<Product[]>;
  getAvailability: (schema: AvailabilityCheckSchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarSchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
  createBooking: (schema: BookingReservationSchema, params: BackendParams) => Promise<Booking>;
  updateBooking: (schema: BookingUpdateSchema, params: BackendParams) => Promise<Booking>;
  getBooking: (schema: GetBookingSchema, params: BackendParams) => Promise<Booking>;
  confirmBooking: (schema: BookingConfirmationSchema, params: BackendParams) => Promise<Booking>;
  cancelBooking: (schema: BookingCancellationSchema, params: BackendParams) => Promise<Booking>;
  deleteBooking: (schema: BookingCancellationSchema, params: BackendParams) => Promise<Booking>;
  extendBooking: (schema: ExtendReservationSchema, params: BackendParams) => Promise<Booking>;
  getBookings: (schema: GetBookingsSchema, params: BackendParams) => Promise<Booking[]>;
  getSupplier: (params: BackendParams) => Promise<Supplier>;
  getSuppliers: (params: BackendParams) => Promise<Supplier[]>;
  getCapabilities: (params: BackendParams) => Promise<Capability[]>;
}

export class API extends APIClient implements IAPI {
  public constructor(beforeRequest: BeforeRequest = inject('BeforeRequest'), logger: Logger = inject('Logger')) {
    super(beforeRequest, logger);
  }

  public getProduct = async (schema: GetProductSchema, params: BackendParams): Promise<Product> => {
    const url = `${params.ctx.getConnection().endpoint}/products/${schema.id}`;

    const response = await this.get(url, params);
    return await response.json();
  };

  public getProducts = async (schema: GetProductsSchema, params: BackendParams): Promise<Product[]> => {
    let url = `${params.ctx.getConnection().endpoint}/products`;
    if (schema.currency) {
      url += `?currency=${schema.currency}`;
    }

    const headers = {
      'Accept-Language': params.locale ?? '',
    };

    const response = await this.get(url, {
      headers,
      ...params,
    });
    return await response.json();
  };

  public getAvailability = async (schema: AvailabilityCheckSchema, params: BackendParams): Promise<Availability[]> => {
    const url = `${params.ctx.getConnection().endpoint}/availability`;
    const headers = { 'Accept-Language': params.locale ?? '' };

    const response = await this.post(url, {
      body: schema,
      headers,
      ...params,
    });

    return await response.json();
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarSchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => {
    const url = `${params.ctx.getConnection().endpoint}/availability/calendar`;
    const headers = {
      'Accept-Language': params.locale ?? '',
    };

    const response = await this.post(url, {
      body: schema,
      headers,
      ...params,
    });
    return await response.json();
  };

  public createBooking = async (schema: BookingReservationSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings`;
    const response = await this.post(url, {
      body: schema,
      ...params,
    });
    return await response.json();
  };

  public updateBooking = async ({ uuid, ...schema }: BookingUpdateSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}`;
    const body = { ...schema };
    const response = await this.patch(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public getBooking = async (schema: GetBookingSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${schema.uuid}`;

    const response = await this.get(url, params);

    return await response.json();
  };

  public getBookings = async (schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]> => {
    let url = `${params.ctx.getConnection().endpoint}/bookings`;
    const hasParams = Object.values(schema).length > 0;
    if (hasParams) {
      url += `?${qs.stringify(schema)}`;
    }

    const response = await this.get(url, params);

    return await response.json();
  };

  public confirmBooking = async (
    { uuid, ...schema }: BookingConfirmationSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}/confirm`;

    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });

    return await response.json();
  };

  public extendBooking = async (
    { uuid, ...schema }: ExtendReservationSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}/extend`;

    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });

    return await response.json();
  };

  public cancelBooking = async (
    { uuid, ...schema }: BookingCancellationSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}/cancel`;
    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public deleteBooking = async (
    { uuid, ...schema }: BookingCancellationSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}`;
    const body = { ...schema };

    const response = await this.delete(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public getSupplier = async (params: BackendParams): Promise<Supplier> => {
    const connection = params.ctx.getConnection();
    const url = `${connection.endpoint}/suppliers/${connection.supplierId}`;

    const response = await this.get(url, params);
    return await response.json();
  };

  public getSuppliers = async (params: BackendParams): Promise<Supplier[]> => {
    const connection = params.ctx.getConnection();
    const url = `${connection.endpoint}/suppliers`;

    const response = await this.get(url, params);
    return await response.json();
  };

  public getGateway = async (params: BackendParams): Promise<unknown> => {
    const url = `${params.ctx.getConnection().endpoint}/gateway`;

    const response = await this.get(url, params);
    return await response.json();
  };

  public getCapabilities = async (params: BackendParams): Promise<Capability[]> => {
    const url = `${params.ctx.getConnection().endpoint}/capabilities`;

    const response = await this.get(url, params);
    try {
      return await response.json();
    } catch (err) {
      return [];
    }
  };
}
