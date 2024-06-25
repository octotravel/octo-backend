import { PricingUnitHelper } from '@octocloud/core';
import { Availability, AvailabilityCalendar } from '@octocloud/types';

export class UnitHelper {
  public static updateWithFilteredFirstUnitPricing(availabilities: Availability[]): Availability[] {
    for (const availability of availabilities) {
      if (!availability.unitPricing || availability.unitPricing.length === 0) {
        continue;
      }

      const filteredUnitPricings = PricingUnitHelper.filterFirstUnitPricing(availability.unitPricing);
      availability.unitPricing = filteredUnitPricings;
    }

    return availabilities;
  }

  public static updateWithFilteredFirstUnitCalendarPricing = (
    availabilityCalendars: AvailabilityCalendar[],
  ): AvailabilityCalendar[] => {
    for (const availabilityCalendar of availabilityCalendars) {
      if (!availabilityCalendar.unitPricingFrom || availabilityCalendar.unitPricingFrom.length === 0) {
        continue;
      }

      const filteredUnitPricings = PricingUnitHelper.filterFirstUnitPricing(availabilityCalendar.unitPricingFrom);
      availabilityCalendar.unitPricingFrom = filteredUnitPricings;
    }

    return availabilityCalendars;
  };
}
