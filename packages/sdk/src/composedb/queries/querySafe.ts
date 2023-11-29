import { ComposeClient } from '@composedb/client'

const CHECK_SAFE_EXISTS_QUERY = (safeAddress: string) => `
query GetSafe {
  safeIndex(filters: {where: {safeAddress: {equalTo: "${safeAddress}"}}}) {
      edges {
          node {
              safeAddress
          }
      }
  }
}
`

// Using the query in a component
export const checkSafeExists = async (safeAddress: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(CHECK_SAFE_EXISTS_QUERY(safeAddress))
  if (executionResult && executionResult.data !== undefined && executionResult.data !== null) {
    return executionResult.data.safeIndex !== null
  }
}
