import { inject } from '@needle-di/core';
import {
  Availability,
  AvailabilityCalendar,
  AvailabilityCalendarSchema,
  AvailabilityCheckSchema,
} from '@octocloud/types';
import type { IAPI } from '../api/Api';
import { BackendParams } from '../types/Params';

export interface IAvailabilityService {
  getAvailability: (schema: AvailabilityCheckSchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarSchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
}

export class AvailabilityService implements IAvailabilityService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getAvailability = async (schema: AvailabilityCheckSchema, params: BackendParams): Promise<Availability[]> => {
    const availabilities = await this.api.getAvailability(schema, params);

    return availabilities;
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarSchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => {
    const availabilityCalendars = await this.api.getAvailabilityCalendar(schema, params);

    return availabilityCalendars;
  };
}
