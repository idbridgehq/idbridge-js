# @idbridge/client

Thin client for the idbridge **Public API**.

## Design goals
- “5 line integration”
- No cryptographic logic
- No protocol implementation
- No secret material in browser usage

## Install
- `pnpm add @idbridge/client`

## Minimal usage

```ts
import { IdbridgeClient } from '@idbridge/client';

const client = new IdbridgeClient({ baseUrl: 'https://api.example.com', secretKey: process.env.IDBRIDGE_SECRET_KEY });
const session = await client.createVerificationSession({ credentialType: 'eudi.vc', claims: { /* ... */ } });
const refreshed = await client.getVerificationSession(session.id);
// on server:
// const redeemed = await client.redeemResultToken({ token: resultToken });
```

## SSE note
Browser `EventSource` cannot send `Authorization` headers. If SSE needs auth, prefer:
- cookie-based auth for hosted verify UI, or
- a short-lived event token passed in the URL.


