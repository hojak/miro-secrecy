/* global miro */

const MiroEncryptionController = require('./MiroEncryptionController')

let miroEncryptionController = undefined

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  miroEncryptionController = new MiroEncryptionController(miro, "button_store", "button_decrypt")
}
