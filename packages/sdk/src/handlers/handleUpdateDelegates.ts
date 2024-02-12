import { type ComposeClient } from '@composedb/client'
import type RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSigner } from '../composedb/mutations/mutateSigner.js'
import { type UpdateDelegatePayload } from '../types/CREATE_DELEGATE.type.js'
import { composeDelegate } from '../composedb/mutations/mutateDelegate.js'
import { checkDelegateExists } from '../composedb/queries/queryDelegates.js'
import { checkSafeExists, getSafe } from '../composedb/queries/querySafe.js'
// POST /v1/delegates/

const handleUpdateDelegates: RouteHandler<UpdateDelegatePayload> = async (
  composeClient: ComposeClient,
  payload?: UpdateDelegatePayload,
  network?: string,
) => {
  const apiData = payload?.apiData

  console.log('Payload.delegate', apiData?.delegate)
  // todo: use transaction stream ID to fetch safe instead of taking it from user
  let response: any
  try {
    // response = await axios.get(`${API_ENDPOINT(network as string)}/v1/safes/${apiData?.safe}`)
    response = await getSafe(apiData?.safe, composeClient)
  } catch (e) {
    console.log(e)
  }
  console.log({ response })
  const data = response.data
  // check if safe exists
  const safeExist = await checkSafeExists(apiData?.safe as string, composeClient)
  const safeStreamId: string | undefined = safeExist.id
  if (!safeExist.exists) {
    throw Error('Safe does not exist')
  }
  // add delegate to the transaction
  const signerExist = await checkSignerExists(apiData?.delegator as string, composeClient)
  let signerStreamId: string | undefined = signerExist.id
  if (!signerExist.exists && data.owners.includes(apiData?.delegator) === true) {
    console.log('Sender is signer but is not Signer entity is not created for the sender')
    const input = {
      content: {
        signer: apiData?.delegator,
      },
    }
    await composeSigner(input, composeClient)
    const signerCreated = await checkSignerExists(apiData?.delegator as string, composeClient)
    console.log(`Signer Created: ${signerCreated.exists}`)
    signerStreamId = signerCreated.id
  }
  const delegateInput = {
    content: {
      delegate: apiData?.delegate,
      delegatorID: signerStreamId,
      network: 'eip155:1',
      safeID: safeStreamId,
    },
  }
  console.log({ delegateInput })

  const statusCode = await composeDelegate(delegateInput, composeClient)
  const confirmationCreated = await checkDelegateExists(apiData?.delegate as string, composeClient)
  if (confirmationCreated.exists) {
    console.log(`Delegate added: ${confirmationCreated.exists}`)
    return { status: true, data: statusCode }
  } else {
    return { status: false, data: statusCode }
  }
}

export default handleUpdateDelegates
