# idbridge SDK (open-source)

This repository publishes the JavaScript/TypeScript SDK for the idbridge **Public API**.

## Packages
- `@idbridge/client`: thin HTTP client (\"5 line integration\") for creating sessions, reading status, and redeeming results.
- `@idbridge/shared`: shared public `/v1` contract types (DTOs, enums, SSE event shapes, normalized result shapes).

## Install
- `pnpm add @idbridge/client`

## Minimal usage

```ts
import { IdbridgeClient } from '@idbridge/client';

const client = new IdbridgeClient({
  baseUrl: 'https://api.example.com',
  secretKey: process.env.IDBRIDGE_SECRET_KEY,
});

const session = await client.createVerificationSession({
  credentialType: 'eudi.vc',
  claims: { /* ... */ },
});

const refreshed = await client.getVerificationSession(session.id);
```

## Development
- `pnpm install`
- `pnpm -w lint && pnpm -w typecheck && pnpm -w build`

## Security notes
- The SDK does not implement cryptography or protocol verification.
- Browser `EventSource` cannot send `Authorization` headers; use cookie auth or short-lived event tokens if SSE needs auth.


