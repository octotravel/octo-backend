import {
  BaseConnection,
  RequestContext,
  IBaseRequestData,
  SubRequestData,
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
  OctoError,
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
} from '@octocloud/core';

interface OctoApiErrorHandlerOutput {
  requestData: IBaseRequestData;
  shouldRetry: boolean;
}

export class OctoApiErrorHandler {
  public handleError = async (
    requestData: SubRequestData,
    ctx: RequestContext,
    subRequestId: string,
    retryAttempt: number,
  ): Promise<OctoApiErrorHandlerOutput> => {
    const status = requestData.response.status;

    if (status < 200 || status >= 400) {
      const response = requestData.response.clone();
      const canRetry = retryAttempt < 2;
      let body: any;
      try {
        body = await response.json();
      } catch (err) {
        ctx.enableAlert();
        return {
          requestData,
          shouldRetry: canRetry,
        };
      }

      if (status > 500 && status < 599 && canRetry) {
        return {
          requestData,
          shouldRetry: canRetry,
        };
      }

      const errorParams = {
        message: body?.errorMessage ?? response.statusText,
        body,
        error: body?.error ?? null,
        requestId: ctx.getRequestId(),
        subRequestId,
      };

      const error = this.errorMapper(body, errorParams, status);

      requestData.setError(error);
      if (error instanceof OctoError) {
        throw error;
      }

      throw error;
    }
    return {
      requestData,
      shouldRetry: false,
    };
  };

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
