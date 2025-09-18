import { BaseConfig, RequestContext, RequestMethod, fetchRetry } from '@octocloud/core';

export class AlertLogger {
  public alert = async (ctx: RequestContext, config: BaseConfig): Promise<void> => {
    if (!config.alertWebhookURL) {
      return;
    }

    let channel: string;
    let action: string;
    
    try {
      channel = ctx.getChannel();
    } catch {
      channel = 'unknown';
    }
    
    try {
      action = ctx.getAction();
    } catch {
      action = 'unknown';
    }

    const text = `Env: ${ctx.getEnvironment()}\n
Channel: ${channel}\n
Action: ${action}\n
URL: ${this.getRequestDashboardUrl(ctx.getRequestId())}\n`;

    const request = new Request(config.alertWebhookURL, {
      method: RequestMethod.Post,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    try {
      await fetchRetry(request);
    } catch (error) {
      // ignore
    }
  };

  public getRequestDashboardUrl(requestId: string): string {
    return `https://dashboard.ventrata.com/admin/requests?fixed_filters[id]=${requestId}&locale=en#dt-row:${requestId}`;
  }
}
