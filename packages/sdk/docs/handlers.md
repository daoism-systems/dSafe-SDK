# Handler Specificaitons

## Introduction

This document provides detailed documentation for various handlers within the dSafe SDK. These handlers facilitate interactions between the client application and the blockchain, leveraging ComposeDB for decentralized data management. Each handler is designed to perform specific operations within the dSafe ecosystem, enhancing the SDK's capabilities in managing safes, transactions, and delegates.

## Table of Contents

1. [handleCreateTransaction](#handlecreatetransaction)
2. [handleUpdateConfirmations](#handleupdateconfirmations)
3. [handleGetSafe](#handlegetsafe)
4. [handleGetAllTransactions](#handlegetalltransactions)
5. [handleGetTransaction](#handlegettransaction)
6. [handleGetTransactionConfirmations](#handlegettransactionconfirmations)
7. [handleUpdateDelegates](#handleupdatedelegates)
8. [handleGetDelegates](#handlegetdelegates)
9. [handleGetSafe](#handlegetsafe)
10. [handleMarkTransactionExecuted](#handlemarktransactionexecuted)

## handleCreateTransaction

The `handleCreateTransaction` function within the dSafe SDK serves a pivotal role in creating transactions on the blockchain, particularly within a decentralized finance (DeFi) environment. This handler is specifically designed to interact with ComposeDB to manage transaction data, ensuring seamless operation within the dSafe ecosystem. Below is a detailed explanation of its internal workings and interactions with ComposeDB.

### Function Overview

`handleCreateTransaction` is tasked with several critical operations, including verifying the existence of a safe, interacting with external APIs to gather necessary transaction data, and orchestrating the creation of transactions and their related entities in ComposeDB.

### Key Steps and Logic

1. **Payload Validation:** The function begins by ensuring the payload is not undefined and contains all required information, such as the `safe` address and the network the safe is deployed on. This validation step is crucial for the subsequent operations and interactions with ComposeDB.

2. **Safe Existence Check:** It checks if the specified safe exists in ComposeDB. If the safe does not exist, it proceeds to create a new safe entry in ComposeDB, populating it with data fetched from an external API (specified by `API_ENDPOINT(network)`).

3. **Safe Data Composition:** If the safe needs to be created, the function composes a new safe entity in ComposeDB, including all relevant details like the network ID, safe address, version, and other parameters critical to the safe's operation and identification.

4. **Signer Validation and Creation:** The handler ensures that the signer (transaction initiator) exists in ComposeDB. If the signer is not already present, it creates a new signer entity and establishes a relationship between the signer and the safe, indicating the signer's permission to initiate transactions for the safe.

5. **Transaction Creation:** It constructs the transaction entity, including details like the transaction hash, recipient, value, data, operation type, and nonce. This step is pivotal, as it records the transaction's intent and associated parameters in ComposeDB for traceability and auditing purposes.

6. **Transaction Confirmation:** For each new transaction, a confirmation entity is also created, linking the transaction to its signer and including the signer's signature. This mechanism ensures that each transaction is backed by verifiable consent from authorized signers.

7. **Idempotency and Error Handling:** The function checks if a transaction with the specified nonce already exists for the safe. If so, it follows the principle of idempotency by not duplicating the transaction. This behavior aligns with ensuring consistent and reliable transaction management.

### Interactions with ComposeDB

The handler extensively interacts with ComposeDB to store, retrieve, and manage decentralized data related to transactions, safes, signers, and confirmations. By leveraging ComposeDB's capabilities, `handleCreateTransaction` ensures that all transaction-related data is maintained in a decentralized, secure, and auditable manner. These interactions are facilitated through various utility functions such as `checkSafeExists`, `composeSafe`, `checkSignerExists`, `composeSigner`, and more, each serving a specific purpose in the data management lifecycle.

## handleUpdateConfirmations

The `handleUpdateConfirmations` function plays a crucial role within the dSafe SDK, focusing on updating the confirmation status of a transaction within the ComposeDB infrastructure. This handler ensures that transactions executed within the dSafe ecosystem can be confirmed by authorized signers, reflecting the decentralized governance model intrinsic to many blockchain applications. Below is a detailed exploration of its operation and interaction with ComposeDB.

### Overview

`handleUpdateConfirmations` is designed to add confirmation to a transaction by a signer. This process is integral to multisig transaction workflows, where multiple confirmations are required for a transaction to be executed.

### Key Operations

1. **Validation and Transaction Existence Check:** Initially, the handler validates the provided payload, especially the `safe_tx_hash`, to ensure that the transaction for which confirmation is being added exists within ComposeDB. If the transaction does not exist, it throws an error indicating such.

2. **Fetching Transaction and Safe Information:** Utilizing the provided `safe_tx_hash` and `safe`, the function attempts to fetch transaction details from an external API. This step is crucial for verifying the transaction's existence and gathering necessary data for confirmation.

3. **Signer Verification and Creation:** The handler verifies whether the signer (identified by `sender` in the payload) exists in ComposeDB. If the signer does not exist but is listed as an owner of the safe, a new signer entity is created within ComposeDB. This step ensures that all entities involved in confirming transactions are accurately represented and tracked.

4. **Adding Confirmation to Transaction:** With the signer verified or created, the handler proceeds to add a confirmation to the transaction in ComposeDB. It constructs a confirmation entity linking the signer to the transaction, along with the signer's signature as proof of confirmation.

5. **Confirmation Creation Check:** After attempting to add the confirmation, the handler checks if the confirmation was successfully created in ComposeDB. It logs the outcome of this operation, providing feedback on the confirmation's creation status.

### ComposeDB Interactions

The function extensively interacts with ComposeDB to manage the entities involved in transaction confirmation. These interactions include:

- **Checking for the existence of transactions and signers** within ComposeDB, ensuring that the entities involved in the confirmation process are accurately represented.
- **Creating signer entities** in ComposeDB when necessary, adding depth to the ecosystem's representation of transaction participants.
- **Adding confirmations to transactions**, directly manipulating the transaction's state within ComposeDB to reflect the decentralized governance model.

## handleGetSafe

The `handleGetSafe` function is a specialized route handler within the dSafe SDK designed to retrieve detailed information about a specific safe from ComposeDB. This handler is crucial for applications that require access to the properties and state of a safe, including its configuration and transaction history. Below is an in-depth look at how `handleGetSafe` operates and interacts with ComposeDB to fulfill these data retrieval requests.

### Overview

`handleGetSafe` simplifies the process of fetching safe information by abstracting direct interactions with ComposeDB behind a straightforward API. It leverages the `GetSafePayload` to specify the target safe's address and optionally the network, facilitating targeted data retrieval.

### Key Operations

1. **Payload Validation:** The function begins by validating the input payload, specifically ensuring that a safe address (`address`) is defined. This step is critical as the safe address is the key identifier used to query ComposeDB for the relevant safe information.

2. **Fetching Safe Data:** Upon validating the payload, `handleGetSafe` invokes the `getSafe` utility function, passing the safe address and the `composeClient`. The `getSafe` function is responsible for querying ComposeDB and retrieving the data associated with the specified safe address.

3. **Data Retrieval and Response:** The retrieved safe data is then logged for debugging purposes and encapsulated within a `DSafeResponse` object. This object, structured with a `status` indicating the success of the operation and the `data` containing the safe's information, is returned to the caller.

### Interaction with ComposeDB

The interaction with ComposeDB is primarily facilitated through the `getSafe` utility function. This function plays a pivotal role in querying ComposeDB for specific safe information based on the provided address. It directly communicates with ComposeDB, leveraging the capabilities of the ComposeClient to execute the query and fetch the required data.

### Usage Scenario

`handleGetSafe` is particularly useful in scenarios where an application needs to display detailed information about a safe, verify the safe's configuration before performing transactions, or audit the safe's properties and associated activities. By providing a direct method to access this information, `handleGetSafe` enhances the dSafe SDK's utility in managing and interacting with safes in a decentralized environment.

## handleGetAllTransactions

The `handleGetAllTransactions` function is a critical component of the dSafe SDK, designed to fetch all transactions associated with a specific safe from ComposeDB. This handler enables applications to access a comprehensive list of transactions for auditing, monitoring, or display purposes. Below is a detailed examination of its functionality and how it interacts with ComposeDB to retrieve transaction data.

### Overview

`handleGetAllTransactions` streamlines the retrieval of transaction data for a given safe by abstracting the complexities of querying ComposeDB. It uses the `GetAllTransactionsPayload` to specify the safe's address and optionally the network, facilitating a targeted approach to data fetching.

### Key Operations

1. **Network Identification:** The function begins by determining the network ID using the provided `network` parameter, which is essential for querying transactions within the correct blockchain context.

2. **Payload Validation:** It validates the input payload to ensure the safe address (`address`) is defined. This validation is crucial as the safe address serves as the primary identifier for fetching associated transactions from ComposeDB.

3. **Safe Existence Check:** Before proceeding to fetch transactions, the handler verifies the existence of the safe in ComposeDB using the `checkSafeExists` utility function. If the safe does not exist, an error is thrown to indicate this.

4. **Fetching Transactions:** With the safe's existence confirmed, `handleGetAllTransactions` retrieves all transactions associated with the safe's ID. This retrieval is performed through the `getAllTransactions` utility function, which queries ComposeDB using the safe's ID and the network ID.

5. **Formatting Response Data:** The retrieved transactions are then formatted into a structured response, including the total count of transactions and the transactions themselves. This structured response enhances the usability of the data for calling applications.

### Interaction with ComposeDB

The interaction with ComposeDB is facilitated through two primary utility functions:

- **`checkSafeExists`**: This function checks for the existence of a safe in ComposeDB based on the provided safe address. It is a preliminary step to ensure that the subsequent transaction retrieval is performed for a valid and existing safe.
  
- **`getAllTransactions`**: After confirming the safe's existence, this function queries ComposeDB for all transactions associated with the safe's ID and the specified network. It leverages the capabilities of the `ComposeClient` to execute this query efficiently.

### Usage Scenario

`handleGetAllTransactions` finds its utility in scenarios requiring a holistic view of a safe's transaction history. Whether for auditing purposes, monitoring transaction activity, or displaying a transaction log to users, this handler provides essential functionality for applications requiring access to transaction data within the dSafe ecosystem.

## handleGetTransaction

The `handleGetTransaction` function within the dSafe SDK is tasked with fetching detailed information about a specific transaction based on its hash. This capability is essential for applications that require access to transaction details for verification, display, or auditing purposes. Here's a closer look at how `handleGetTransaction` operates and its interactions with ComposeDB to retrieve the needed data.

### Overview

`handleGetTransaction` provides a streamlined approach to accessing detailed information about a transaction. It uses the `GetTransactionPayload` to specify the transaction hash (`safeTxHash`) and optionally the network, facilitating precise and targeted data retrieval from ComposeDB.

### Key Operations

1. **Network Identification:** Initially, the function identifies the network ID using the provided `network` parameter. This ID is crucial for ensuring that the query is executed within the correct blockchain context in ComposeDB.

2. **Payload Validation:** The handler validates the input payload to ensure that a `safeTxHash` is defined. This transaction hash is the primary key for querying the specific transaction details from ComposeDB.

3. **Fetching Transaction Data:** With the `safeTxHash` validated, `handleGetTransaction` proceeds to fetch the transaction details from ComposeDB. The `getTransaction` utility function is invoked, passing the `safeTxHash` and `networkId`. This function is responsible for querying ComposeDB and retrieving the data associated with the specified transaction hash.

4. **Return Transaction Data:** The retrieved transaction data is returned to the caller encapsulated within a `DSafeResponse` object. This object includes a `status` indicating the success of the operation and the `data` containing the transaction's details.

### Interaction with ComposeDB

The primary interaction with ComposeDB in this handler is facilitated through the `getTransaction` utility function. This function queries ComposeDB for a transaction using its unique hash and the specified network ID. Given that a `safeTxHash` is unique across all chains, the function ensures that the correct transaction is fetched regardless of the blockchain network.

### Usage Scenario

`handleGetTransaction` is particularly useful in scenarios where an application needs to:

- Display detailed information about a specific transaction to the user.
- Verify the details of a transaction as part of a larger auditing or compliance process.
- Retrieve transaction details for processing or analysis within the application.

By providing direct access to transaction data based on its unique hash, `handleGetTransaction` enhances the dSafe SDK's utility in managing and interacting with transactions in a decentralized environment.

## handleGetTransactionConfirmations

The `handleGetTransactionConfirmations` function within the dSafe SDK focuses on retrieving all confirmations for a given transaction, identified by its hash. This functionality is crucial for multisig transaction management, allowing applications to monitor and display which signers have approved a transaction. Below is an in-depth exploration of its operation and its interactions with ComposeDB.

### Overview

`handleGetTransactionConfirmations` offers a targeted approach to fetching confirmation details for a specific transaction. Utilizing the `GetTransactionConfirmationsPayload`, it specifies the transaction hash (`safeTxHash`) and optionally the network, ensuring accurate retrieval of confirmation data from ComposeDB.

### Key Operations

1. **Network Identification:** The function starts by identifying the network ID using the provided `network` parameter, ensuring that the query is executed within the correct blockchain context in ComposeDB.

2. **Payload Validation:** It validates the input payload to ensure that a `safeTxHash` is provided. The transaction hash serves as the primary identifier for fetching associated confirmation details from ComposeDB.

3. **Fetching Confirmation Data:** With the `safeTxHash` validated, `handleGetTransactionConfirmations` proceeds to query ComposeDB for all confirmations related to the specified transaction hash. This is done through the `getTransactionConfirmations` utility function, which is responsible for querying ComposeDB and retrieving the confirmation data.

4. **Formatting and Returning Data:** The retrieved confirmation data is then formatted, extracting the confirmation details from the `edges` of the response graph. These details are encapsulated within a `DSafeResponse` object, which includes a `status` indicating the success of the operation and the `data` containing the confirmation details.

### Interaction with ComposeDB

The interaction with ComposeDB is primarily facilitated through the `getTransactionConfirmations` utility function. This function queries ComposeDB for confirmations associated with the specified transaction hash and network ID. It leverages the `ComposeClient` to execute this query efficiently, ensuring that the correct confirmation data is retrieved based on the unique transaction hash.

### Usage Scenario

`handleGetTransactionConfirmations` is especially useful in scenarios requiring visibility into the approval status of multisig transactions. Whether for auditing purposes, to inform users about the current state of transaction approvals, or to facilitate further transaction processing steps, this handler provides essential functionality for applications requiring detailed insight into transaction confirmations.

## handleUpdateDelegates

The `handleUpdateDelegates` function is a dedicated handler within the dSafe SDK designed for managing delegate permissions associated with a safe. Delegates are external entities authorized to perform certain actions on behalf of the safe without needing to be owners. This handler enables the addition or updating of such delegate permissions via interactions with ComposeDB. Below is a detailed overview of its functionality and operation.

### Overview

`handleUpdateDelegates` leverages the `UpdateDelegatePayload` to facilitate the delegation process, ensuring that delegate permissions are accurately reflected and managed within the dSafe ecosystem. This process involves validating the existence of the safe and delegate, and subsequently updating ComposeDB with the delegate information.

### Key Operations

1. **Payload and Network Validation:** The function begins by extracting and validating the payload and network information. It ensures that the delegate and safe addresses are defined and identifies the network using the CAIP standard.

2. **Safe Existence Check:** Before proceeding, it verifies the existence of the safe in ComposeDB. If the safe does not exist, an error is thrown, indicating that delegation operations cannot proceed.

3. **Delegate Existence Check:** The handler then checks if the delegate already exists for the safe within the specified network context. This is achieved by querying ComposeDB for any existing delegate entities associated with the safe's stream ID.

4. **Delegate Creation or Update:** If the delegate does not exist, `handleUpdateDelegates` proceeds to create a new delegate entity in ComposeDB. This involves composing the delegate with the necessary information, such as the delegate's address and the delegator's (signer's) stream ID. In cases where the delegator does not exist in ComposeDB but is listed as an owner of the safe, a new signer entity is created to maintain accurate records.

5. **Response and Status Code Generation:** After attempting to add or update the delegate in ComposeDB, the function generates a response indicating the success or failure of the operation. This response includes a status code derived from the ComposeDB operation outcome.

### Interaction with ComposeDB

The `handleUpdateDelegates` function interacts with ComposeDB through several utility functions, including:

- **`checkSafeExists`**: Verifies the existence of the safe in ComposeDB.
- **`getDelegate`**: Fetches existing delegate information for the safe.
- **`composeSigner`**: Creates a new signer entity in ComposeDB if the delegator does not exist.
- **`composeDelegate`**: Adds or updates the delegate information in ComposeDB.

These interactions ensure that delegate permissions are accurately managed and reflected within the decentralized framework provided by ComposeDB.

### Usage Scenario

`handleUpdateDelegates` is crucial for applications that implement multisig transaction protocols or require delegation for executing transactions. It facilitates the secure and auditable management of delegate permissions, enabling safes to operate within a decentralized governance model effectively.

## handleGetDelegates

`The `handleGetDelegates` function is a crucial part of the dSafe SDK, tasked with retrieving all delegates associated with a given safe. This functionality is vital for managing access and permissions within the safe's ecosystem, enabling applications to audit and display which addresses are authorized to act on behalf of the safe. Let's delve into how `handleGetDelegates` operates and interacts with ComposeDB to fulfill these data retrieval requests.

### Overview

`handleGetDelegates` streamlines the process of fetching delegate information for a specific safe by abstracting direct interactions with ComposeDB behind a straightforward API. It relies on the `GetDelegatesPayload` to specify the safe's address and, optionally, the network, ensuring accurate retrieval of delegate data from ComposeDB.

### Key Operations

1. **Payload Validation:** Initially, the function validates the input payload to ensure that the safe address (`safeAddress`) is provided. This address is essential for querying ComposeDB for the relevant delegate information.

2. **Safe Existence Check:** Before proceeding with fetching delegates, the handler verifies the existence of the safe in ComposeDB using the `checkSafeExists` utility function. If the safe is not found, an error is thrown.

3. **Fetching Delegate Data:** With the safe's existence confirmed, `handleGetDelegates` queries ComposeDB for all delegates associated with the safe's ID. This retrieval is performed through the `getDelegate` utility function, which leverages the `safeStreamId` and the specified `network` (if provided).

4. **Formatting and Returning Data:** The retrieved delegate data is then returned to the caller. The response includes a `status` indicating the success of the operation and the `data` containing the list of delegates.

### Interaction with ComposeDB

The primary interaction with ComposeDB in this handler is facilitated through two utility functions:

- **`checkSafeExists`**: This function checks for the existence of a safe in ComposeDB based on the provided safe address. It ensures that the subsequent delegate retrieval is performed for a valid and existing safe.

- **`getDelegate`**: After confirming the safe's existence, this function queries ComposeDB for all delegates associated with the safe's ID and the specified network. It efficiently executes this query using the `ComposeClient`, ensuring accurate and comprehensive retrieval of delegate data.

### Usage Scenario

`handleGetDelegates` finds its utility in scenarios where an application needs to:

- Display a list of addresses authorized to act on behalf of the safe.
- Audit and manage delegate permissions for enhanced security and governance.
- Inform users about the current delegation status as part of transaction preparation or review processes.

By providing direct access to delegate information, `handleGetDelegates` enhances the dSafe SDK's utility in managing and interacting with safes in a decentralized environment.

Continuing from the earlier documentation, here's the detailed documentation for the `handleGetOwnersSafes` handler within the dSafe SDK.

---

## handleGetOwnersSafes

The `handleGetOwnersSafes` function is designed to retrieve all safes associated with a given owner's address. This functionality is essential for applications that need to display or manage all safes under a single owner, enhancing user experience by providing a consolidated view of ownership.

### Key Operations

- **Payload Validation:** Initially, the function ensures that the payload contains a defined `address` field. This address is crucial as it represents the owner whose safes are to be retrieved.
  
- **Fetching Owner's Safes:** Upon validating the payload, `handleGetOwnersSafes` queries ComposeDB for safes associated with the owner's address. This is achieved through the `getOwnersSafes` utility function, which takes the owner's address as input and returns all corresponding safes.
  
- **Returning Safes Data:** The data retrieved from ComposeDB, which includes a list of safes owned by the specified address, is then formatted and returned to the caller. The response includes a `status` flag set to `true` to indicate successful retrieval, alongside the `data` containing the list of safes.

### Interaction with ComposeDB

This handler directly interacts with ComposeDB through the `getOwnersSafes` utility function. This function performs a targeted query within ComposeDB using the owner's address to fetch all associated safes. The efficiency and accuracy of this query are pivotal for ensuring that the application can accurately reflect the ownership of safes.

### Usage Scenario

`handleGetOwnersSafes` finds its utility in scenarios where an application needs to:

- Display a list of all safes owned by a particular address, providing users with easy access to their assets.
- Perform operations or audits across all safes associated with a single owner, streamlining administrative tasks.
- Enhance navigation within the application by allowing users to switch between their owned safes seamlessly.

By providing a straightforward method to access all safes associated with an owner, `handleGetOwnersSafes` significantly contributes to the dSafe SDK's capabilities in managing and presenting decentralized assets.

Continuing with the detailed documentation for the dSafe SDK handlers, here's the breakdown for `handleMarkTransactionExecuted`.

---

## handleMarkTransactionExecuted

The `handleMarkTransactionExecuted` function is an essential part of the dSafe SDK, designed to mark a transaction as executed within the system. This handler plays a critical role in updating the transaction's status post-execution, reflecting the change across the decentralized ledger maintained in ComposeDB.

### Key Operations

- **Payload Validation:** The function starts by verifying that the payload contains a `safeTxHash`. This hash is crucial as it uniquely identifies the transaction to be marked as executed.
  
- **Fetching Transaction Data:** Utilizing the `safeTxHash`, the handler queries ComposeDB to fetch the corresponding transaction data. This step is pivotal to ensure that the transaction exists before attempting to update its status.
  
- **Marking Transaction as Executed:** Upon successful retrieval of the transaction data, the function proceeds to mark the transaction as executed. It does this by updating the transaction's record in ComposeDB, specifying the `executor` and the on-chain transaction hash (`txHash`) to denote execution.
  
- **Returning Update Status:** The outcome of the transaction update operation is then returned to the caller. This includes a status indicating whether the update was successful and, if applicable, the updated transaction data or an error message if the transaction was not found.

### Interaction with ComposeDB

`handleMarkTransactionExecuted` interacts with ComposeDB through two main utility functions:

- **`getTransaction`**: This function is used to fetch the transaction data based on the `safeTxHash` and `networkId`. It verifies the transaction's existence and retrieves its details from ComposeDB.

- **`updateTransaction`**: After confirming the transaction's existence, this function updates the transaction record in ComposeDB to reflect its execution status. It marks the transaction as executed by recording the executor's address and the on-chain transaction hash.

### Usage Scenario

`handleMarkTransactionExecuted` is vital in scenarios where the execution status of a transaction needs to be updated post-execution. This can include:

- Reflecting the successful execution of a transaction within the dSafe ecosystem for auditing and tracking purposes.
- Updating the UI of a dApp to show the latest status of transactions to users.
- Triggering subsequent processes that depend on the confirmation of a transaction's execution.

By accurately updating the execution status of transactions, `handleMarkTransactionExecuted` ensures the integrity and reliability of transaction management within dSafe-enabled applications.
