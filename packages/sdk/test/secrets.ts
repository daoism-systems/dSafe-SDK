import NETWORKS, { CAIP } from '../src/config/networks.js'

export const SAFE_ADDRESS = '0x6fa4ef12fA2Fea9e4eBD7E46C0Ffff8bfEF1a0F8'

export const TEST_ACCOUNT = '0x67BE2C36e75B7439ffc2DCb99dBdF4fbB2455930'

export const TEST_SAFE = '0x6fa4ef12fA2Fea9e4eBD7E46C0Ffff8bfEF1a0F8'

export const delegateAddress = '0xd18Cd50a6bDa288d331e3956BAC496AAbCa4960d'

export const testUsdt = '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06'

export const ceramicNodeNetwork = 'local'

export const chainId = NETWORKS.SEPOLIA

export const network: string = CAIP[chainId]

export const trxInput = {
  to: testUsdt,
  value: 1,
  data: '0x',
  operation: 0,
  safeTxGas: 0,
  baseGas: 0,
  gasPrice: 0,
  gasToken: '0x0000000000000000000000000000000000000000',
  refundReceiver: '0x0000000000000000000000000000000000000000',
  nonce: 1,
}
