import { inject, singleton } from 'tsyringe';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
} from '@octocloud/types';

import { BackendParams, AvailabilityHelper } from '@octocloud/core';
import type { IAPI } from '../api/Api';

export interface IAvailabilityService {
  getAvailability: (schema: AvailabilityBodySchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
}

@singleton()
export class AvailabilityService implements IAvailabilityService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getAvailability = async (schema: AvailabilityBodySchema, params: BackendParams): Promise<Availability[]> => {
    const availabilities = await this.api.getAvailability(schema, params);
    return AvailabilityHelper.updateWithFiltereredFirstUnitPricing(availabilities);
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => await this.api.getAvailabilityCalendar(schema, params);
}
