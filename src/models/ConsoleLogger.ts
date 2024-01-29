import { LogLevel, Logger } from '@octocloud/core';

export class ConsoleLogger implements Logger {
  public async fatal(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.FATAL, message, context);
  }

  public async error(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.ERROR, message, context);
  }

  public async warn(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.WARNING, message, context);
  }

  public async log(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.LOG, message, context);
  }

  public async info(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.INFO, message, context);
  }

  public async debug(message: string, context?: unknown): Promise<void> {
    await this.logLevel(LogLevel.DEBUG, message, context);
  }

  public async logLevel(level: LogLevel, message: string, context?: any): Promise<void> {
    if (level === LogLevel.FATAL || level === LogLevel.ERROR) {
      // eslint-disable-next-line no-console
      console.error(message);
    } else if (level === LogLevel.WARNING) {
      // eslint-disable-next-line no-console
      console.warn(message);
    } else if (level === LogLevel.LOG) {
      // eslint-disable-next-line no-console
      console.log(message);
    } else if (level === LogLevel.INFO) {
      // eslint-disable-next-line no-console
      console.info(message);
    } else if (level === LogLevel.DEBUG) {
      // eslint-disable-next-line no-console
      console.debug(message);
    }
  }
}
