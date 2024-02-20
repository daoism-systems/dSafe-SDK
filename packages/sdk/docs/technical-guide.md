# @daoism_systems/dsafe-sdk Documentation

## Introduction

The `@daoism_systems/dsafe-sdk` is a powerful JavaScript SDK designed to facilitate seamless interactions with decentralized storage solutions, leveraging Ceramic network capabilities. This SDK enables developers to easily integrate decentralized data management features into their applications, supporting a wide range of operations from basic data storage and retrieval to complex transaction handling on various blockchain networks.

Incorporating instructions for installing the `@daoism_systems/dsafe-sdk` using yarn and pnpm alongside npm will make the documentation more comprehensive and accessible to a broader range of developers. Here's how you can update the installation section to include these additional package managers:

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
```

This initializes the `DSafe` object with the specified blockchain network and Ceramic node, making it ready for use in your application.

# Using `fetchLegacy`

## Overview

The `fetchLegacy` function is an essential method in the `@daoism_systems/dsafe-sdk`, designed to streamline interactions with blockchain networks and data. This function abstracts complex HTTP request processes, providing a simplified way to communicate with various API routes not directly implemented in the SDK.

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

### Queries

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

### Mutations
