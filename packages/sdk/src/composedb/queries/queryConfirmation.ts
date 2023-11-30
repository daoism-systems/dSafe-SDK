import { type ComposeClient } from '@composedb/client'

const CHECK_CONFIRMATION_EXIST = (signerId: string, transactionId: string) => `
query CheckConfirmationExist {
    confirmationIndex(
        first: 1
        filters: {where: {signerID: {equalTo: "${signerId}"}, transactionId: {equalTo: "${transactionId}"}}}
      ) {
        edges {
          node {
            id
            signature
          }
        }
      }
}
`

// Using the query in a component
export const checkConfirmationExists = async (
  signerId: string,
  transactionId: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(
    CHECK_CONFIRMATION_EXIST(signerId, transactionId),
  )
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const confirmationIndex: any = executionResult.data.confirmationIndex
    if (confirmationIndex.edges.length !== 0) {
      console.log('Confirmation exists')
      const returnData = { exists: true, id: confirmationIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}
