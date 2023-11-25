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

## Docs:

1. [Technical Specification Document](https://docs.google.com/document/d/1zqZB8sIdhLuZWoqa2mWrcNSx7H7trtcxRHwgT_UiVA4/edit?usp=sharing)
2. [Grant Proposal](https://app.charmverse.io/safe-grants-program/page-5195256681472322)
