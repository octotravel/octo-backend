import {
  BackendParams,
  BaseConfig,
  BaseConnection,
  CancelBookingSchema,
  CancelOrderSchema,
  ConfirmBookingSchema,
  ConfirmOrderSchema,
  CreateBookingSchema,
  CreateOrderSchema,
  ExtendBookingSchema,
  ExtendOrderSchema,
  GetBookingSchema,
  GetMappingsSchema,
  GetOrderSchema,
  GetProductsPathParamsSchema,
  Logger,
  LookupSchema,
  OctoBackend,
  UpdateBookingSchema,
  UpdateMappingsSchema,
  UpdateOrderSchema,
} from '@octocloud/core';
import type {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
  Booking,
  Capability,
  CreateWebhookBodyParamsSchema,
  DeleteWebhookPathParamsSchema,
  GetBookingsQueryParamsSchema,
  GetProductPathParamsSchema,
  Mapping,
  Order,
  Product,
  Supplier,
  Webhook,
} from '@octocloud/types';
import qs from 'query-string';

import { inject } from '@needle-di/core';
import { BeforeRequest } from './../index';
import { APIClient } from './Client';

export interface IAPI {
  getProduct: (schema: GetProductPathParamsSchema, params: BackendParams) => Promise<Product>;
  getProducts: (schema: GetProductsPathParamsSchema, params: BackendParams) => Promise<Product[]>;
  getAvailability: (schema: AvailabilityBodySchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
  createBooking: (schema: CreateBookingSchema, params: BackendParams) => Promise<Booking>;
  updateBooking: (schema: UpdateBookingSchema, params: BackendParams) => Promise<Booking>;
  getBooking: (schema: GetBookingSchema, params: BackendParams) => Promise<Booking>;
  confirmBooking: (schema: ConfirmBookingSchema, params: BackendParams) => Promise<Booking>;
  cancelBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  deleteBooking: (schema: CancelBookingSchema, params: BackendParams) => Promise<Booking>;
  extendBooking: (schema: ExtendBookingSchema, params: BackendParams) => Promise<Booking>;
  getBookings: (schema: GetBookingsQueryParamsSchema, params: BackendParams) => Promise<Booking[]>;
  getSupplier: (params: BackendParams) => Promise<Supplier>;
  getSuppliers: (params: BackendParams) => Promise<Supplier[]>;
  createWebhook: (schema: CreateWebhookBodyParamsSchema, params: BackendParams) => Promise<Webhook>;
  deleteWebhook: (schema: DeleteWebhookPathParamsSchema, params: BackendParams) => Promise<void>;
  listWebhooks: (params: BackendParams) => Promise<Webhook[]>;
  updateMappings: (schema: UpdateMappingsSchema, params: BackendParams) => Promise<void>;
  getMappings: (schema: GetMappingsSchema, params: BackendParams) => Promise<Mapping[]>;
  createOrder: (schema: CreateOrderSchema, params: BackendParams) => Promise<Order>;
  updateOrder: (schema: UpdateOrderSchema, params: BackendParams) => Promise<Order>;
  getOrder: (schema: GetOrderSchema, params: BackendParams) => Promise<Order>;
  confirmOrder: (schema: ConfirmOrderSchema, params: BackendParams) => Promise<Order>;
  cancelOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  deleteOrder: (schema: CancelOrderSchema, params: BackendParams) => Promise<Order>;
  extendOrder: (schema: ExtendOrderSchema, params: BackendParams) => Promise<Order>;
  getGateway: (params: BackendParams) => Promise<unknown>;
  lookup: (schema: LookupSchema, params: BackendParams) => Promise<unknown>;
  getCapabilities: (params: BackendParams) => Promise<Capability[]>;
}

export class API extends APIClient implements IAPI {
  public constructor(
    beforeRequest: BeforeRequest = inject('BeforeRequest'),
    config: BaseConfig = inject('Config'),
    logger: Logger = inject('Logger'),
  ) {
    super(beforeRequest, config, logger);
  }

  public getProduct = async (schema: GetProductPathParamsSchema, params: BackendParams): Promise<Product> => {
    const url = `${params.ctx.getConnection().endpoint}/products/${schema.id}`;

    const response = await this.get(url, params);
    return await response.json();
  };

  public getProducts = async (schema: GetProductsPathParamsSchema, params: BackendParams): Promise<Product[]> => {
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

  public getAvailability = async (schema: AvailabilityBodySchema, params: BackendParams): Promise<Availability[]> => {
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
    schema: AvailabilityCalendarBodySchema,
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

  public createBooking = async (schema: CreateBookingSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings`;
    const response = await this.post(url, {
      body: schema,
      ...params,
    });
    return await response.json();
  };

  public updateBooking = async ({ uuid, ...schema }: UpdateBookingSchema, params: BackendParams): Promise<Booking> => {
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

  public getBookings = async (schema: GetBookingsQueryParamsSchema, params: BackendParams): Promise<Booking[]> => {
    let url = `${params.ctx.getConnection().endpoint}/bookings`;
    const hasParams = Object.values(schema).length > 0;
    if (hasParams) {
      url += `?${qs.stringify(schema)}`;
    }

    const response = await this.get(url, params);

    return await response.json();
  };

  public confirmBooking = async (
    { uuid, ...schema }: ConfirmBookingSchema,
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

  public extendBooking = async ({ uuid, ...schema }: ExtendBookingSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}/extend`;

    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });

    return await response.json();
  };

  public cancelBooking = async ({ uuid, ...schema }: CancelBookingSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}/cancel`;
    const body = { ...schema };

    const response = await this.post(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public deleteBooking = async ({ uuid, ...schema }: CancelBookingSchema, params: BackendParams): Promise<Booking> => {
    const url = `${params.ctx.getConnection().endpoint}/bookings/${uuid}`;
    const body = { ...schema };

    const response = await this.delete(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public createOrder = async (schema: CreateOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders`;
    const response = await this.post(url, {
      body: schema,
      ...params,
    });
    return await response.json();
  };

  public updateOrder = async ({ id, ...schema }: UpdateOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${id}`;
    const response = await this.patch(url, {
      body: { ...schema },
      ...params,
    });
    return await response.json();
  };

  public getOrder = async (schema: GetOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${schema.id}`;

    const response = await this.get(url, params);

    return await response.json();
  };

  public confirmOrder = async ({ id, ...schema }: ConfirmOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${id}/confirm`;
    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });

    return await response.json();
  };

  public extendOrder = async ({ id, ...schema }: ExtendOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${id}/extend`;

    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });

    return await response.json();
  };

  public cancelOrder = async ({ id, ...schema }: CancelOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${id}/cancel`;

    const response = await this.post(url, {
      body: { ...schema },
      ...params,
    });
    return await response.json();
  };

  public deleteOrder = async ({ id, ...schema }: CancelOrderSchema, params: BackendParams): Promise<Order> => {
    const url = `${params.ctx.getConnection().endpoint}/orders/${id}`;

    const response = await this.delete(url, {
      body: { ...schema },
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

  public createWebhook = async (schema: CreateWebhookBodyParamsSchema, params: BackendParams): Promise<Webhook> => {
    const url = `${params.ctx.getConnection().endpoint}/webhooks`;

    const body = {
      url: schema.url,
      event: schema.event,
      retry_on_error: true,
    };

    if (schema.retryOnError !== undefined) {
      body.retry_on_error = schema.retryOnError;
    }

    const response = await this.post(url, {
      body,
      ...params,
    });
    return await response.json();
  };

  public listWebhooks = async (params: BackendParams): Promise<Webhook[]> => {
    const url = `${params.ctx.getConnection().endpoint}/webhooks`;

    const response = await this.get(url, params);

    return await response.json();
  };

  public deleteWebhook = async (schema: DeleteWebhookPathParamsSchema, params: BackendParams): Promise<void> => {
    const url = `${params.ctx.getConnection().endpoint}/webhooks/${schema.id}`;

    await this.delete(url, {
      ...params,
    });
  };

  public updateMappings = async (schema: UpdateMappingsSchema, params: BackendParams): Promise<void> => {
    const url = `${params.ctx.getConnection().endpoint}/mappings`;

    const body = schema;

    await this.put(url, {
      body,
      ...params,
    });
  };

  public getMappings = async (schema: GetMappingsSchema, params: BackendParams): Promise<Mapping[]> => {
    let url = `${params.ctx.getConnection().endpoint}/mappings`;
    const hasParams = Object.values(schema).length > 0;
    if (hasParams) {
      url += `?${qs.stringify(schema)}`;
    }

    const response = await this.get(url, params);

    return await response.json();
  };

  public lookup = async (schema: LookupSchema, params: BackendParams): Promise<unknown> => {
    const url = `${params.ctx.getConnection().endpoint}/checkin/lookup`;
    const body = schema;

    const response = await this.post(url, {
      body,
      ...params,
    });
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
