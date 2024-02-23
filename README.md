<div style="text-align: center;">
    <img src="https://images.mirror-media.xyz/publication-images/qPZwL22UQjOxK5kO2R3TX.png?height=832&width=1664" width="800" height="400" alt="Header Image">
</div>

# dSafe SDK

The dSafe SDK is a software development kit designed to enable dApp developers to interact with Safe(core) smart contracts, bypassing the Safe Transaction API and collecting off-chain transaction signatures in ComposeDB, a decentralized database. It allows for the decentralization of Safe(core) transaction data collection and storage.

Instead of relying on the existing Safe Transaction API, Django server, and PostgreSQL database, dSafe offers direct frontend integration with ComposeDB, a distributed database built on the Ceramic network.

## Resources

[dSafe Genesis Article](https://mirror.xyz/0013700.eth/HAxUoydAAvcEnygRvGsqecAhC1XcfcQlAy6x_htY3ZQ)

[Grant Proposal](https://app.charmverse.io/safe-grants-program/page-5195256681472322)

[Technical Specification](https://mirror.xyz/0013700.eth/89eXlnvtFN7r4J1OzmP0sYx7koJOeXacpR9OqkGV5Wk)

[Technical Guide](https://github.com/daoism-systems/dSafe-SDK/blob/main/packages/sdk/docs/technical-guide.md)

[Demo dApp](https://github.com/daoism-systems/dSafe-frontend)


## dSafe Components

### Decentralization
- Bypasses the Django server in favor of direct frontend integration.
- Replaces PostgreSQL with Ceramic ComposeDB for distributed data storage, preventing single points of failure.

### ComposeDB Integration
- Utilizes a distributed database built on Ceramic network.
- Offers decentralized data management without centralized control.

### Predefined Schema and Composites
- Schema and composites are predefined to match existing SQL table structures from the SafeTransaction API.
- Developers do not need to configure schemas or composites, simplifying integration.

## Key Functionalities

### SDK Integration
- Simplifies interactions with Ceramic ComposeDB.
- Directly read and write data to ComposeDB without complex configurations.

### FetchLegacy Function
- Mimics browser's fetch function for ease of use.
- Developers can switch from SafeTransaction API to dSafe by changing API calls to FetchLegacy with minimal adjustments.
- Automatically includes fallback and synchronization mechanisms.

### Automatic Fallback and Synchronization
- In case of errors or Ceramic issues, dSafe automatically falls back to SafeTransaction API to ensure data availability.
- Synchronization with SafeTransaction API post-successful operations on dSafe to maintain data consistency across decentralized and centralized stores.
- Both processes are fully automated within FetchLegacy, requiring no manual setup from developers.


## Structure

This repository is organized as a monorepo, encompassing the following key packages:

- **Schema**: Details the deployment of composites on Ceramic and guidelines for running a Ceramic Node.
- **SDK**: Acts as the intermediary layer enabling interaction with the dSafe database on ComposeDB.


### Directories

- **src**: `./packages/sdk/src/` - Contains the core logic, including the dSafe class and utility functions.
- **test**: `./packages/sdk/test` - Houses test scripts for the SDK. Running tests locally necessitates a local Ceramic node.
- **coverage**: `./packages/sdk/coverage` - Provides coverage reports for the SDK.


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

## Usage

For detailed instructions on utilizing the SDK and incorporating it into your projects, we highly recommend visiting the [Technical Guide](https://github.com/daoism-systems/dSafe-SDK/blob/main/packages/sdk/docs/technical-guide.md). This guide provides detailed steps and examples to facilitate a seamless integration process.


## Contact Us

We welcome collaborators and community members to join our discussions and contribute to our projects. If you're interested in getting involved or have any questions, please join our Telegram group. Your insights and contributions are invaluable to us.

[Join our Telegram Group](https://t.me/+EBSNTw1oFipjZTQ1)






