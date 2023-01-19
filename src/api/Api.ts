import qs from 'query-string';
import { BeforeRequest } from './../index';
import { inject, singleton } from "tsyringe";
import type {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  Capability,
  GetBookingsQueryParamsSchema,
  GetProductPathParamsSchema,
  Mapping,
  Product,
  Supplier,
} from "@octocloud/types";
import {
  BaseConnection,
  OctoBackend,
  BackendParams,
  GetProductsPathParamsSchema,
  CreateBookingSchema,
  UpdateBookingSchema,
  GetBookingSchema,
  ConfirmBookingSchema,
  CancelBookingSchema,
  ExtendBookingSchema,
  CreateWebhookSchema,
  Webhook,
  DeleteWebhookSchema,
  UpdateMappingsSchema,
  CreateOrderSchema,
  UpdateOrderSchema,
  GetOrderSchema,
  ConfirmOrderSchema,
  CancelOrderSchema,
  ExtendOrderSchema,
  LookupSchema,
  GetMappingsSchema,
} from "@octocloud/core";
import { APIClient } from "./Client";

export interface IAPI {
  getProduct(
    schema: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product>;
  getProducts(
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Product[]>;
  getAvailability(
    schema: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Availability[]>;
  getAvailabilityCalendar(
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]>;
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
  getBookings(
    schema: GetBookingsQueryParamsSchema,
    params: BackendParams,
  ): Promise<Booking[]>;
  getSupplier(params: BackendParams): Promise<Supplier>;
  createWebhook(
    schema: CreateWebhookSchema,
    params: BackendParams,
  ): Promise<Webhook>;
  deleteWebhook(schema: DeleteWebhookSchema, params: BackendParams): Promise<void>;
  listWebhooks(params: BackendParams): Promise<Array<Webhook>>;
  updateMappings(
    schema: UpdateMappingsSchema,
    params: BackendParams,
  ): Promise<void>;
  getMappings(schema: GetMappingsSchema, params: BackendParams): Promise<Array<Mapping>>;
  createOrder(schema: CreateOrderSchema, params: BackendParams): Promise<unknown>;
  updateOrder(schema: UpdateOrderSchema, params: BackendParams): Promise<unknown>;
  getOrder(schema: GetOrderSchema, params: BackendParams): Promise<unknown>;
  confirmOrder(schema: ConfirmOrderSchema, params: BackendParams): Promise<unknown>;
  cancelOrder(schema: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  deleteOrder(schema: CancelOrderSchema, params: BackendParams): Promise<unknown>;
  extendOrder(schema: ExtendOrderSchema, params: BackendParams): Promise<unknown>;
  getGateway(params: BackendParams): Promise<unknown>;
  lookup(schema: LookupSchema, params: BackendParams): Promise<unknown>;
  getCapabilities(params: BackendParams): Promise<Capability[]>;
}

@singleton()
export class API extends APIClient implements IAPI {
  private baseEndpoint = (connection: BaseConnection) => {
    const backend = connection.backend as OctoBackend;
    return backend.endpoint;
  };

  constructor(@inject("BeforeRequest") beforeRequest: BeforeRequest) {
    super(beforeRequest)
  }

  public getProduct = async (
    schema: GetProductPathParamsSchema,
    params: BackendParams,
  ): Promise<Product> => {
    const url = `${
      this.baseEndpoint(params.rdm.getConnection())
    }/products/${schema.id}`;

    const response = await this.get(url, params);
    return response.json();
  };

  public getProducts = async (
    schema: GetProductsPathParamsSchema,
    params: BackendParams,
  ): Promise<Array<Product>> => {
    let url = `${this.baseEndpoint(params.rdm.getConnection())}/products`;
    if (schema.currency) {
      url += `?currency=${schema.currency}`;
    }

    const headers = {
      "Accept-Language": params.locale ?? "",
    };

    const response = await this.get(url, {
      headers,
      ...params,
    });
    return response.json();
  };

  public getAvailability = async (
    schema: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Array<Availability>> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/availability`;
    const headers = { "Accept-Language": params.locale ?? "" };

    const response = await this.post(url, {
      body: schema,
      headers,
      ...params,
    });

    return response.json();
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<Array<AvailabilityCalendar>> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/availability/calendar`;
    const headers = {
      "Accept-Language": params.locale ?? "",
    };

    const response = await this.post(url, {
      body: schema,
      headers,
      ...params,
    });
    return response.json();
  };

  public createBooking = async (
    schema: CreateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/bookings`;
    const response = await this.post(url, {
      body: schema,
      ...params,
    });
    return response.json();
  };

  public updateBooking = async (
    { uuid, ...schema }: UpdateBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/bookings/${uuid}`;
    const body = { ...schema };
    const response = await this.patch(url, {
      body,
      ...params,
    });
    return response.json();
  };

  public getBooking = async (
    schema: GetBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(params.rdm.getConnection())
    }/bookings/${schema.uuid}`;

    const response = await this.get(url, params);

    return response.json();
  };

  public getBookings = async (
    schema: GetBookingsQueryParamsSchema,
    params: BackendParams,
  ): Promise<Array<Booking>> => {
    let url = `${this.baseEndpoint(params.rdm.getConnection())}/bookings`;
    const hasParams = Object.values(schema).length > 0;
    if (hasParams) {
      url += `?${qs.stringify(schema)}`;
    }

    const response = await this.get(url, params);

    return response.json();
  };

  public confirmBooking = async (
    { uuid, ...schema }: ConfirmBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/bookings/${uuid}/confirm`;

    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });

    return response.json();
  };

  public extendBooking = async (
    { uuid, ...schema }: ExtendBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/bookings/${uuid}/extend`;

    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });

    return response.json();
  };

  public cancelBooking = async (
    { uuid, ...schema }: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/bookings/${uuid}/cancel`;
    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });
    return response.json();
  };

  public deleteBooking = async (
    { uuid, ...schema }: CancelBookingSchema,
    params: BackendParams,
  ): Promise<Booking> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/bookings/${uuid}`;
    const body = { ...schema };

    const response = await this.delete(url, {
      body,
      ...params,
    });
    return response.json();
  };

  public createOrder = async (
    schema: CreateOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/orders`;
    const response = await this.post(url, {
      body: schema,
      ...params,
    });
    return response.json();
  };

  public updateOrder = async (
    { id, ...schema }: UpdateOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/orders/${id}`;
    const response = await this.patch(url, {
      body: { ...schema },
      ...params,
    });
    return response.json();
  };

  public getOrder = async (
    schema: GetOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${
      this.baseEndpoint(params.rdm.getConnection())
    }/orders/${schema.id}`;

    const response = await this.get(url, params);

    return response.json();
  };

  public confirmOrder = async (
    { id, ...schema }: ConfirmOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/orders/${id}/confirm`;
    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });

    return response.json();
  };

  public extendOrder = async (
    { id, ...schema }: ExtendOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/orders/${id}/extend`;

    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });

    return response.json();
  };

  public cancelOrder = async (
    { id, ...schema }: CancelOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/orders/${id}/cancel`;

    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });
    return response.json();
  };

  public deleteOrder = async (
    { id, ...schema }: CancelOrderSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/orders/${id}`;

    const response = await this.delete(url, {
      body: { ...schema },
      ...params,
    });
    return response.json();
  };

  public getSupplier = async (params: BackendParams): Promise<Supplier> => {
    const backend = params.rdm.getConnection().backend as OctoBackend;
    const url = `${
      this.baseEndpoint(params.rdm.getConnection())
    }/suppliers/${backend.supplierId}`;

    const response = await this.get(url, params);
    return response.json();
  };

  public getGateway = async (params: BackendParams): Promise<unknown> => {
    const backend = params.rdm.getConnection().backend as OctoBackend;
    const url = `${backend.endpoint}/gateway`;

    const response = await this.get(url, params);
    return response.json();
  };

  public createWebhook = async (
    schema: CreateWebhookSchema,
    params: BackendParams,
  ): Promise<Webhook> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/webhooks`;

    const body = {
      url: schema.url,
      event: schema.event,
      retry_on_error: true,
    };

    if (schema.retry_on_error !== undefined) {
      body.retry_on_error = schema.retry_on_error;
    }

    const response = await this.post(url, {
      body,
      ...params,
    });
    return response.json();
  };

  public listWebhooks = async (params: BackendParams): Promise<Array<Webhook>> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/webhooks`;

    const response = await this.get(url, params);

    return response.json();
  };

  public deleteWebhook = async (
    schema: DeleteWebhookSchema,
    params: BackendParams,
  ): Promise<void> => {
    const url = `${
      this.baseEndpoint(params.rdm.getConnection())
    }/webhooks/${schema.id}`;

    await this.delete(url, {
      ...params,
    });
  };

  public updateMappings = async (
    schema: UpdateMappingsSchema,
    params: BackendParams,
  ): Promise<void> => {
    const url = `${this.baseEndpoint(params.rdm.getConnection())}/mappings`;

    const body = schema;

    await this.put(url, {
      body,
      ...params,
    });
  };

  public getMappings = async (schema: GetMappingsSchema, params: BackendParams): Promise<Array<Mapping>> => {
    let url = `${this.baseEndpoint(params.rdm.getConnection())}/mappings`;
    const hasParams = Object.values(schema).length > 0;
    if (hasParams) {
      url += `?${qs.stringify(schema)}`;
    }

    const response = await this.get(url, params);

    return response.json();
  };

  public lookup = async (
    schema: LookupSchema,
    params: BackendParams,
  ): Promise<unknown> => {
    const url = `${
      this.baseEndpoint(
        params.rdm.getConnection(),
      )
    }/checkin/lookup`;
    const body = schema;

    const response = await this.post(url, {
      body,
      ...params,
    });
    return response.json();
  };

  public getCapabilities = async (
    params: BackendParams,
  ): Promise<Array<Capability>> => {
    const backend = params.rdm.getConnection().backend as OctoBackend;
    const url = `${backend.endpoint}/capabilities`;

    const response = await this.get(url, params);
    try {
      return response.json();
    } catch (err) {
      return [];
    }
  };
}
