## Understanding the Internal Workings of `fetchLegacy`

The `fetchLegacy` function is a crucial component of the dSafe SDK. It abstracts the complexity of interacting with Safe's composeDB schema. This section delves into the internal mechanics of `fetchLegacy`, focusing on how it dynamically selects the appropriate handler based on the passed route.

### Overview of `fetchLegacy`

`fetchLegacy` is an async function that takes four parameters: `httpMethod`, `apiRoute`, an optional `payload`, and an optional `network` string.

```typescript
async fetchLegacy(
  httpMethod: HttpMethods,
  apiRoute: string,
  payload?: any,
  network?: string,
): Promise<DSafeResponse>
```

### Process Flow

1. **Request Handling:** `fetchLegacy` delegates request handling based on API route and method through `handleDSafeRequest`, which maps regex patterns to specific handler functions.

2. **Route Matching:** `handleDSafeRequest` combines `httpMethod` and `apiRoute` to match against predefined patterns in `routeHandlers`, selecting the appropriate handler for execution.

3. **Handler Execution:** The matched handler is executed with `composeClient`, `payload`, and `network` arguments to process the request and generate a response.

4. **Interaction with ComposeDB:** Matched handlers perform required mutations and queries on ComposeDB as per the endpoint's business logic. Detailed handler operations are documented [here](./handlers.md), showcasing specific ComposeDB interactions.

5. **Axios Fallback:** If no handler is found for a request, and it's not a 'DSAFE' method, `fetchLegacy` initiates an Axios request to the API using the given `payload` and `network`, ensuring all requests are processed.

6. **Response Management:** Errors from Axios requests are logged with detailed information, and `fetchLegacy` returns a response with the outcome status and data.

### `routeHandlers` Object Overview

The `routeHandlers` object maps regex patterns to specific request handler functions based on combinations of HTTP methods and API routes. This mechanism enables efficient processing tailored to each route, leveraging `composeClient` for operations requiring ComposeDB or similar technologies.

```typescript
const routeHandlers: Record<string, RouteHandler<any>> = {
  '^GET /v1/data-decoder/$': handleDataDecoder,
  '^POST /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleCreateTransaction,
  '^POST /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$': handleUpdateConfirmations,
  '^GET /v1/safes/0x[a-fA-F0-9]+/$': handleGetSafe,
  '^GET /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleGetAllTransactions,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/$': handleGetTransaction,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$': handleGetTransactionConfirmations,
  '^POST /v1/delegates/$': handleUpdateDelegates,
  '^GET /v1/delegates/\\?safe=0x[a-fA-F0-9]+$': handleGetDelegates,
  '^GET /v1/owners/0x[a-fA-F0-9]+/safes/$': handleGetOwnersSafes,
  '^DSAFE /markTransactionExecuted$': handleMarkTransactionExecuted,
};
```

Patterns are strings that become RegExp objects for matching against `httpMethod` and `apiRoute` combinations. This structure supports diverse API interactions, offering extensive flexibility for the SDK. 

For detailed usage, see [Technical Guide: Using `fetchLegacy`](./technical-guide.md#using-fetchlegacy).
