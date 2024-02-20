# @daoism_systems/dsafe-sdk Documentation

## Introduction

The `@daoism_systems/dsafe-sdk` is a JavaScript SDK designed to facilitate seamless interactions with decentralised safe registry (dSafe).

## Installation

The `@daoism_systems/dsafe-sdk` can be installed in your project using npm, yarn, or pnpm. Choose the package manager that is most compatible with your workflow. Below are the commands for each package manager:

### Using npm

Run the following command in your project's root directory to install the SDK with npm:

```bash
npm install @daoism_systems/dsafe-sdk
```

### Using yarn

If you prefer yarn, use the following command to add the SDK to your project:

```bash
yarn add @daoism_systems/dsafe-sdk
```

### Using pnpm

For projects that use pnpm, you can install the SDK with:

```bash
pnpm add @daoism_systems/dsafe-sdk
```

## Initializing the SDK

Before you can utilize any functionality provided by `@daoism_systems/dsafe-sdk`, you need to initialize the SDK with appropriate configurations.

### Importing the DSafe Class

First, import the `DSafe` class from the package:

```javascript
import DSafe from '@daoism_systems/dsafe-sdk';
```

If you're using CommonJS modules, you can require the SDK as follows:

```javascript
const DSafe = require('@daoism_systems/dsafe-sdk').default;
```

### Creating an Instance

To create an instance of the `DSafe` class, you need two pieces of information: the `chainId` and the `ceramicNodeNetwork` URL.

- `chainId`: This is the CAIP ID of the network you wish to interact with. The CAIP (Chain Agnostic Improvement Proposal) ID provides a standardized way to identify blockchain networks.
  
- `ceramicNodeNetwork`: The URL of the Ceramic node you intend to use for decentralized data storage and management.

Example initialization:

```javascript
const chainId = 'eip155:1'; // Example CAIP ID for Ethereum Mainnet
const ceramicNodeNetwork = 'https://your-ceramic-node.com';

const dsafe = new DSafe(chainId, ceramicNodeNetwork);

// [BROWSER] when the intergation is for browser
await dsafe.initializeDIDOnClient(ethProvider);

// [NODE] when the intergation is for node
// PRIVATE_KEY is never stored, it's only used to generate DID within the function
await dsafe.initializeDIDOnNode(PRIVATE_KEY);
```

This initializes the `DSafe` object with the specified blockchain network and Ceramic node, making it ready for use in your application.

# Using `fetchLegacy`

## Overview

The `fetchLegacy` function is an essential method in the `@daoism_systems/dsafe-sdk`, designed to streamline interactions with dsafe registry. This function abstracts complex dsafe interaction processes, providing a simplified way to communicate with various API routes.

## Function Signature

```typescript
async fetchLegacy(
  httpMethod: HttpMethods,
  apiRoute: string,
  payload?: any,
  network?: string,
): Promise<DSafeResponse>
```

### Parameters

- **`httpMethod`**: Specifies the HTTP method for the request, with supported methods being `GET`, `POST`, `DELETE`, and `DSAFE`.
- **`apiRoute`**: The endpoint route (e.g., `/about`) for the request.
- **`payload`** (optional): The data or body for dSafe interaction, mainly used with `POST` and `DSAFE` methods.
- **`network`** (optional): Identifies the target safe's network for cross-environment interactions.

### Return Value

Returns a `Promise<DSafeResponse>` containing:
- **`status`**: Boolean indicating the success or failure of the request.
- **`data`**: The response data from the API route.

## Example Usage

Here's how to use `fetchLegacy` to query safes associated with an owner on a specific network:

```typescript
const testAccountOnSepolia = 'SomeHexValue';
const apiRoute = `/v1/owners/${testAccountOnSepolia}/safes/`;

// Fetching information using fetchLegacy
const result = await dsafe.fetchLegacy('GET', apiRoute, { address: testAccountOnSepolia });

// Processing the response
if (result.status) {
  console.log('Data fetched successfully:', result.data);
} else {
  console.error('Fetching data failed.');
}
```

This example demonstrates making a `GET` request to retrieve safes associated with an owner. The `payload` parameter, though optional, is used here to provide additional data for the request.

## Migration from Safe Transaction API

For developers previously working with the Safe Transaction API, migrating to `fetchLegacy` is straightforward:

- Replace direct calls to `fetch` with `fetchLegacy`.
- Adapt the parameters to match the `fetchLegacy` signature.

This method simplifies the transition to using `@daoism_systems/dsafe-sdk` by minimizing the required code changes.

## Interaction Types with `fetchLegacy`

`fetchLegacy` supports various interaction types with the blockchain, facilitating a wide range of operations from simple data retrieval to complex transaction processing. The next sections will detail different kinds of interactions possible through `fetchLegacy`, including querying blockchain data, submitting transactions, and managing decentralized identities.

- **Querying Data**: Demonstrates how to retrieve information from the blockchain using `GET` requests.
- **Submitting Transactions**: Covers the use of `POST` and `DSAFE` methods for transaction submission and processing.
- **Managing Decentralized Identities**: Explores interactions related to decentralized identity management, such as retrieving and updating identity records.

Each section will provide specific examples and best practices for using `fetchLegacy` to achieve these tasks, ensuring developers have the guidance needed to fully leverage the SDK's capabilities.

## API Route Implemented:

### Prerequisites

- Ensure you have the `@daoism_systems/dsafe-sdk` installed in your project.
- You need a Safe wallet address (`SAFE_ADDRESS`).
- The `ethers` library should be installed for interacting with the Ethereum blockchain.
- An Infura project ID (`INFURA_PROJECT_ID`) for network access.

### Mutations

#### Create new Transaction
API Path: `/v1/safes/{address}/multisig-transactions/`

This guide demonstrates how to create a new transaction within the dSafe environment using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. The process involves generating a transaction hash, signing the transaction, and submitting it to the blockchain via dSafe.

##### Steps to Create a New Transaction

1. **Define the Safe Address and Transaction Route:**

   Identify the safe address and the API route for creating multisig transactions.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   const createTransactionRoute = `/v1/safes/${safeAddress}/multisig-transactions/`;
   ```

2. **Get the Safe Contract ABI:**

   Retrieve the ABI for the safe contract. The ABI is essential for interacting with the contract on the Ethereum blockchain.

   ```typescript
   const safeAbi = getSafeSingletonDeployment()?.abi;
   if (safeAbi === undefined) {
     throw Error('Safe ABI is undefined');
   }
   ```

3. **Initialize the Ethereum Provider and Signer:**

   Set up the Ethereum provider and the signer using ethers.js. The signer is necessary for signing transactions.

   ```typescript
   const provider = // provider;
   const signer = // signer;
   ```

4. **Create a Safe Instance and Generate the Transaction Hash:**

   Instantiate the safe contract and generate the hash of the transaction you wish to execute.

   ```typescript
   const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer);
   const safeTrxHash = await safeInstance.getTransactionHash(
     trxInput.to,
     trxInput.value,
     trxInput.data,
     trxInput.operation,
     trxInput.safeTxGas,
     trxInput.baseGas,
     trxInput.gasPrice,
     trxInput.gasToken,
     trxInput.refundReceiver,
     trxInput.nonce,
   );
   ```

5. **Sign the Transaction Hash:**

   Sign the generated transaction hash with the signer's private key.

   ```typescript
   const signature = (await signer.signMessage(ethers.utils.arrayify(safeTrxHash)))
     .replace(/1b$/, '1f')
     .replace(/1c$/, '20');
   ```

6. **Prepare the Payload:**

   Organize the data required for the transaction into a payload object. This includes transaction details and the signature.

   ```typescript
   const payload = {
     // Transaction details
     signature,
     safe,
     sender,
     contractTransactionHash,
     to,
     data,
     baseGas,
     gasPrice,
     safeTxGas,
     value,
     operation,
     nonce,
     // Additional API data
     apiData: {
       safe: safeAddress,
       sender: signer.address,
       contractTransactionHash: safeTrxHash,
       // Other transaction inputs
       signature,
     },
   };
   ```

7. **Submit the Transaction:**

   Use `fetchLegacy` to submit the transaction. Specify `POST` as the method, the API route, and the prepared payload. Include the target network if necessary.

   ```typescript
   const dsafeResponse = await dsafe.fetchLegacy('POST', createTransactionRoute, payload, chainId);
   console.log({ dsafeResponse });
   ```

8. **Verify the Transaction:**

   Check the response status to ensure the transaction was successfully created.

   ```typescript
   expect(dsafeResponse.status).toBe(true);
   ```

##### Notes

- Replace `SAFE_ADDRESS`,  `chainId`, and `process.env.INFURA_PROJECT_ID` with actual values.
- `trxInput` should be filled with the details of the transaction you intend to execute, such as the recipient address (`to`), value, and data.
- This guide assumes familiarity with Ethereum transactions and the use of ethers.js for blockchain interactions.

#### Add new Confirmations to a transaction

This guide outlines the steps to add a new confirmation to an existing transaction within the dSafe environment using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. This is a critical operation for multi-signature transactions that require multiple confirmations to proceed.

### Steps to Add a New Confirmation

1. **Define the Safe Address and Retrieve the ABI:**

   Begin by defining the safe address and retrieving the contract ABI for interaction.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   const safeAbi = getSafeSingletonDeployment()?.abi;
   if (safeAbi === undefined) {
     throw Error('Safe ABI is undefined');
   }
   ```

2. **Initialize the Ethereum Provider and Signer:**

   Set up the provider and signer using ethers.js to interact with the Ethereum blockchain.

   ```typescript
   const provider = // provider;
   const signer = // signer;
   ```

3. **Instantiate the Safe Contract:**

   Create an instance of the safe contract to interact with.

   ```typescript
   const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer);
   ```

4. **Generate the Transaction Hash:**

   Generate the hash of the transaction that you wish to confirm.

   ```typescript
   const safeTrxHash = await safeInstance.getTransactionHash(
     trxInput.to,
     trxInput.value,
     trxInput.data,
     trxInput.operation,
     trxInput.safeTxGas,
     trxInput.baseGas,
     trxInput.gasPrice,
     trxInput.gasToken,
     trxInput.refundReceiver,
     trxInput.nonce,
   );
   ```

5. **Determine the Update Confirmation Route:**

   Identify the API route for adding a confirmation to the transaction.

   ```typescript
   const updateConfirmationRoute = `/v1/multisig-transactions/${safeTrxHash}/confirmations/`;
   ```

6. **Sign the Transaction Hash:**

   Sign the transaction hash to create a confirmation signature.

   ```typescript
   const signature = (await signer.signMessage(ethers.utils.arrayify(safeTrxHash)))
     .replace(/1b$/, '1f')
     .replace(/1c$/, '20');
   ```

7. **Prepare the Payload:**

   Organize the required data into a payload object for submission.

   ```typescript
   const payload = {
     apiData: {
       signature,
     },
     safe: safeAddress,
     signature,
     safe_tx_hash: safeTrxHash,
     sender: signer.address,
   };
   ```

8. **Submit the Confirmation:**

   Use `fetchLegacy` to submit the new confirmation to the transaction. Specify the method as `POST`, along with the API route and payload.

   ```typescript
   const result = await dsafe.fetchLegacy('POST', updateConfirmationRoute, payload, chainId);
   console.log(result);
   ```

### Notes

- Replace placeholders like `SAFE_ADDRESS`, `PRIVATE_KEY`, `chainId`, and `process.env.INFURA_PROJECT_ID` with actual values.
- `trxInput` should be populated with the transaction details you're confirming.
- This process is essential for multi-signature transactions, where multiple confirmations are required to execute a transaction fully.

#### Add new delegate

This guide details the procedure for adding a new delegate to a safe using the `fetchLegacy` function provided by the `@daoism_systems/dsafe-sdk`. Delegates are external addresses granted permissions to interact with the safe under specific conditions without needing access to the safe's private keys.

### Prerequisites

- The `@daoism_systems/dsafe-sdk` should be installed in your project.
- Access to an Ethereum wallet with its address (`delegateAddress`) and private key (`PRIVATE_KEY`).
- The `ethers` library installed for signing messages and Ethereum blockchain interaction.
- An Infura project ID (`INFURA_PROJECT_ID`) for accessing the Ethereum network.

### Steps to Add a New Delegate

1. **Define the Safe Address and Retrieve the ABI:**

   Begin by defining the safe address and retrieving the contract ABI for interaction.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   ```

2. **Initialize the  Signer:**

   Set up the signer using ethers.js to interact with the Ethereum blockchain.

   ```typescript
   const signer = // signer;

3. **Define the API Route and Delegate Information:**

   Specify the API route for adding a delegate and the label to identify the delegation relationship.

   ```typescript
   const addDelegateApiRoute = '/v1/delegates/';
   const label = 'delegator';
   ```

4. **Calculate the Time-based OTP (TOTP):**

   Generate a time-based one-time password (TOTP) as part of the signature to ensure temporal validity.

   ```typescript
   const totp = Math.floor(Date.now() / 1000 / 3600);
   ```

5. **Sign the Delegate Address and TOTP:**

   Create a signature combining the delegate's address and the TOTP to authenticate the request.

   ```typescript
   const signatureForDelegate = await signer.signMessage(delegateAddress + totp);
   ```

6. **Prepare the Payload for Adding a Delegate:**

   Assemble the data required to add a new delegate into a payload object.

   ```typescript
   const payload = {
     safe: testSafeOnSepolia,
     delegate: delegateAddress,
     delegator: signer.address,
     signature: signatureForDelegate,
     label,
     apiData: {
       safe: testSafeOnSepolia,
       delegate: delegateAddress,
       delegator: signer.address,
       signature: signatureForDelegate,
       label,
     },
   };
   ```

7. **Submit the Delegate Addition Request:**

   Use `fetchLegacy` to add the delegate through dSafe's abstraction.

   ```typescript
   const response = await dsafe.fetchLegacy('POST', addDelegateApiRoute, payload, chainId);
   expect(response.status).toBeTruthy();
   ```

### Notes

- Replace placeholders like `testSafeOnSepolia`, `delegateAddress`, `PRIVATE_KEY`, and `chainId` with actual values. Ensure `delegateAddress` is the Ethereum address of the new delegate.
- The `signer` must be initialized with the `PRIVATE_KEY` and connected to the Ethereum network (e.g., via Infura).
- The `label` serves as an identifier for the delegation relationship and can be any string value that helps to recognize the delegation purpose or context.
- This process requires the delegate's address to be signed along with a TOTP to ensure the request's temporal validity, enhancing security.

#### Mark a transaction as executed.

This guide covers the process of marking a transaction as executed within a dSafe-enabled application. This manual step is crucial for maintaining the application's transactional state, as dSafe does not have an indexer to automatically detect the execution status of Safe transactions.

### Steps to Mark a Transaction as Executed

1. **Define the Safe Address and Retrieve the ABI:**

   Begin by defining the Ethereum address of your safe and fetching the contract ABI for interaction.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   const safeAbi = getSafeSingletonDeployment()?.abi;
   if (safeAbi === undefined) {
      throw Error('Safe ABI is undefined');
   }
   ```

2. **Initialize the Ethereum Provider and Signer:**

   Set up the provider and signer using ethers.js for Ethereum blockchain interactions.

   ```typescript
   const provider = // provider;
   const signer = // signer;
   ```

3. **Instantiate the Safe Contract and Generate the Transaction Hash:**

   Create an instance of the safe contract and generate the hash for the transaction you're marking as executed.

   ```typescript
   const safeInstance = new ethers.Contract(safeAddress, safeAbi, signer);
   const safeTxHash = await safeInstance.getTransactionHash(
     trxInput.to,
     trxInput.value,
     trxInput.data,
     trxInput.operation,
     trxInput.safeTxGas,
     trxInput.baseGas,
     trxInput.gasPrice,
     trxInput.gasToken,
     trxInput.refundReceiver,
     trxInput.nonce,
   );
   ```

4. **Execute the Transaction from the Safe Instance:**

   Perform the transaction execution using the safe contract instance. This step involves calling the `execTransaction` method with the transaction details.

   ```typescript
   const transactionData = await dsafe.fetchLegacy('GET', getTransactionRoute, { safeTxHash }, chainId);
   const tx = await safeInstance.execTransaction(
     transactionData.data.to,
     transactionData.data.value,
     transactionData.data.data,
     transactionData.data.operation,
     transactionData.data.safeTxGas,
     transactionData.data.baseGas,
     transactionData.data.gasPrice,
     transactionData.data.gasToken,
     transactionData.data.refundReceiver,
     transactionData.data.signature
   );
   await tx.wait();
   ```

5. **Mark the Transaction as Executed in Your Application:**

   After successfully executing the transaction, use `fetchLegacy` with a custom method `DSAFE` (or another appropriate method as defined in your application) to mark the transaction as executed.

   ```typescript
   // a custom route has been added to adhere to the nature of fetchLegacy function   
   const updateExecutorApiRoute = '/markTransactionExecuted';
   const executor = await signer.getAddress();
   const payload = {
     executor,
     safeTxHash,
     txHash: tx.hash, // Assuming tx.hash is the transaction hash from the blockchain
   };

   const response = await dsafe.fetchLegacy('DSAFE', updateExecutorApiRoute, payload, chainId);
   console.log({ response: response.data });
   ```

### Notes

- Replace placeholders like `SAFE_ADDRESS`, `PRIVATE_KEY`, `chainId`, `process.env.INFURA_PROJECT_ID`, and `trxInput` with actual values.
- The `fetchLegacy` call to mark the transaction as executed is a crucial step that must be tailored to the specific implementation details of your dSafe integration. The method `DSAFE` and the route `/markTransactionExecuted` are illustrative and should be adjusted according to your application's API.
- This process is essential for applications using dSafe to manually track the execution status of transactions due to the lack of an automatic indexing feature in dSafe.

### Queries

#### Get Safe Data

This guide explains how to retrieve data for a specific safe using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. This operation is essential for fetching details about the safe, such as its owners, configuration, and other relevant information.

### Steps to Retrieve Safe Data

1. **Define the Safe Address and API Route:**

   Start by specifying the Ethereum address of the safe and the API endpoint for retrieving safe data.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   const getSafeRoute = `/v1/safes/${safeAddress}/`;
   ```

2. **Prepare the Payload:**

   Although the payload is not directly used in the `GET` request through `fetchLegacy`, it's prepared for potential use or consistency in documentation.

   ```typescript
   const payload = {
     address: safeAddress,
   };
   ```

3. **Retrieve Safe Data Using `fetchLegacy`:**

   Utilize the `fetchLegacy` function to abstract the dsafe complexity, simplifying the interaction process. Specify 'GET' as the method and provide the API route along with the chain ID.

   ```typescript
   const response = await dsafe.fetchLegacy('GET', getSafeRoute, payload, chainId);
   ```

5. **Process the Retrieved Data:**

   After fetching the data, you can access and utilize the safe's information as needed, such as listing the owners.

   ```typescript
   console.log({ response: response.data.owners });
   ```

### Notes

- Replace `SAFE_ADDRESS` and `chainId` with the actual safe address and blockchain network identifier.
- The `fetchLegacy` function is versatile and supports 'GET' requests without needing a payload, making it suitable for retrieving data.
- While the direct API call (optional step) demonstrates how to access the data without the SDK abstraction, using `fetchLegacy` streamlines the process and handles any SDK-specific configurations or optimizations.

#### Get all existing transactions on dSafe

This guide demonstrates how to fetch all multisig transactions associated with a specific safe using the `fetchLegacy` function provided by the `@daoism_systems/dsafe-sdk`. This functionality is crucial for monitoring transaction history and status within your application.

### Steps to Retrieve All Transactions

1. **Define the Safe Address and Transactions Route:**

   Specify the Ethereum address of the safe and the API endpoint for fetching multisig transactions.

   ```typescript
   const safeAddress = SAFE_ADDRESS;
   const getTransactionsRoute = `/v1/safes/${safeAddress}/multisig-transactions/`;
   ```

2. **Prepare the Payload:**

   While `GET` requests typically do not use payloads, defining it can help maintain consistency in handling API calls across different operations.

   ```typescript
   const payload = {
     address: safeAddress,
   };
   ```

3. **Retrieve Transactions Using `fetchLegacy`:**

   Use the `fetchLegacy` function to simplify the dSafe interaction. Provide 'GET' as the method, the transactions route, and the payload along with the chain ID.

   ```typescript
   const response = await dsafe.fetchLegacy('GET', getTransactionsRoute, payload, chainId);
   ```

4. **Process and Utilize the Retrieved Transactions:**

   With the transaction data fetched, you can now process or display this information as required by your application.

   ```typescript
   console.log({ apiResponse: apiResponse.data, response });
   ```

### Notes

- Replace `SAFE_ADDRESS` and `chainId` with the actual values corresponding to your safe and the blockchain network.
- The use of `fetchLegacy` for 'GET' requests streamlines interactions with the dSafe API, especially when handling standardized operations like retrieving transactions.
- Direct API calls are shown for completeness and to offer an alternative method of fetching data. However, the `fetchLegacy` function is recommended for its simplicity and integration with the dSafe SDK.

Retrieving Specific Transactions from dSafe Based on Safe Transaction Hash Using `fetchLegacy`
------------------------------------------------------------------------------------------------

This guide provides a detailed walkthrough on how to retrieve details for a specific transaction within a safe environment, identified by its transaction hash, using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. This functionality is particularly useful for tracking the status or details of individual transactions.

### Prerequisites

- The `@daoism_systems/dsafe-sdk` must be installed in your project.
- Ethereum wallet address (`SAFE_ADDRESS`) and its private key (`PRIVATE_KEY`).
- The `ethers` library for Ethereum blockchain interactions.
- An Infura project ID (`INFURA_PROJECT_ID`) for accessing the Ethereum network.

### Steps to Retrieve a Specific Transaction

1. **Define the Safe Transaction Hash:**

   Define the safeTrxHash for the transaction you're interested in.

   ```typescript
   const safeTxHash = // 0xSafeTrxHash;
   ```

2. **Prepare the Payload:**

   While `GET` requests typically do not require payloads, preparing it can ensure consistency across different types of requests.

   ```typescript
   const payload = {
     safeTxHash,
   };
   ```

3. **Retrieve the Transaction Data Using `fetchLegacy`:**

   Use `fetchLegacy` to abstract the dSafe interaction. Provide 'GET' as the method, the specific transaction route, and the payload along with the chain ID.

   ```typescript
   const response = await dsafe.fetchLegacy('GET', getTransactionRoute, payload, chainId);
   ```

4. **Process and Utilize the Transaction Data:**

   With the transaction details fetched, you can now access and use this information as required.

   ```typescript
   console.log({ response });
   ```

### Notes

- Replace placeholders like `SAFE_ADDRESS`, `PRIVATE_KEY`, `chainId`, and `process.env.INFURA_PROJECT_ID` with actual values. Ensure `trxInput` contains the transaction details you're querying.
- The use of `fetchLegacy` for 'GET' requests simplifies interactions with the dSafe API, especially for retrieving specific transaction details.
- Direct API calls are shown for completeness and offer an alternative way to access data. However, utilizing `fetchLegacy` is recommended for its ease of use and integration with the dSafe SDK.

#### Get Confirmations of Safe Transaction Hash

This guide describes how to obtain confirmations for a specific transaction within a safe environment using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. Confirmations are crucial for understanding the approval status of multisig transactions.

### Steps to Retrieve Transaction Confirmations

1. **Define the Safe Transaction Hash:**

   Define the safeTrxHash for the transaction you're interested in.

   ```typescript
   const safeTxHash = // 0xSafeTrxHash;
   ```

2. **Define the API Route for Retrieving Confirmations:**

   Specify the API route for fetching the transaction's confirmations using its hash.

   ```typescript
   const getConfirmationRoute = `/v1/multisig-transactions/${safeTxHash}/confirmations/`;
   ```

3. **Retrieve Confirmations Using `fetchLegacy`:**

   Use `fetchLegacy` to abstract the dSafe interaction, specifying 'GET' as the method along with the confirmations route and payload.

   ```typescript
   const payload = {
     safeTxHash,
   };
   
   const response = await dsafe.fetchLegacy('GET', getConfirmationRoute, payload, chainId);
   ```

4. **Process and Utilize the Confirmation Data:**

   With the confirmation details fetched, you can now analyze and display this information as required by your application.

   ```typescript
   console.log({response: response.data});
   ```

### Notes

- Replace placeholders like `SAFE_ADDRESS`, `PRIVATE_KEY`, `chainId`, and `process.env.INFURA_PROJECT_ID` with actual values. Ensure `trxInput` contains the transaction details for which confirmations are being queried.
- The use of `fetchLegacy` for 'GET' requests simplifies interactions with the dSafe API, especially when retrieving specific details like transaction confirmations.
- Direct API calls are shown for completeness and offer an alternative way to access data. However, utilizing `fetchLegacy` is recommended for its ease of use and integration with the dSafe SDK.

#### Get delegate for a safe

This guide outlines the steps to retrieve delegate information for a specific safe using the `fetchLegacy` function from the `@daoism_systems/dsafe-sdk`. Delegates are addresses that have been given permission to interact with the safe in various capacities, and retrieving their information is crucial for managing these permissions.

### Steps to Retrieve Delegate Information

1. **Define the API Route for Retrieving Delegates:**

   Specify the API route to fetch delegate information for the safe. Include the safe's address as a query parameter in the route.

   ```typescript
   const getDelegateApiRoute = `/v1/delegates/?safe=${testSafeOnSepolia}`;
   ```

2. **Retrieve Delegate Information Using `fetchLegacy`:**

   Utilize the `fetchLegacy` function to simplify the dSafe interaction. Provide 'GET' as the method and include the delegate API route along with the payload and chain ID.

   ```typescript
   const response = await dsafe.fetchLegacy('GET', getDelegateApiRoute, payload, chainId);
   ```

3. **Process and Utilize the Retrieved Delegate Information:**

   With the delegate information fetched, you can now process or display this information as needed. For example, you may list the delegates and their permissions associated with the safe.

   ```typescript
   console.log({ response: response.data.results });
   ```

### Notes

- Replace `testSafeOnSepolia` and `chainId` with the actual safe address and blockchain network identifier.
- The use of `fetchLegacy` for 'GET' requests streamlines interactions with the dSafe API, making it easier to retrieve specific details like delegate information.
- Direct API calls are shown for completeness and to offer an alternative method of fetching data. However, the `fetchLegacy` function is recommended for its integration with the dSafe SDK and simplified handling.
