import { type ComposeClient } from '@composedb/client'

const CHECK_SIGNER_EXISTS_QUERY = (signer: string): string => `
query GetSigner {
    signerIndex(filters: {where: {signer: {equalTo: "${signer}"}}}, first: 1) {
      edges {
        node {
          signer
          id
        }
      }
    }
  }
`

// Using the query in a component
export const checkSignerExists = async (signer: string, composeClient: ComposeClient): Promise<any> => {
  const executionResult = await composeClient.executeQuery(CHECK_SIGNER_EXISTS_QUERY(signer))
  console.log(executionResult)
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const signerIndex: any = executionResult.data.signerIndex
    if (signerIndex.edges.length !== 0) {
      console.log('signer exists')
      const returnData = { exists: true, id: signerIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}
