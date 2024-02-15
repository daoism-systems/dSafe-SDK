import { type ComposeClient } from '@composedb/client'
import { type DelegateData } from '../../types/DELEGATE_DATA.type.js'

const CHECK_DELEGATE_EXISTS = (delegate: string): string => `
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

const GET_ALL_DELEGATES_QUERY = (safeId: string, network: string): string => `
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

export const checkDelegateExists = async (
  delegate: string,
  composeClient: ComposeClient,
): Promise<{ exists: boolean; id?: string }> => {
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
): Promise<any> => {
  const executionResult = await composeClient.executeQuery(GET_ALL_DELEGATES_QUERY(safeId, network))
  if (executionResult?.data !== undefined && executionResult.data !== null) {
    const delegateIndex: any = executionResult.data.delegateIndex
    if (delegateIndex?.edges?.length !== 0) {
      console.log('safe exists')
      const delegateData: DelegateData[] = delegateIndex?.edges?.map((delegate: any) => {
        return {
          safe: delegate.node.safe.safeAddress,
          delegate: delegate.node.delegate,
          delegator: delegate.node.delegator.signer,
        }
      })
      console.log({ delegateData, delegateIndex: delegateIndex.edges })

      const returnData = { exists: true, delegateData }
      return returnData
    } else {
      return { exists: false, delegateData: [] }
    }
  }
  return { exists: false, delegateData: undefined }
}
