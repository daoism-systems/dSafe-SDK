export default class Logger {
  LogTypes = {
    ERROR: 'Error',
    INFO: 'Info',
  }

  /**
   *
   * @param logType What type of log is it
   * @param message Message to be logged
   * @param extras Array of variables to be logged
   */
  private log(logType: string, message: string, extras: Array<any>): void {
    console.log(`-------------------${logType} START-------------------`)
    console.log(`${message}`, ...extras)
    console.log(`--------------------${logType} END--------------------`)
  }

  /**
   * @notice log information
   * @param message message to be displayed
   * @param extras array of any variables to be logged
   */
  info(message: string, extras: Array<any>): void {
    this.log(this.LogTypes.INFO, message, extras)
  }

  /**
   * @notice Logs error
   * @param message error message
   * @param extras any variables to log
   */
  error(message: string, extras: Array<any>): void {
    this.log(this.LogTypes.ERROR, message, extras)
  }
}
