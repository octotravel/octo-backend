import { inject } from '@needle-di/core';
import { OctoBadRequestError } from '@octocloud/core';
import {
  Booking,
  BookingCancellationSchema,
  BookingConfirmationSchema,
  BookingReservationSchema,
  BookingUpdateSchema,
  ExtendReservationSchema,
  GetBookingSchema,
  GetBookingsSchema,
} from '@octocloud/types';
import type { IAPI } from '../api/Api';
import { BackendParams } from '../types/Params';

export interface IBookingService {
  createBooking: (schema: BookingReservationSchema, params: BackendParams) => Promise<Booking>;
  updateBooking: (schema: BookingUpdateSchema, params: BackendParams) => Promise<Booking>;
  getBooking: (schema: GetBookingSchema, params: BackendParams) => Promise<Booking>;
  confirmBooking: (schema: BookingConfirmationSchema, params: BackendParams) => Promise<Booking>;
  cancelBooking: (schema: BookingCancellationSchema, params: BackendParams) => Promise<Booking>;
  deleteBooking: (schema: BookingCancellationSchema, params: BackendParams) => Promise<Booking>;
  extendBooking: (schema: ExtendReservationSchema, params: BackendParams) => Promise<Booking>;
  getBookings: (schema: GetBookingsSchema, params: BackendParams) => Promise<Booking[]>;
}

export class BookingService implements IBookingService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public createBooking = async (schema: BookingReservationSchema, params: BackendParams): Promise<Booking> =>
    await this.api.createBooking(schema, params);

  public updateBooking = async (schema: BookingUpdateSchema, params: BackendParams): Promise<Booking> =>
    await this.api.updateBooking(schema, params);

  public getBooking = async (schema: GetBookingSchema, params: BackendParams): Promise<Booking> =>
    await this.api.getBooking(schema, params);

  public confirmBooking = async (schema: BookingConfirmationSchema, params: BackendParams): Promise<Booking> => {
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

  public cancelBooking = async (schema: BookingCancellationSchema, params: BackendParams): Promise<Booking> =>
    await this.api.cancelBooking(schema, params);

  public deleteBooking = async (schema: BookingCancellationSchema, params: BackendParams): Promise<Booking> =>
    await this.api.deleteBooking(schema, params);

  public extendBooking = async (schema: ExtendReservationSchema, params: BackendParams): Promise<Booking> =>
    await this.api.extendBooking(schema, params);

  public getBookings = async (schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]> =>
    await this.api.getBookings(schema, params);
}
