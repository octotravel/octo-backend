import {
  RequestContext,
  HttpError,
  HttpErrorParams,
  BAD_REQUEST,
  FORBIDDEN,
  INTERNAL_SERVER_ERROR,
  INVALID_AVAILABILITY_ID,
  INVALID_BOOKING_UUID,
  INVALID_OPTION_ID,
  INVALID_PRODUCT_ID,
  INVALID_UNIT_ID,
  OctoBadRequestError,
  OctoForbiddenError,
  OctoInternalServerError,
  OctoInvalidAvailabilityIdError,
  OctoInvalidBookingUUIDError,
  OctoInvalidOptionIdError,
  OctoInvalidProductIdError,
  OctoInvalidUnitIdError,
  OctoUnauthorizedError,
  OctoUnprocessableEntityError,
  UNAUTHORIZED,
  UNPROCESSABLE_ENTITY,
  SubRequestData,
} from '@octocloud/core';

export class OctoApiErrorHandler {
  public async handleError(
    response: Response,
    subRequestData: SubRequestData,
    requestContext: RequestContext,
  ): Promise<void> {
    const status = response.status;
    let body: any;

    try {
      body = await response.clone().json();
    } catch (err) {
      requestContext.enableAlert();
      return;
    }

    const errorParams: HttpErrorParams = {
      message: body?.errorMessage ?? response.statusText,
      body,
      error: body?.error ?? null,
      requestId: requestContext.getRequestId(),
      subRequestId: subRequestData.id,
    };

    const error = this.errorMapper(body, errorParams, status);
    throw error;
  }

  private readonly errorMapper = (
    body: Record<string, string>,
    errorParams: HttpErrorParams,
    status: number,
  ): HttpError => {
    if (body.error === INVALID_PRODUCT_ID) {
      const productId = body.productId;
      return new OctoInvalidProductIdError(productId, body.errorMessage);
    }
    if (body.error === INVALID_OPTION_ID) {
      const optionId = body.optionId;
      return new OctoInvalidOptionIdError(optionId, body.errorMessage);
    }
    if (body.error === INVALID_UNIT_ID) {
      const unitId = body.unitId;
      return new OctoInvalidUnitIdError(unitId, body.errorMessage);
    }
    if (body.error === INVALID_AVAILABILITY_ID) {
      const availabilityId = body.availabilityId;
      return new OctoInvalidAvailabilityIdError(availabilityId, body.errorMessage);
    }
    if (body.error === INVALID_BOOKING_UUID) {
      const uuid = body.uuid;
      return new OctoInvalidBookingUUIDError(uuid, body.errorMessage);
    }
    if (body.error === BAD_REQUEST) {
      return new OctoBadRequestError(body.errorMessage);
    }
    if (body.error === UNPROCESSABLE_ENTITY) {
      return new OctoUnprocessableEntityError(body.errorMessage);
    }
    if (body.error === INTERNAL_SERVER_ERROR) {
      return new OctoInternalServerError(body.errorMessage);
    }
    if (body.error === UNAUTHORIZED) {
      return new OctoUnauthorizedError(body.errorMessage);
    }
    if (body.error === FORBIDDEN) {
      return new OctoForbiddenError(body.errorMessage);
    }
    if (status > 500) {
      return new OctoInternalServerError(body.errorMessage);
    }
    return new HttpError(status, errorParams);
  };
}
