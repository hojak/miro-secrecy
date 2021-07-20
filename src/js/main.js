/* global miro */

const MiroRegistrator = require('./MiroRegistrator')

window.onload = function () {
  // without "new", this line fails in the browser...
  // eslint-disable-next-line no-new
  new MiroRegistrator(miro)
}
