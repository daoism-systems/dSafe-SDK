import { type ComposeClient } from '@composedb/client'

const CHECK_TRANSACTION_EXIST = (nonce: number, safeId: string) => `
query CheckTransactionExist {
    transactionIndex(
        first: 1
        filters: {where: {nonce: {equalTo: ${nonce}}, safeID: {equalTo: "${safeId}"}}}
      ) {
        edges {
          node {
            id
            nonce
          }
        }
      }
}
`

const CHECK_TRANSACTION_EXIST_WITH_SAFE_TX_HASH = (safeTxHash: string) => `
query CheckTransactionExist {
    transactionIndex(
        first: 1
        filters: {where: {safeTransactionHash: {equalTo: "${safeTxHash}"}}}
      ) {
        edges {
          node {
            id
            safeTransactionHash
          }
        }
      }
}
`

const GET_TRANSACTIONS_OF_SAFE = (safeId: string, networkId: string) => `
transactionIndex(
  first: 10
  filters: {where: {safeID: {equalTo: "${safeId}"}, network: {equalTo: "${networkId}"}}}
) {
  edges {
    node {
      safeID
      baseGas
      data
      executor
      gasPrice
      gasToken
      id
      network
      nonce
      operation
      origin
      refundReceiver
      safeTransactionHash
      safeTxGas
      sender
      signature
      to
      trxHash
      value
      confirmations(first: 10) {
        edges {
          node {
            signature
            signer {
              signer
            }
          }
        }
      }
    }
  }
}
}
`

// using the query in a component
export const checkTransactionBasedOnSafeTxHash = async (
  safeTxHash: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(
    CHECK_TRANSACTION_EXIST_WITH_SAFE_TX_HASH(safeTxHash),
  )
  console.log('Execution result', executionResult)
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const transactionIndex: any = executionResult.data.transactionIndex
    if (transactionIndex.edges.length !== 0) {
      console.log('Transaction exists')
      const returnData = { exists: true, id: transactionIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}

// Using the query in a component
export const checkTransactionExists = async (
  nonce: number,
  safeId: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(CHECK_TRANSACTION_EXIST(nonce, safeId))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const transactionIndex: any = executionResult.data.transactionIndex
    if (transactionIndex.edges.length !== 0) {
      console.log('Transaction exists')
      const returnData = { exists: true, id: transactionIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}

export const getAllTransactions = async (
  safeId: string,
  networkId: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(
    GET_TRANSACTIONS_OF_SAFE(safeId, networkId),
  )
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const transactionIndex: any = executionResult.data.transactionIndex
    if (transactionIndex.edges.length !== 0) {
      console.log('Transaction exists')
      const returnData = { exists: true, transactionData: transactionIndex.edges[0].node }
      return returnData
    } else {
      return { exists: false, transactionData: undefined }
    }
  }
  return { exists: false, transactionData: undefined }
}
