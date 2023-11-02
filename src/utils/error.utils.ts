import Logger from './Logger.utils'
const log = new Logger()

export function throwError(errorMessage: string, e?: Error): void {
  if (e !== undefined) {
    log.error('ERROR: ', [e])
  }
  throw Error(errorMessage)
}
