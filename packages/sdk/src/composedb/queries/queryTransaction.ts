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
