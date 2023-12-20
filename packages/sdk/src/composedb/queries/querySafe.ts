import { type ComposeClient } from '@composedb/client'

const CHECK_SAFE_EXISTS_QUERY = (safeAddress: string) => `
query GetSafe {
  safeIndex(filters: {where: {safeAddress: {equalTo: "${safeAddress}"}}}, first: 1) {
      edges {
          node {
              safeAddress
              id
          }
      }
  }
}
`

const GET_SAFE_QUERY = (safeAddress: string) => `
query GetSafe {
  safeIndex(filters: {where: {safeAddress: {equalTo: "${safeAddress}"}}}, first: 1) {
    edges {
        node {
          safeAddress
          id
          network
          totalTransactions
          singleton
          deployedBlockNumber
          nonce
          fallbackHandler
          guard
          version
          nativeTokenBalance
          threshold
        }
    }
  }
}
`

// Using the query in a component
export const checkSafeExists = async (safeAddress: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(CHECK_SAFE_EXISTS_QUERY(safeAddress))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const safeIndex: any = executionResult.data.safeIndex
    if (safeIndex.edges.length !== 0) {
      console.log('safe exists')
      const returnData = { exists: true, id: safeIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}

// get safe
export const getSafe = async (safeAddress: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(GET_SAFE_QUERY(safeAddress))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const safeIndex: any = executionResult.data.safeIndex
    if (safeIndex.edges.length !== 0) {
      console.log('safe exists')
      const returnData = { exists: true, safeData: safeIndex.edges[0].node }
      return returnData
    } else {
      return { exists: false, safeData: undefined }
    }
  }
  return { exists: false, safeData: undefined }
}
