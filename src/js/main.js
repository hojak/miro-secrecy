/* global miro */

const MiroSecrecyController = require('./MiroSecrecyController')

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  new MiroSecrecyController(miro)
}
