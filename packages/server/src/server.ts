import type {
  CreateVerificationSessionRequest,
  CreateVerificationSessionResponse,
  RedeemResultTokenRequest,
  RedeemResultTokenResponse,
  VerificationSession,
} from '@idbridge/shared';

export type IdbridgeServerClientOptions = {
  baseUrl: string;
  secretKey: string;
  fetchImpl?: typeof fetch;
};

/**
 * Server-side SDK. Secret key required. Do not use in browser.
 * For browser/frontend use, see @idbridge/client (publishable key only).
 */
export class IdbridgeServerClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof fetch;
  private readonly authHeader: string;

  constructor(opts: IdbridgeServerClientOptions) {
    this.baseUrl = opts.baseUrl.replace(/\/+$/, '');
    this.fetchImpl = opts.fetchImpl ?? fetch;
    this.authHeader = `Bearer ${opts.secretKey}`;
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

  async redeemResultToken(body: RedeemResultTokenRequest): Promise<RedeemResultTokenResponse> {
    return this.request('/v1/result-tokens/redeem', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  private async request<T>(path: string, init: RequestInit): Promise<T> {
    const res = await this.fetchImpl(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        'content-type': 'application/json',
        authorization: this.authHeader,
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
