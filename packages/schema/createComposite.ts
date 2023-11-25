import { readFileSync } from 'fs'
import dotenv from 'dotenv'
import { CeramicClient } from '@ceramicnetwork/http-client'
import {
  createComposite,
  readEncodedComposite,
  writeEncodedComposite,
  writeEncodedCompositeRuntime,
} from '@composedb/devtools-node'
import { Composite } from '@composedb/devtools'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'
import { fromString } from 'uint8arrays/from-string'
import ora from 'ora'
import {
  CERAMIC_NODE_URL,
  ID_VARIABLE_NAMES,
  OUT_JSON_DIR,
  OUT_JS_DIR,
  SCHEMA_FILES_DIRECTORIES,
} from './constants.js'
dotenv.config({ path: './.env' })

const spinner = ora()
CeramicClient
/**
 * @param {CeramicClient} ceramic - initialised ceramic client.
 * @return {Promise<void>} - return void when composite finishes deploying.
 */
async function writeComposite(ceramic: any): Promise<void> {
  const safeComposite = await createComposite(ceramic, SCHEMA_FILES_DIRECTORIES.SAFE)
  const safeCompositeModelId = safeComposite.modelIDs[0]

  const tokenSchema = readFileSync(SCHEMA_FILES_DIRECTORIES.TOKEN, {
    encoding: 'utf-8',
  }).replace(ID_VARIABLE_NAMES.SAFE_ID, safeCompositeModelId)

  const tokenComposite = await Composite.create({
    ceramic,
    schema: tokenSchema,
  })
  const tokenCompositeModelId = tokenComposite.modelIDs[1]

  const signerComposite = await createComposite(ceramic, SCHEMA_FILES_DIRECTORIES.SIGNER)
  const signerCompositeModelId = signerComposite.modelIDs[0]

  const signerSafeRelationshipSchema = readFileSync(
    SCHEMA_FILES_DIRECTORIES.SIGNER_SAFE_RELATIONSHIP,
    {
      encoding: 'utf-8',
    },
  )
    .replace(ID_VARIABLE_NAMES.SIGNER_ID, signerCompositeModelId)
    .replace(ID_VARIABLE_NAMES.SAFE_ID, safeCompositeModelId)

  const signerSafeRelationshipComposite = await Composite.create({
    ceramic,
    schema: signerSafeRelationshipSchema,
  })
  const signerSafeRelationshipModelId = signerSafeRelationshipComposite.modelIDs[2]

  const signerReferenceToSSRSchema = readFileSync(
    SCHEMA_FILES_DIRECTORIES.SIGNER_BACK_REFERENCE_SSR,
    {
      encoding: 'utf-8',
    },
  )
    .replace(ID_VARIABLE_NAMES.SIGNER_SAFE_RELATIONSHIP_ID, signerSafeRelationshipModelId)
    .replace(ID_VARIABLE_NAMES.SIGNER_ID, signerCompositeModelId)

  const signerReferenceToSSRComposite = await Composite.create({
    ceramic,
    schema: signerReferenceToSSRSchema,
  })

  const delegateSchema = readFileSync(SCHEMA_FILES_DIRECTORIES.DELEGATE, {
    encoding: 'utf-8',
  })
    .replace(ID_VARIABLE_NAMES.SIGNER_ID, signerCompositeModelId)
    .replace(ID_VARIABLE_NAMES.SAFE_ID, safeCompositeModelId)

  const delegateComposite = await Composite.create({
    ceramic,
    schema: delegateSchema,
  })
  const delegateCompositeModelId = delegateComposite.modelIDs[2]

  const transactionSchema = readFileSync(SCHEMA_FILES_DIRECTORIES.TRANSACTION, {
    encoding: 'utf-8',
  }).replace(ID_VARIABLE_NAMES.SAFE_ID, safeCompositeModelId)

  const transactionComposite = await Composite.create({
    ceramic,
    schema: transactionSchema,
  })
  const transactionCompositeModelId = transactionComposite.modelIDs[1]

  const confirmationSchema = readFileSync(SCHEMA_FILES_DIRECTORIES.CONFIRMATION, {
    encoding: 'utf-8',
  })
    .replace(ID_VARIABLE_NAMES.SIGNER_ID, signerCompositeModelId)
    .replace(ID_VARIABLE_NAMES.TRANSACTION_ID, transactionCompositeModelId)

  const confirmationComposite = await Composite.create({
    ceramic,
    schema: confirmationSchema,
  })
  const confirmationCompositeModelId = confirmationComposite.modelIDs[2]

  const transactionConfirmationSchema = readFileSync(
    SCHEMA_FILES_DIRECTORIES.TRANSACTION_CONFIRMATION,
    {
      encoding: 'utf-8',
    },
  )
    .replace(ID_VARIABLE_NAMES.CONFIRMATION_ID, confirmationCompositeModelId)
    .replace(ID_VARIABLE_NAMES.TRANSACTION_ID, transactionCompositeModelId)

  const transactionConfirmationComposite = await Composite.create({
    ceramic,
    schema: transactionConfirmationSchema,
  })

  const safeRelationshipSchema = readFileSync(SCHEMA_FILES_DIRECTORIES.SAFE_RELATIONS, {
    encoding: 'utf-8',
  })
    .replace(ID_VARIABLE_NAMES.TOKEN_ID, tokenCompositeModelId)
    .replace(ID_VARIABLE_NAMES.DELEGATE_ID, delegateCompositeModelId)
    .replace(ID_VARIABLE_NAMES.TRANSACTION_ID, transactionCompositeModelId)
    .replace(ID_VARIABLE_NAMES.SIGNER_SAFE_RELATIONSHIP_ID, signerSafeRelationshipModelId)
    .replace(ID_VARIABLE_NAMES.SAFE_ID, safeCompositeModelId)

  const safeRelationshipComposite = await Composite.create({
    ceramic,
    schema: safeRelationshipSchema,
  })

  const composite = Composite.from([
    safeComposite,
    tokenComposite,
    signerComposite,
    signerSafeRelationshipComposite,
    signerReferenceToSSRComposite,
    delegateComposite,
    transactionComposite,
    confirmationComposite,
    transactionConfirmationComposite,
    safeRelationshipComposite,
  ])

  await writeEncodedComposite(composite, OUT_JSON_DIR)
  spinner.info('creating composite for runtime usage')
  await writeEncodedCompositeRuntime(ceramic, OUT_JSON_DIR, OUT_JS_DIR)
  spinner.info('deploying composite')
  const deployComposite = await readEncodedComposite(ceramic, OUT_JSON_DIR)

  await deployComposite.startIndexingOn(ceramic)
  spinner.succeed('composite deployed & ready for use')
}

/**
 * Authenticating DID for publishing composite
 * @param {CeramicClient} ceramic - initialised ceramic client
 * @return {Promise<void>} - return void when DID is authenticated.
 */
async function authenticate(ceramic: CeramicClient): Promise<void> {
  const seed = process.env.PRIVATE_KEY
  if (seed === undefined) {
    console.log('Please add PRIVATE_KEY env to .env file')
    throw Error('Private Key not found!')
  }
  const key = fromString(seed.toString(), 'base16')
  const did = new DID({
    resolver: getResolver(),
    provider: new Ed25519Provider(key),
  })
  await did.authenticate()
  ceramic.did = did
}

async function main(): Promise<void> {
  const ceramic = new CeramicClient(CERAMIC_NODE_URL)

  await authenticate(ceramic)
  await writeComposite(ceramic)
}

main()
  .then(() => 1)
  .catch(console.error)
