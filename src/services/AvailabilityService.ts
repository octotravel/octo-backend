import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
} from '@octocloud/types';

import { inject } from '@needle-di/core';
import { BackendParams } from '@octocloud/core';
import type { IAPI } from '../api/Api';
import { UnitHelper } from '../util/UnitIHelper';

export interface IAvailabilityService {
  getAvailability: (schema: AvailabilityBodySchema, params: BackendParams) => Promise<Availability[]>;
  getAvailabilityCalendar: (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ) => Promise<AvailabilityCalendar[]>;
}

export class AvailabilityService implements IAvailabilityService {
  public constructor(private readonly api: IAPI = inject('IAPI')) {
    this.api = api;
  }

  public getAvailability = async (schema: AvailabilityBodySchema, params: BackendParams): Promise<Availability[]> => {
    const availabilities = await this.api.getAvailability(schema, params);

    if (params.useRawUnits) {
      return availabilities;
    }

    return UnitHelper.updateWithFilteredFirstUnitPricing(availabilities);
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => {
    const availabilityCalendars = await this.api.getAvailabilityCalendar(schema, params);

    if (params.useRawUnits) {
      return availabilityCalendars;
    }

    return UnitHelper.updateWithFilteredFirstUnitCalendarPricing(availabilityCalendars);
  };
}
