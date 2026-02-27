export type VerificationSessionStatus = 'created' | 'pending' | 'verified' | 'failed' | 'expired';

export type VerificationSession = {
  id: string;
  status: VerificationSessionStatus;
  expiresAt: string; // ISO
  qrPayload?: string;
  deepLink?: string;
  resultToken?: string;
  /** Nonce for the OpenID4VP authorization request. Used by the gateway to validate the wallet response. */
  nonce?: string;
  credentialType?: string;
};

export type CreateVerificationSessionRequest = {
  credentialType: string;
  claims?: Record<string, unknown>;
};

export type CreateVerificationSessionResponse = VerificationSession;

export type RedeemResultTokenRequest = {
  token: string;
};

export type NormalizedResult = {
  subjectId?: string;
  claims: Record<string, unknown>;
};

export type RedeemResultTokenResponse = {
  sessionId: string;
  result: NormalizedResult;
};

export type CreateEventTokenResponse = {
  token: string;
  expiresAt: string;
  sseUrl: string; // relative URL
};

export type SetVerificationSessionStatusRequest = {
  status: VerificationSessionStatus;
  result?: NormalizedResult;
};

export type SseEvent =
  | { type: 'status_changed'; sessionId: string; status: VerificationSessionStatus }
  | { type: 'verified'; sessionId: string }
  | { type: 'failed'; sessionId: string; code: string }
  | { type: 'expired'; sessionId: string };

/**
 * Contract note:
 * - Browser clients typically cannot set Authorization headers for SSE.
 * - If SSE requires auth, prefer cookie auth for hosted verify UI or a short-lived event token.
 */


