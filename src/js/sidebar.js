/* global miro */

const MiroEncryptionController = require('./MiroEncryptionController')

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  new MiroEncryptionController(miro, 'button_encrypt', 'button_plain')
}
