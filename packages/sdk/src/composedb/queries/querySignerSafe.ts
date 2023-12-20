import { ComposeClient } from '@composedb/client'

const CHECK_SIGNER_SAFE_EXISTS = (
  signerStreamId: string,
  safeStreamId: string,
  networkId: string,
) => `
query CheckSignerSafeExists {
    signerSafeRelationshipIndex(
      first: 1
      filters: {where: {safeID: {equalTo: "${safeStreamId}"}, network: {equalTo: "${networkId}"}, signerID: {equalTo: "${signerStreamId}"}}}
    ) {
      edges {
        node {
          id
          signerID
          safeID
          network
        }
      }
    }
  }
`

export const checkSignerSafeExists = async (
  signerId: string,
  safeId: string,
  networkId: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(
    CHECK_SIGNER_SAFE_EXISTS(signerId, safeId, networkId),
  )
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const signerSafeRelationshipIndex: any = executionResult.data.signerSafeRelationshipIndex
    if (signerSafeRelationshipIndex.edges.length !== 0) {
      console.log('Confirmation exists')
      const returnData = { exists: true, id: signerSafeRelationshipIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}
