# DSafe-SDK

## Install

## Pre-requisites

1. NodeJS v16
2. [jq](https://jqlang.github.io/jq/download/)
3. postgresql

## Install Wheel

```
curl --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/ceramicstudio/wheel/main/wheel.sh | bash
```

## Using `yarn` or `npm`

```
// using yarn
yarn add @dsafe/sdk

// using npm
npm install @dsafe/sdk
```

## Testing Locally

Note: Ensure, the ceramic node is clean and have no previous deployment of composites.

1. [Install and Run Ceramic Node](https://developers.ceramic.network/docs/protocol/js-ceramic/guides/ceramic-nodes/running-locally)
```
// Install
npm install -g @ceramicnetwork/cli

// run
ceramic daemon // node starts at: http://localhost:7007
```

2. Deploy composites
```bash
yarn publish --environment [dev|staging|prod] --private-key [value] --ceramic-url [value]

// help
yarn publish --help
```

3. Run GraphQL server
```bash
yarn schema run start:graphql --ceramic-url <url> --path <file_path> --private-key <key> [--port <port_number>]

// help
yarn schema run start:graphql --help
```

4. Copy, create `.env` file from `.env.example` and set all the environment variables
```bash
PRIVATE_KEY=
```

5. Update following variables in [Secrets file](./test/secrets.ts) to add your safe
```
SAFE_ADDRESS= // set your safe address on sepolia
TEST_ACCOUNT = // set your wallet address // the address that is owned by private key set in envioronment
TEST_SAFE= // set your safe address on sepolia - Same as SAFE_ADDRESS
```

6. Update the trxInput.nonce in `secrets.ts` file.
```
trxInput.nonce = // latest unused nonce of your test safe on sepolia
```

7. Run test
```
yarn sdk run test
```

8. Coverage
```
yarn sdk run coverage
```

## Build Locally

### Clone

```
// clone using ssh
git clone git@github.com:daoism-systems/dSafe-SDK.git

// clone using https
git clone https://github.com/daoism-systems/dSafe-SDK.git
```

### Build

```
// using yarn
yarn install

// using npm
npm install
```

## Usage

### Instantiate dSafe class

```typescript
import DSafe from '@dsafe/sdk'

// instantiae
const dsafe = new DSafe()
```

### Interact with Safe Client Gateway for routes that are not implemented yet

```typescript
const apiRoute = '/about/'
const response: AxiosResponse = await dsafe.fetchLegacy('GET', apiRoute)

// ... do something with response
```

## Future Improvements:
1. Handle `get safe data` and `get all owners of safe` to sync with Safe API and save all the existing owners to the dSafe as well.
2. Use better coverage tool to ensure the test coverage isn't counting certain imports as well as exports as untested.

## Knwon Edge Cases:
1. If a safe have more than one owner and few owners haven't interacted with dSafe at all, then dSafe will not be able to ever know about those owners.
2. If a nonce have already been used, then tests will fail as Safe doesn't allow to use nonce which have already been used or nonce that is not latest nonce.

## Docs:

1. [Technical Specification Document](https://mirror.xyz/0013700.eth/89eXlnvtFN7r4J1OzmP0sYx7koJOeXacpR9OqkGV5Wk)
2. [Grant Proposal](https://app.charmverse.io/safe-grants-program/page-5195256681472322)
3. [Technical Documentation](./docs//technical-guide.md)
