import fs from 'fs'
import path from 'path'
import {
  OUT_JSON_DIR,
  OUT_JS_DIR,
  SDK_DEFINITIONS_JSON_FILE,
  SDK_DEFINITIONS_JS_FILE,
} from './constants.js'

/**
 * Move a file from one package to another in a monorepo.
 *
 * @param srcPath The source path of the file.
 * @param destPath The destination path of the file.
 */
async function moveFile(srcPath: string, destPath: string): Promise<void> {
  try {
    // Check if the source file exists
    if (!fs.existsSync(srcPath)) {
      throw new Error(`Source file does not exist: ${srcPath}`)
    }

    // Ensure the destination directory exists
    const destDir = path.dirname(destPath)
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true })
      console.log(`Created destination directory: ${destDir}`)
    }

    // Copy the file
    fs.copyFileSync(srcPath, destPath)
    console.log(`File copied from ${srcPath} to ${destPath}`)
  } catch (error) {
    console.error('Error copying file:', error)
  }
}

// Example usage
const srcJSONFilePath = OUT_JSON_DIR // Update with actual source file path
const srcJSFilePath = OUT_JS_DIR // Update with actual source file path
const destJSONFilePath = SDK_DEFINITIONS_JSON_FILE
const destJSFilePath = SDK_DEFINITIONS_JS_FILE

moveFile(srcJSONFilePath, destJSONFilePath).then(console.log).catch(console.error);
moveFile(srcJSFilePath, destJSFilePath).then(console.log).catch(console.error);
