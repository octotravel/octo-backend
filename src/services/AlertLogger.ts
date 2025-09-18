import { BaseConfig, RequestContext, RequestMethod, fetchRetry } from '@octocloud/core';

export class AlertLogger {
  public alert = async (ctx: RequestContext, config: BaseConfig): Promise<void> => {
    const text = `Env: ${ctx.getEnvironment()}\n
Channel: ${ctx.getChannel()}\n
Action: ${ctx.getAction()}\n
URL: ${this.getRequestDashboardUrl(ctx.getRequestId())}\n`;

    if (!config.alertWebhookURL) {
      return;
    }

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
