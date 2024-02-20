# dSafe Registry

## Folder Structure
- `packages/schema` - Schema for entities created on ComposeDB and scripts to deploy entities, generate definitions and runa GraphQL server.
- `packages/sdk` - Core SDK that is published on npmjs and interacts with Ceramic/ComposeDb.

## How to use it
### Run a local ceramic client

```
ceramic daemon
```

### Deploy schema
Find commands in [Schema's Readme file](./packages/schema/README.md)

### Move Definitions to SDK
Find commands in [Schema's Readme file](./packages/schema/README.md)

### Run GraphQL server
Find commands in [Schema's Readme file](./packages/schema/README.md)

### Test SDK
```
yarn sdk run test
```

## Publish SDK
### Test, Build and Publish
```
yarn sdk run publish
```