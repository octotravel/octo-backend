import { Backend, BaseConfig, Logger } from '@octocloud/core';
import { OctoBackend } from '..';
import { octoContainer } from '../di';
import { ConsoleLogger } from './ConsoleLogger';

export type BeforeRequest = ({ request }: { request: Request }) => Promise<Request>;

interface BackendContainerData {
  config: BaseConfig;
  logger?: Logger;
  beforeRequest?: BeforeRequest;
}

const noopBeforeRequest: BeforeRequest = async ({ request }) => {
  return await Promise.resolve(request);
};

export class BackendContainer {
  private readonly _backend: OctoBackend;

  public constructor(data: BackendContainerData) {
    const { config, logger, beforeRequest } = data;
    octoContainer.bind({ provide: 'Config', useValue: config });
    octoContainer.bind({ provide: 'Logger', useValue: logger ?? new ConsoleLogger() });
    octoContainer.bind({ provide: 'BeforeRequest', useValue: beforeRequest ?? noopBeforeRequest });

    this._backend = octoContainer.get(OctoBackend);
  }

  public get backend(): Backend {
    return this._backend;
  }
}
