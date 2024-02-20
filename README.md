# dSafe SDK

The dSafe SDK is a software development kit designed to enable dApp developers to interact with Safe(core) smart contracts, bypassing the SafeTransaction API and collecting off-chain transaction signatures in ComposeDB, a decentralized database. It allows for the decentralization of Safe(core) transaction data collection and storage.

Instead of relying on the existing SafeTransaction API, Django server, and PostgreSQL database, dSafe offers direct frontend integration with ComposeDB, a distributed database built on the Ceramic network.

## dSafe Components

Decentralization
- Bypasses the Django server in favor of direct frontend integration.
- Replaces PostgreSQL with Ceramic ComposeDB for distributed data storage, preventing single points of failure.

Ceramic ComposeDB Integration
- Utilizes a distributed database built on Ceramic network.
- Offers decentralized data management without centralized control.

Predefined Schema and Composites
- Schema and composites are predefined to match existing SQL table structures from the SafeTransaction API.
- Developers do not need to configure schemas or composites, simplifying integration.

Key Functionalities
SDK Integration
- Simplifies interactions with Ceramic ComposeDB.
- Directly read and write data to ComposeDB without complex configurations.

FetchLegacy Function
- Mimics browser's fetch function for ease of use.
- Developers can switch from SafeTransaction API to dSafe by changing API calls to FetchLegacy with minimal adjustments.
- Automatically includes fallback and synchronization mechanisms.

Automatic Fallback and Synchronization
- In case of errors or Ceramic issues, dSafe automatically falls back to SafeTransaction API to ensure data availability.
- Synchronization with SafeTransaction API post-successful operations on dSafe to maintain data consistency across decentralized and centralized stores.
- Both processes are fully automated within FetchLegacy, requiring no manual setup from developers.


## Installation

The `@daoism_systems/dsafe-sdk` can be installed in your project using `npm`, `yarn`, or `pnpm`. Choose the package manager that is most compatible with your workflow. Below are the commands for each package manager:

### Using npm

Run the following command in your project's root directory to install the SDK with npm:

```
npm install @daoism_systems/dsafe-sdk

```

### Using yarn

If you prefer yarn, use the following command to add the SDK to your project:

```
yarn add @daoism_systems/dsafe-sdk

```

### Using pnpm

For projects that use pnpm, you can install the SDK with:

```
pnpm add @daoism_systems/dsafe-sdk
```


## Initializing the SDK

Before you can utilize any functionality provided by `@daoism_systems/dsafe-sdk`, you need to initialize the SDK with appropriate configurations.

### Importing the DSafe Class

First, import the `DSafe` class from the package:

```
import DSafe from '@daoism_systems/dsafe-sdk';
```

If you're using CommonJS modules, you can require the SDK as follows:
```
const DSafe = require('@daoism_systems/dsafe-sdk').default;
```

### Creating an instance

To create an instance of the `DSafe` class, you need two pieces of information: the `chainId` and the `ceramicNodeNetwork` URL.

- `chainId`: This is the CAIP ID of the network you wish to interact with. The CAIP (Chain Agnostic Improvement Proposal) ID provides a standardized way to identify blockchain networks.

- `ceramicNodeNetwork`: The URL of the Ceramic node you intend to use for decentralized data storage and management.


Example initialization:

```
const chainId = 'eip155:1'; // Example CAIP ID for Ethereum Mainnet
const ceramicNodeNetwork = 'https://your-ceramic-node.com';

const dsafe = new DSafe(chainId, ceramicNodeNetwork);

```

This initializes the DSafe object with the specified blockchain network and Ceramic node, making it ready for use in your application.


For more info please refer to:

[Technical Specification Document](https://mirror.xyz/0013700.eth/89eXlnvtFN7r4J1OzmP0sYx7koJOeXacpR9OqkGV5Wk)
[Technical Guide]([https://mirror.xyz/0013700.eth/89eXlnvtFN7r4J1OzmP0sYx7koJOeXacpR9OqkGV5Wk](https://github.com/daoism-systems/dSafe-SDK/blob/main/packages/sdk/docs/technical-guide.md)https://github.com/daoism-systems/dSafe-SDK/blob/main/packages/sdk/docs/technical-guide.md)

