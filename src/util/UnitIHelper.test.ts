import { AvailabilityModelGenerator, AvailabilityParser } from '@octocloud/generators';
import { Availability, AvailabilityStatus, PricingUnit, UnitType } from '@octocloud/types';
import { describe, expect, it } from 'vitest';
import { UnitHelper } from './UnitIHelper';

describe('UnitHelper', () => {
  const availabilityModelGenerator = new AvailabilityModelGenerator();
  const availabilityParser = new AvailabilityParser();

  const successLocalDateTimeStart = '2023-12-01T00:00:00+01:00';
  const unavailableLocalDateTimeStart = '2023-12-02T00:00:00+01:00';

  const availabilityModels = availabilityModelGenerator.generateMultipleAvailabilities([
    {
      localDateTimeStart: successLocalDateTimeStart,
    },
    {
      localDateTimeStart: unavailableLocalDateTimeStart,
      available: false,
    },
    {
      localDateTimeStart: '2023-12-03T00:00:00+01:00',
      available: true,
      unitPricing: undefined,
    },
  ]);

  const availabilyPOJOs = availabilityModels.map((availabilityModel) => {
    return availabilityParser.parseModelToPOJO(availabilityModel);
  });

  describe('updateWithFilteredFirstUnitPricing', () => {
    it('should return an empty array when given an empty array', () => {
      const result = UnitHelper.updateWithFilteredFirstUnitPricing([]);
      expect(result).toEqual([]);
    });

    it('should return the same array when no unitPricing is present', () => {
      const result = UnitHelper.updateWithFilteredFirstUnitPricing([availabilyPOJOs[2]]);
      expect(result).toEqual([availabilyPOJOs[2]]);
    });

    it('should filter out duplicate unit pricings for each availability', () => {
      const unitPricing1: PricingUnit[] = [
        {
          unitId: '1',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '2',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
        {
          unitId: '1',
          original: 30,
          retail: 35,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
      ];
      const unitPricing2: PricingUnit[] = [
        {
          unitId: '3',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '4',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
        {
          unitId: '3',
          original: 30,
          retail: 35,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
      ];
      const availabilities: Availability[] = [
        {
          id: '1',
          localDateTimeStart: '2024-02-19T08:00:00',
          localDateTimeEnd: '2024-02-19T18:00:00',
          allDay: false,
          available: true,
          status: AvailabilityStatus.AVAILABLE,
          vacancies: 10,
          capacity: 20,
          maxUnits: 5,
          utcCutoffAt: '2024-02-19T06:00:00Z',
          openingHours: [{ from: '08:00', to: '18:00' }],
          unitPricing: unitPricing1,
        },
        {
          id: '2',
          localDateTimeStart: '2024-02-20T08:00:00',
          localDateTimeEnd: '2024-02-20T18:00:00',
          allDay: false,
          available: true,
          status: AvailabilityStatus.AVAILABLE,
          vacancies: 5,
          capacity: 10,
          maxUnits: 2,
          utcCutoffAt: '2024-02-20T06:00:00Z',
          openingHours: [{ from: '08:00', to: '18:00' }],
          unitPricing: unitPricing2,
        },
      ];
      const expectedFilteredUnitPricing1: PricingUnit[] = [
        {
          unitId: '1',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '2',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
      ];
      const expectedFilteredUnitPricing2: PricingUnit[] = [
        {
          unitId: '3',
          original: 10,
          retail: 15,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.ADULT,
        },
        {
          unitId: '4',
          original: 20,
          retail: 25,
          net: null,
          currency: 'USD',
          currencyPrecision: 2,
          includedTaxes: [],
          unitType: UnitType.CHILD,
        },
      ];
      const expectedResult: Availability[] = [
        {
          id: '1',
          localDateTimeStart: '2024-02-19T08:00:00',
          localDateTimeEnd: '2024-02-19T18:00:00',
          allDay: false,
          available: true,
          status: AvailabilityStatus.AVAILABLE,
          vacancies: 10,
          capacity: 20,
          maxUnits: 5,
          utcCutoffAt: '2024-02-19T06:00:00Z',
          openingHours: [{ from: '08:00', to: '18:00' }],
          unitPricing: expectedFilteredUnitPricing1,
        },
        {
          id: '2',
          localDateTimeStart: '2024-02-20T08:00:00',
          localDateTimeEnd: '2024-02-20T18:00:00',
          allDay: false,
          available: true,
          status: AvailabilityStatus.AVAILABLE,
          vacancies: 5,
          capacity: 10,
          maxUnits: 2,
          utcCutoffAt: '2024-02-20T06:00:00Z',
          openingHours: [{ from: '08:00', to: '18:00' }],
          unitPricing: expectedFilteredUnitPricing2,
        },
      ];
      const result = UnitHelper.updateWithFilteredFirstUnitPricing(availabilities);
      expect(result).toEqual(expectedResult);
    });
  });
});
