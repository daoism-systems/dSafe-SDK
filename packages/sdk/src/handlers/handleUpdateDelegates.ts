import { ComposeClient } from '@composedb/client'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { checkTransactionBasedOnSafeTxHash } from '../composedb/queries/queryTransaction.js'
import { composeConfirmation } from '../composedb/mutations/mutateConfirmation.js'
import { checkConfirmationExists } from '../composedb/queries/queryConfirmation.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSigner } from '../composedb/mutations/mutateSigner.js'
import { API_ENDPOINT } from '../config/constants.js'
import axios from 'axios'
import { UpdateDelegatePayload } from '../types/CREATE_DELEGATE.type.js'
import { composeDelegate } from '../composedb/mutations/mutateDelegate.js'
import { checkDelegateExists } from '../composedb/queries/queryDelegates.js'
import { checkSafeExists } from '../composedb/queries/querySafe.js'
// POST /v1/delegates/

const handleUpdateDelegates: RouteHandler<UpdateDelegatePayload> = async (
  composeClient: ComposeClient,
  payload?: UpdateDelegatePayload,
  network?: string,
) => {
  console.log('Payload.delegate', payload?.delegate)
  // todo: use transaction stream ID to fetch safe instead of taking it from user
  let response: any
  try {
    response = await axios.get(`${API_ENDPOINT(network as string)}/v1/safes/${payload?.safe}`)
  } catch (e) {
    console.log(e)
  }
  console.log(response)
  const data = response.data
  // check if safe exists
  const safeExist = await checkSafeExists(payload?.safe as string, composeClient)
  let safeStreamId: string | undefined = safeExist.id
  if (!safeExist.exists) {
    throw Error("Safe doesn't exist")
  }
  // add delegate to the transaction
  const signerExist = await checkSignerExists(payload?.delegator as string, composeClient)
  let signerStreamId: string | undefined = signerExist.id
  if (!signerExist.exists && data.owners.includes(payload?.delegator)) {
    console.log("Sender is signer but isn't Signer entity isn't created for the sender")
    const input = {
      content: {
        signer: payload?.delegator,
      },
    }
    await composeSigner(input, composeClient)
    const signerCreated = await checkSignerExists(payload?.delegator as string, composeClient)
    console.log(`Signer Created: ${signerCreated.exists}`)
    signerStreamId = signerCreated.id
  }
  const delegateInput = {
    content: {
      delegate: payload?.delegate,
      delegatorID: signerStreamId,
      network: network,
      safeID: safeStreamId,
    },
  }
  await composeDelegate(delegateInput, composeClient)
  const confirmationCreated = await checkDelegateExists(payload?.delegate as string, composeClient)
  console.log(`Delegate added: ${confirmationCreated.exists}`)
  return true
}

export default handleUpdateDelegates
