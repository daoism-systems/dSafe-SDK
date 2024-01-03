import { type ComposeClient } from '@composedb/client'

const CHECK_CONFIRMATION_EXIST = (signerId: string, transactionId: string): string => `
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

const GET_CONFIRMATIONS = (safeTxHash: string, networkId: string): string => `
query GetConfirmations {
transactionIndex(
  first: 1
  filters: {where: {network: {equalTo: "${networkId}"}, safeTransactionHash: {equalTo: "${safeTxHash}"}}}
) {
  edges {
    node {
      id
      safeTransactionHash
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

// Using the query in a component
export const checkConfirmationExists = async (
  signerId: string,
  transactionId: string,
  composeClient: ComposeClient,
): Promise<any> => {
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

export const getTransactionConfirmations = async (
  safeTxHash: string,
  networkId: string,
  composeClient: ComposeClient,
): Promise<any> => {
  console.log(safeTxHash, networkId)
  const executionResult = await composeClient.executeQuery(GET_CONFIRMATIONS(safeTxHash, networkId))
  console.log(executionResult)
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const transactionIndex: any = executionResult.data.transactionIndex
    if (transactionIndex.edges.length !== 0) {
      console.log('Transaction exists')
      const returnData = { exists: true, confirmationData: transactionIndex.edges[0].node }
      return returnData
    } else {
      console.log('Transaction doesn\'t exist')
      return { exists: false, confirmationData: undefined }
    }
  }
  console.log('Error while fetching data from ceramic')
  return { exists: false, confirmationData: undefined }
}
