export const SCHMEA_DIRECTORY = './models'

export const SCHEMA_FILES_DIRECTORIES = {
  SAFE: `${SCHMEA_DIRECTORY}/01-safe.graphql`,
  TOKEN: `${SCHMEA_DIRECTORY}/02-token.graphql`,
  SIGNER: `${SCHMEA_DIRECTORY}/03-signer.graphql`,
  SIGNER_SAFE_RELATIONSHIP: `${SCHMEA_DIRECTORY}/04-signer-safe-relation.graphql`,
  SIGNER_BACK_REFERENCE_SSR: `${SCHMEA_DIRECTORY}/05-signer-reference-signer-safe-relation.graphql`,
  DELEGATE: `${SCHMEA_DIRECTORY}/06-delegate.graphql`,
  TRANSACTION: `${SCHMEA_DIRECTORY}/07-transaction.graphql`,
  CONFIRMATION: `${SCHMEA_DIRECTORY}/08-confirmation.graphql`,
  TRANSACTION_CONFIRMATION: `${SCHMEA_DIRECTORY}/09-transaction-confirmations.graphql`,
  SAFE_RELATIONS: `${SCHMEA_DIRECTORY}/10-safe-relations.graphql`,
}

export const ID_VARIABLE_NAMES = {
  SAFE_ID: '$SAFE_ID',
  TRANSACTION_ID: '$TRANSACTION_ID',
  DELEGATE_ID: '$DELEGATE_ID',
  SIGNER_ID: '$SIGNER_ID',
  TOKEN_ID: '$TOKEN_ID',
  SIGNER_SAFE_RELATIONSHIP_ID: '$SIGNER_SAFE_RELATIONSHIP_ID',
  CONFIRMATION_ID: '$CONFIRMATION_ID',
}

export const CERAMIC_NODE_URL = process.env.CERAMIC_NODE_URL
export const ENVIRONMENT = process.env.ENVIRONMENT
export const PRIVATE_KEY = process.env.PRIVATE_KEY

const OUTPUT_DIRECTORY = 'out/__generated__'

const OUTPUT_FILE_NAME = `definitions.${ENVIRONMENT}`
const OUTPUT_JSON_FILE = `${OUTPUT_FILE_NAME}.json`
const OUTPUT_JS_FILE = `${OUTPUT_FILE_NAME}.js`

export const OUT_JSON_DIR = `./${OUTPUT_DIRECTORY}/${OUTPUT_JSON_FILE}`
export const OUT_JS_DIR = `./${OUTPUT_DIRECTORY}/${OUTPUT_JS_FILE}`

export const SDK_DEFINITIONS_DIR = `../sdk/__generated__`;
export const SDK_DEFINITIONS_JSON_FILE = `${SDK_DEFINITIONS_DIR}/${OUTPUT_JSON_FILE}`;
export const SDK_DEFINITIONS_JS_FILE = `${SDK_DEFINITIONS_DIR}/${OUTPUT_JS_FILE}`;
