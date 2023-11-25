// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    Safe: {
      id: 'kjzl6hvfrbw6ca6rv5xdhwuwv2hy7mpq339ifjkp2j3t1fl4lfge59t3xn8rmw1',
      accountRelation: { type: 'list' },
    },
    Token: {
      id: 'kjzl6hvfrbw6c5yz6vtl67b9j4b5oyg187r8bswnk2q394fu8qtwvxz9ov8svde',
      accountRelation: { type: 'list' },
    },
    Signer: {
      id: 'kjzl6hvfrbw6c5uvo1julg68sjxs0jnctqzyat15u39rw6o495jzoxg3b3evlgb',
      accountRelation: { type: 'list' },
    },
    SignerSafeRelationship: {
      id: 'kjzl6hvfrbw6c6tstm5h17wtoo9aagcxtquj23x90w62a64o9c1wfyzbf9q76c7',
      accountRelation: { type: 'list' },
    },
    Delegate: {
      id: 'kjzl6hvfrbw6c7myls4zc5msepn0wrqatawzojzr26k60dju7w1v2lsx2m20iag',
      accountRelation: { type: 'list' },
    },
    Transaction: {
      id: 'kjzl6hvfrbw6caqs01qklg13hckze0xuvqkmr269ia8w1yl3cddmt9dq219fafl',
      accountRelation: { type: 'list' },
    },
    Confirmation: {
      id: 'kjzl6hvfrbw6cae19uig6hgzo8750yegeailey7rnvcjey22p8qqwpmskjth0nu',
      accountRelation: { type: 'list' },
    },
  },
  objects: {
    Safe: {
      network: { type: 'chainid', required: true, indexed: true },
      singleton: { type: 'string', required: true },
      threshold: { type: 'integer', required: true },
      safeAddress: { type: 'string', required: true, indexed: true },
      totalTransactions: { type: 'integer', required: true },
      nativeTokenBalance: { type: 'string', required: true },
      deployedBlockNumber: { type: 'integer', required: true, indexed: true },
    },
    Token: {
      name: { type: 'string', required: true, indexed: true },
      safeId: { type: 'streamid', required: true },
      symbol: { type: 'string', required: true, indexed: true },
      balance: { type: 'string', required: true },
      logoUri: { type: 'uri', required: true },
      network: { type: 'chainid', required: true, indexed: true },
      decimals: { type: 'integer', required: true },
      tokenAddress: { type: 'string', required: true, indexed: true },
      safe: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6ca6rv5xdhwuwv2hy7mpq339ifjkp2j3t1fl4lfge59t3xn8rmw1',
          property: 'safeId',
        },
      },
    },
    Signer: { signer: { type: 'string', required: true, indexed: true } },
    SignerSafeRelationship: {
      safeID: { type: 'streamid', required: true, indexed: true },
      network: { type: 'chainid', required: true, indexed: true },
      signerID: { type: 'streamid', required: true, indexed: true },
      blockWhenAdded: { type: 'integer', required: true },
      safe: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6ca6rv5xdhwuwv2hy7mpq339ifjkp2j3t1fl4lfge59t3xn8rmw1',
          property: 'safeID',
        },
      },
      signer: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6c5uvo1julg68sjxs0jnctqzyat15u39rw6o495jzoxg3b3evlgb',
          property: 'signerID',
        },
      },
    },
    Delegate: {
      safeID: { type: 'streamid', required: true, indexed: true },
      network: { type: 'chainid', required: true, indexed: true },
      delegate: { type: 'string', required: true, indexed: true },
      delegatorID: { type: 'streamid', required: true, indexed: true },
      safe: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6ca6rv5xdhwuwv2hy7mpq339ifjkp2j3t1fl4lfge59t3xn8rmw1',
          property: 'safeID',
        },
      },
      delegator: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6c5uvo1julg68sjxs0jnctqzyat15u39rw6o495jzoxg3b3evlgb',
          property: 'delegatorID',
        },
      },
    },
    Transaction: {
      to: { type: 'string', required: true, indexed: true },
      gas: { type: 'integer', required: true },
      data: { type: 'string', required: true },
      nonce: { type: 'integer', required: true, indexed: true },
      origin: { type: 'string', required: true },
      safeID: { type: 'streamid', required: true, indexed: true },
      sender: { type: 'string', required: true },
      network: { type: 'chainid', required: true, indexed: true },
      trxHash: { type: 'string', required: false },
      executor: { type: 'string', required: false, indexed: true },
      gasPrice: { type: 'integer', required: true },
      gasToken: { type: 'string', required: true },
      operation: { type: 'string', required: true },
      signature: { type: 'string', required: true },
      baseGasPrice: { type: 'integer', required: true },
      refundReceiver: { type: 'string', required: true },
      safeTransactionHash: { type: 'string', required: true, indexed: true },
      safe: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6ca6rv5xdhwuwv2hy7mpq339ifjkp2j3t1fl4lfge59t3xn8rmw1',
          property: 'safeID',
        },
      },
    },
    Confirmation: {
      signerID: { type: 'streamid', required: true, indexed: true },
      signature: { type: 'string', required: true },
      transactionId: { type: 'streamid', required: true, indexed: true },
      signer: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6c5uvo1julg68sjxs0jnctqzyat15u39rw6o495jzoxg3b3evlgb',
          property: 'signerID',
        },
      },
      safeTransactionHash: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: '$kjzl6hvfrbw6caqs01qklg13hckze0xuvqkmr269ia8w1yl3cddmt9dq219fafl',
          property: 'transactionId',
        },
      },
    },
  },
  enums: {},
  accountData: {
    safeList: { type: 'connection', name: 'Safe' },
    tokenList: { type: 'connection', name: 'Token' },
    signerList: { type: 'connection', name: 'Signer' },
    signerSafeRelationshipList: { type: 'connection', name: 'SignerSafeRelationship' },
    delegateList: { type: 'connection', name: 'Delegate' },
    transactionList: { type: 'connection', name: 'Transaction' },
    confirmationList: { type: 'connection', name: 'Confirmation' },
  },
}
