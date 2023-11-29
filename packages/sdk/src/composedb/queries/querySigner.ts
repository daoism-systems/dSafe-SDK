import { ComposeClient } from '@composedb/client'

const CHECK_SIGNER_EXISTS_QUERY = (signer: string) => `
query GetSigner {
    signerIndex(filters: {where: {signer: {equalTo: ${signer}}}}) {
      edges {
        node {
          signer
        }
      }
    }
  }
`

// Using the query in a component
export const checkSignerExists = async (signer: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(CHECK_SIGNER_EXISTS_QUERY(signer))
  if (executionResult && executionResult.data !== undefined && executionResult.data !== null) {
    return executionResult.data.signerIndex !== null
  }
}
