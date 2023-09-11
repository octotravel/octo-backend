import { inject, singleton } from "tsyringe"
import {
  Booking
} from "@octocloud/types";
import { BackendParams, CancelBookingSchema,
  ConfirmBookingSchema,
  CreateBookingSchema,
  ExtendBookingSchema,
  GetBookingSchema,
  GetBookingsSchema,
  OctoBadRequestError,
  UpdateBookingSchema, } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IBookingService {
  createBooking(
    schema: CreateBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  updateBooking(
    schema: UpdateBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  getBooking(schema: GetBookingSchema, params: BackendParams): Promise<Booking>;
  confirmBooking(
    schema: ConfirmBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  cancelBooking(
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  deleteBooking(
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  extendBooking(
    schema: ExtendBookingSchema,
    params: BackendParams,
  ): Promise<Booking>;
  getBookings(schema: GetBookingsSchema, params: BackendParams): Promise<Booking[]>;
}

@singleton()
export class BookingService implements IBookingService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }

  public createBooking = (
    schema: CreateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.createBooking(schema, params);

  public updateBooking = (
    schema: UpdateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.updateBooking(schema, params);

  public getBooking = (
    schema: GetBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.getBooking(schema, params);

  public confirmBooking = async (
    schema: ConfirmBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    try {
      const booking = await this.api.confirmBooking(schema, params)
      return booking;
    } catch (err) {
      if (err instanceof OctoBadRequestError && err.message === 'Order already confirmed') {
        return await this.api.getBooking({ uuid: schema.uuid }, params)
      }
      throw err;
    }
  }

  public cancelBooking = (
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.cancelBooking(schema, params);

  public deleteBooking = (
    schema: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.deleteBooking(schema, params);

  public extendBooking = (
    schema: ExtendBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => this.api.extendBooking(schema, params);

  public getBookings = (
    schema: GetBookingsSchema,
    params: BackendParams,
  ): Promise<Booking[]> => this.api.getBookings(schema, params);
}
