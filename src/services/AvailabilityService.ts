import { inject, singleton } from "tsyringe"
import {
  Availability,
  AvailabilityBodySchema,
  AvailabilityCalendar,
  AvailabilityCalendarBodySchema,
} from "@octocloud/types";

import { BackendParams } from '@octocloud/core';
import type { IAPI } from "../api/Api";

export interface IAvailabilityService {
  getAvailability(
    schema: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Availability[]>;
  getAvailabilityCalendar(
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]>;
}

@singleton()
export class AvailabilityService implements IAvailabilityService {
  constructor(@inject("IAPI") private api: IAPI) {
    this.api = api;
  }
  public getAvailability = (
    schema: AvailabilityBodySchema,
    params: BackendParams,
  ): Promise<Availability[]> => this.api.getAvailability(schema, params);

  public getAvailabilityCalendar = (
    schema: AvailabilityCalendarBodySchema,
    params: BackendParams,
  ): Promise<AvailabilityCalendar[]> =>
    this.api.getAvailabilityCalendar(schema, params);
}
