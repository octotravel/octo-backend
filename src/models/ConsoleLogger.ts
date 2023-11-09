import { LogLevel, Logger } from "@octocloud/core";

export class ConsoleLogger implements Logger {
    public async fatal(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.FATAL, message, context);
      }
    
      public async error(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.ERROR, message, context);
      }
    
      public async warning(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.WARNING, message, context);
      }
    
      public async log(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.LOG, message, context);
      }
    
      public async info(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.INFO, message, context);
      }
    
      public async debug(message: string, context?: unknown): Promise<void> {
        return this.logLevel(LogLevel.DEBUG, message, context);
      }

      public async logLevel(level: LogLevel, message: string, context?: unknown): Promise<void> {
        if(level === LogLevel.FATAL || level === LogLevel.ERROR) {
            console.error(message);
        } else if(level === LogLevel.WARNING) {
            console.warn(message);
        } else if(level === LogLevel.LOG) {
            console.log(message);
        } else if(level === LogLevel.INFO) {
            console.info(message);
        } else if(level === LogLevel.DEBUG) {
            console.debug(message);
        }
      }
}