import type {
  CreateVerificationSessionRequest,
  CreateVerificationSessionResponse,
  RedeemResultTokenRequest,
  RedeemResultTokenResponse,
  VerificationSession,
} from '@idbridge/shared';

export type IdbridgeClientOptions = {
  baseUrl: string; // e.g. https://api.idbridge.example
  publishableKey?: string; // browser/verify UI
  secretKey?: string; // server-side redemption and privileged calls
  fetchImpl?: typeof fetch;
};

export class IdbridgeClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly authHeader?: string;

  constructor(opts: IdbridgeClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = opts.fetchImpl ?? fetch;
    const key = opts.secretKey ?? opts.publishableKey;
    this.authHeader = key ? `Bearer ${key}` : undefined;
  }

  async createVerificationSession(
    body: CreateVerificationSessionRequest,
  ): Promise<CreateVerificationSessionResponse> {
    return this.request('/v1/verification-sessions', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getVerificationSession(id: string): Promise<VerificationSession> {
    return this.request(`/v1/verification-sessions/${encodeURIComponent(id)}`, { method: 'GET' });
  }

  /**
   * SSE helper. Consumers are responsible for closing the EventSource.
   * Browser-only. In Node, use a different SSE client.
   */
  createVerificationSessionEventSource(id: string): EventSource {
    const url = `${this.baseUrl}/v1/verification-sessions/${encodeURIComponent(id)}/events`;
    // Note: EventSource cannot set Authorization headers in browsers.
    // If auth is needed, prefer cookie-based auth for verify UI or use a short-lived event token in the URL.
    return new EventSource(url);
  }

  async redeemResultToken(body: RedeemResultTokenRequest): Promise<RedeemResultTokenResponse> {
    return this.request('/v1/result-tokens/redeem', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    // Boundary rule: keep the public SDK a “thin wrapper”.
    // - no protocol logic
    // - no crypto
    // - no policy
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        ...(this.authHeader ? { authorization: this.authHeader } : {}),
        ...(init.headers ?? {}),
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(`idbridge request failed: ${res.status} ${res.statusText}${text ? `: ${text}` : ''}`);
    }
    return (await res.json()) as T;
  }
}


