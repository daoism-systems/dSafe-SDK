import { ComposeClient } from '@composedb/client'
import RouteHandler from '../types/ROUTE_HANDLER.type.js'
import { UPDATE_CONFIRMATION_PAYLOAD } from '../types/UPDATE_CONFIRMATION_PAYLOAD.type.js'
import { checkTransactionBasedOnSafeTxHash } from '../composedb/queries/queryTransaction.js'
import { composeConfirmation } from '../composedb/mutations/mutateConfirmation.js'
import { checkConfirmationExists } from '../composedb/queries/queryConfirmation.js'
import { checkSignerExists } from '../composedb/queries/querySigner.js'
import { composeSigner } from '../composedb/mutations/mutateSigner.js'
import { API_ENDPOINT } from '../config/constants.js'
import axios from 'axios'

const handleUpdateConfirmations: RouteHandler<UPDATE_CONFIRMATION_PAYLOAD> = async (
  composeClient: ComposeClient,
  payload?: UPDATE_CONFIRMATION_PAYLOAD,
  network?: string,
) => {
  console.log('Payload.Safe_tx_hash', payload?.safe_tx_hash)
  // fetch safe_tx_hash
  const transactionExists = await checkTransactionBasedOnSafeTxHash(
    payload?.safe_tx_hash as string,
    composeClient,
  )
  console.log(transactionExists)
  if (!transactionExists.exists) {
    throw Error("Transaction doesn't exist")
  }
  // todo: use transaction stream ID to fetch safe instead of taking it from user
  let response: any
  try {
    response = await axios.get(`${API_ENDPOINT(network as string)}/v1/safes/${payload?.safe}`)
  } catch (e) {
    console.log(e)
  }
  console.log(response)
  const data = response.data
  // add confirmation to the transaction
  const signerExist = await checkSignerExists(payload?.sender as string, composeClient)
  let signerStreamId: string | undefined = signerExist.id
  if (!signerExist.exists && data.owners.includes(payload?.sender)) {
    console.log("Sender is signer but isn't Signer entity isn't created for the sender")
    const input = {
      content: {
        signer: payload?.sender,
      },
    }
    await composeSigner(input, composeClient)
    const signerCreated = await checkSignerExists(payload?.sender as string, composeClient)
    console.log(`Signer Created: ${signerCreated.exists}`)
    signerStreamId = signerCreated.id
  }
  const confirmationInput = {
    content: {
      signerID: signerExist.id,
      transactionId: transactionExists.id,
      signature: payload?.signature,
    },
  }
  await composeConfirmation(confirmationInput, composeClient)
  const confirmationCreated = await checkConfirmationExists(
    confirmationInput.content.signerID as string,
    confirmationInput.content.transactionId,
    composeClient,
  )
  console.log(`Confirmation Created: ${confirmationCreated.exists}`)
  return true
}

export default handleUpdateConfirmations
