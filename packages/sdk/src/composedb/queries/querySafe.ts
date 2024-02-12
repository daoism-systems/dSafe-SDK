import { type ComposeClient } from '@composedb/client'

const CHECK_SAFE_EXISTS_QUERY = (safeAddress: string): string => `
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

const GET_SAFE_QUERY = (safeAddress: string): string => `
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
          signers(first: 40) {
            edges {
              node {
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

// Using the query in a component
export const checkSafeExists = async (
  safeAddress: string,
  composeClient: ComposeClient,
): Promise<{ exists: boolean; id?: string }> => {
  const executionResult = await composeClient.executeQuery(CHECK_SAFE_EXISTS_QUERY(safeAddress))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const safeIndex: any = executionResult.data.safeIndex
    if (safeIndex?.edges?.length !== 0) {
      console.log('safe exists')
      const returnData = { exists: true, id: safeIndex?.edges?.[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}

// get safe
export const getSafe = async (
  safeAddress: string,
  composeClient: ComposeClient,
): Promise<{ exists: boolean; safeData: any }> => {
  const executionResult = await composeClient.executeQuery(GET_SAFE_QUERY(safeAddress))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const safeIndex: any = executionResult.data.safeIndex
    if (safeIndex.edges.length !== 0) {
      console.log('safe exists')
      const safeData = {
        address: safeIndex.edges[0].node.safeAddress,
        nonce: safeIndex.edges[0].node.nonce,
        threshold: safeIndex.edges[0].node.threshold,
        owners: safeIndex.edges[0].node.signers.edges.map((item: any) => item.node.signer.signer),
        masterCopy: safeIndex.edges[0].node.singleton,
        modules: [],
        fallbackHandler: safeIndex.edges[0].node.fallbackHandler,
        guard: safeIndex.edges[0].node.guard,
        version: safeIndex.edges[0].node.version,
      }
      const returnData = { exists: true, safeData }
      return returnData
    } else {
      return { exists: false, safeData: undefined }
    }
  }
  return { exists: false, safeData: undefined }
}
