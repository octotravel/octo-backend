import { inject, singleton } from 'tsyringe';
import { Booking } from '@octocloud/types';
import {
  BackendParams,
  CancelBookingSchema,
  ConfirmBookingSchema,
  CreateBookingSchema,
  ExtendBookingSchema,
  GetBookingSchema,
  GetBookingsSchema,
  OctoBadRequestError,
  UpdateBookingSchema,
} from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface IBookingService {
  createBooking: (schema: CreateBookingSchema, params: BackendParams) => Promise<Booking>;
  updateBooking: (schema: UpdateBookingSchema, params: BackendParams) => Promise<Booking>;
  getBooking: (schema: GetBookingSchema, params: BackendParams) => Promise<Booking>;
  confirmBooking: (schema: ConfirmBookingSchema, params: BackendParams) => Promise<Booking>;
  cancelBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  deleteBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  extendBooking: (schema: ExtendBookingSchema, params: BackendParams) => Promise<Booking>;
  getBookings: (schema: GetBookingsSchema, params: BackendParams) => Promise<Booking[]>;
}

@singleton()
export class BookingService implements IBookingService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public createBooking = async (schema: CreateBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.createBooking(schema, params);

  public updateBooking = async (schema: UpdateBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.updateBooking(schema, params);

  public getBooking = async (schema: GetBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.getBooking(schema, params);

  public confirmBooking = async (schema: ConfirmBookingSchema, params: BackendParams): Promise<Booking> => {
    try {
      const booking = await this.api.confirmBooking(schema, params);
      return booking;
    } catch (err) {
      if (err instanceof OctoBadRequestError && err.message === 'Order already confirmed') {
        return await this.api.getBooking({ uuid: schema.uuid }, params);
      }
      throw err;
    }
  };

  public cancelBooking = async (schema: CancelBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.cancelBooking(schema, params);

  public deleteBooking = async (schema: CancelBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.deleteBooking(schema, params);

  public extendBooking = async (schema: ExtendBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.extendBooking(schema, params);

  public getBookings = async (schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]> =>
    await this.api.getBookings(schema, params);
}
