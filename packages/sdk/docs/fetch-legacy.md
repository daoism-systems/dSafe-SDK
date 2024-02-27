## Understanding the Internal Workings of `fetchLegacy`

The `fetchLegacy` function is a crucial component of the dSafe SDK, designed to abstract the complexity of interacting with Safe's composeDB schema. It serves as a bridge between the client-side application and the composeDB services, handling requests across different network configurations and API routes. This section delves into the internal mechanics of `fetchLegacy`, focusing on how it dynamically selects the appropriate handler based on the passed route.

### Overview of `fetchLegacy`

`fetchLegacy` is an asynchronous function that takes four parameters: `httpMethod`, `apiRoute`, an optional `payload`, and an optional `network` string. Its primary role is to facilitate communication with the composeDB by determining the correct handler for the given API route and method, executing the request, and processing the response.

```typescript
async fetchLegacy(
  httpMethod: HttpMethods,
  apiRoute: string,
  payload?: any,
  network?: string,
): Promise<DSafeResponse>
```

### Process Flow

1. **Handling the Request:** The core of `fetchLegacy` lies in its ability to delegate the request handling to specific functions based on the API route and method. This delegation is managed by the `handleDSafeRequest` function, which utilizes a mapping of regex patterns to handler functions.

2. **Dynamic Route Handling:** Inside `handleDSafeRequest`, the function constructs a string that combines the `httpMethod` and `apiRoute`. It then iterates over a predefined set of route handlers, checking if the combined string matches any regex patterns specified in the `routeHandlers` object.

3. **Executing the Handler:** Upon finding a match, `handleDSafeRequest` invokes the corresponding handler function with the `composeClient`, `payload`, and `network` as arguments. This handler function is responsible for processing the request and returning the response.

4. **Executing Mutations and Queries on ComposeDB:** When a handler matches the input route, it performs the necessary mutations and queries on ComposeDB relevant to the endpoint's specific business logic. This step involves direct interactions with ComposeDB or other services to fulfill the request's objectives. For developers interested in the specific operations executed by each handler, detailed documentation is available [here](./handlers.md), providing insights into the ComposeDB mutations, queries, and overall logic applied by each handler.

5. **Fallback to Axios Request:** If no matching handler is found (indicating that the request cannot be processed internally), and the `httpMethod` is not 'DSAFE', `fetchLegacy` constructs an Axios request. It attempts to directly interact with the specified API route, using the provided `payload` and `network` information. This step ensures that even unhandled routes can be processed, albeit without the specialized processing logic of dSafe handlers.

6. **Error Handling and Response:** `fetchLegacy` captures any errors that occur during the Axios request and logs detailed error information. Regardless of the request's success or failure, it returns a structured response containing the status and data.

### The `routeHandlers` Object

The `routeHandlers` object is a key component in the dynamic selection of request handlers. It maps regex patterns, which represent combinations of HTTP methods and API routes, to specific handler functions. These handlers are tailored to process requests for their respective routes efficiently, utilizing the `composeClient` for interactions that require ComposeDB or other decentralized technologies.

```typescript
const routeHandlers: Record<string, RouteHandler<any>> = {
  '^GET /v1/data-decoder/$': handleDataDecoder,
  '^POST /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleCreateTransaction,
  '^POST /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$': handleUpdateConfirmations,
  '^GET /v1/safes/0x[a-fA-F0-9]+/$': handleGetSafe,
  '^GET /v1/safes/0x[a-fA-F0-9]+/multisig-transactions/$': handleGetAllTransactions,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/$': handleGetTransaction,
  '^GET /v1/multisig-transactions/0x[a-fA-F0-9]+/confirmations/$':
    handleGetTransactionConfirmations,
  '^POST /v1/delegates/$': handleUpdateDelegates,
  '^GET /v1/delegates/\\?safe=0x[a-fA-F0-9]+$': handleGetDelegates,
  '^GET /v1/owners/0x[a-fA-F0-9]+/safes/$': handleGetOwnersSafes,
  '^DSAFE /markTransactionExecuted$': handleMarkTransactionExecuted,
};
```

Each pattern is a string that, when converted to a RegExp object, is used to test against the combined `httpMethod` and `apiRoute`. This design allows `fetchLegacy` to support a wide range of API routes with specific processing logic for each, enhancing the SDK's flexibility and capability to interact with diverse backend services.

Find usage guidelines [here](./technical-guide.md#using-fetchlegacy).
