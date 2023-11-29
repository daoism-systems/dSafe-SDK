import { ComposeClient } from '@composedb/client'

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

// Using the query in a component
export const checkSafeExists = async (safeAddress: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(CHECK_SAFE_EXISTS_QUERY(safeAddress))
  if (executionResult && executionResult.data !== undefined && executionResult.data !== null) {
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
