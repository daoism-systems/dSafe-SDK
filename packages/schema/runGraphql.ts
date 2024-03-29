import { serveEncodedDefinition } from '@composedb/devtools-node'

import { CERAMIC_NODE_URL } from './constants.js'
import { fromString } from 'uint8arrays'
import { DID } from 'dids'
import { getResolver } from 'key-did-resolver'
import { Ed25519Provider } from 'key-did-provider-ed25519'

async function runGraphql(): Promise<void> {
  /**
   * Runs GraphiQL server to view & query composites.
   */
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
  if (process.env.PORT_NUMBER === undefined) {
    throw Error('Invalid Port Number')
  }
  if (process.env.FILE_PATH === undefined) {
    throw Error('Invalid File Path')
  }
  const server = await serveEncodedDefinition({
    ceramicURL: CERAMIC_NODE_URL ?? 'http://0.0.0.0:7007',
    graphiql: true,
    path: process.env.FILE_PATH,
    did,
    port: parseInt(process.env.PORT_NUMBER),
  })

  console.log(`Server started on http://0.0.0.0:${process.env.PORT_NUMBER}`)

  process.on('SIGTERM', () => {
    server.stop().then(console.log).catch(console.error)
  })
}

runGraphql().then(console.log).catch(console.error);
