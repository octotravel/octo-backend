import { inject, singleton } from 'tsyringe';
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
} from '@octocloud/types';

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

@singleton()
export class AvailabilityService implements IAvailabilityService {
  public constructor(@inject('IAPI') private readonly api: IAPI) {
    this.api = api;
  }

  public getAvailability = async (schema: AvailabilityBodySchema, params: BackendParams): Promise<Availability[]> => {
    const availabilities = await this.api.getAvailability(schema, params);
    return UnitHelper.updateWithFilteredFirstUnitPricing(availabilities);
  };

  public getAvailabilityCalendar = async (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> => {
    const availabilityCalendars = await this.api.getAvailabilityCalendar(schema, params);

    return UnitHelper.updateWithFilteredFirstUnitCalendarPricing(availabilityCalendars);
  };
}
