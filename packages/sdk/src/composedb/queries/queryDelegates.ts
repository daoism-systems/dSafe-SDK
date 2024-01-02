import { ComposeClient } from '@composedb/client'
import { DelegateData } from '../../types/DELEGATE_DATA.type.js'

const CHECK_DELEGATE_EXISTS = (delegate: string) => `
query CheckDelegateExist {
    delegateIndex(first: 1, filters: {where: {delegate: {equalTo: "${delegate}"}}}) {
      edges {
        node {
          delegate
          id
          network
          safeID
        }
      }
    }
  }
`

const GET_ALL_DELEGATES_QUERY = (safeId: string, network: string) => `
query GetDelegate {
    delegateIndex(
      first: 10
      filters: {where: {safeID: {equalTo: "${safeId}"}, network: {equalTo: "${network}"}}}
    ) {
      edges {
        node {
            delegate
            id
            network
            safeID
            delegator {
              signer
            }
            safe {
              safeAddress
            }
        }
      }
    }
  }
`

export const checkDelegateExists = async (delegate: string, composeClient: ComposeClient) => {
  const executionResult = await composeClient.executeQuery(CHECK_DELEGATE_EXISTS(delegate))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const delegateIndex: any = executionResult.data.delegateIndex
    if (delegateIndex.edges.length !== 0) {
      console.log('delegate exists')
      const returnData = { exists: true, id: delegateIndex.edges[0].node.id }
      return returnData
    } else {
      return { exists: false, id: undefined }
    }
  }
  return { exists: false, id: undefined }
}

// get delegate
export const getDelegate = async (
  safeId: string,
  network: string,
  composeClient: ComposeClient,
) => {
  const executionResult = await composeClient.executeQuery(GET_ALL_DELEGATES_QUERY(safeId, network))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const delegateIndex: any = executionResult.data.delegateIndex
    console.log(delegateIndex)
    if (delegateIndex?.edges?.length !== 0) {
      console.log('safe exists')
      const delegateData: Array<DelegateData> = []
      delegateIndex.edges.forEach((i: number) =>
        delegateData.push({
          safe: delegateIndex.edges[i].node.safe.safeAddress,
          delegate: delegateIndex.edges[i].node.delegate,
          delegator: delegateIndex.edges[i].node.delegator.signer,
        }),
      )
      const returnData = { exists: true, delegateData: delegateData }
      return returnData
    } else {
      return { exists: false, delegateData: undefined }
    }
  }
  return { exists: false, delegateData: undefined }
}
