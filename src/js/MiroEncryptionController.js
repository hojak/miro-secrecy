// const APP_ID = '3074457361019166452'

const aes256 = require('aes256')

class MiroEncryptionController {
  static ENCRYPTION_PREFIX () { return '<p>Encrypted content - do not edit!</p><p>' }
  static ENCRYPTION_SUFFIX () { return '</p>' }

  constructor (miro, idStore, idDecrypt) {
    const $this = this
    this.miro = miro
    this.miroBoardId = undefined

    $this.miro.onReady(() => {
      $this.hideForm()
      $this.registerClickHandler()
      $this.registerStoreButton(idStore)
      $this.registerDecryptButton(idDecrypt)
      $this.registerPasswordInputEvents()

      this.initOnCurrentMiroBoard()
    })
  }

  async registerClickHandler () {
    const $this = this
    $this.miro.addListener(this.miro.enums.event.SELECTION_UPDATED, () => $this.widgetClicked())
  }

  registerPasswordInputEvents () {
    const $this = this
    document.getElementById('input_password').onchange = function () {
      $this.storePassword(document.getElementById('input_password').value)
      $this.widgetClicked()
    }
  }

  registerStoreButton (id) {
    const $this = this
    document.getElementById(id).onclick = function () {
      $this.clearMessages()
      const password = document.getElementById('input_password').value

      if (password.length >= 4) {
        $this.storeEncryptedContentToCard(password)
      } else {
        $this.showAlert('Please use a password of at least 4 characters!')
      }
    }
  }

  clearMessages () {
    document.getElementById('alert').innerText = ''
  }

  showAlert (message) {
    document.getElementById('alert').innerText = message
  }

  registerDecryptButton (id) {
    const $this = this

    document.getElementById(id).onclick = function () {
      $this.storePlaintextContentToCard()
    }
  }

  storeEncryptedContentToCard (password) {
    const data = {
      meta: 'encrypted',
      title: document.getElementById('input_title').value,
      description: document.getElementById('input_description').value
    }

    const encrypted = MiroEncryptionController.ENCRYPTION_PREFIX() +
                  window.btoa(aes256.encrypt(password, JSON.stringify(data))) +
                  MiroEncryptionController.ENCRYPTION_SUFFIX()

    this.miro.board.widgets.update([{
      id: document.getElementById('input_widget_id').value,
      title: 'TOP SECRET',
      description: encrypted
    }])
  }

  storePlaintextContentToCard () {
    this.miro.board.widgets.update([{
      id: document.getElementById('input_widget_id').value,
      title: document.getElementById('input_title').value,
      description: this.encodeTextToMiro(document.getElementById('input_description').value)
    }])
  }

  async widgetClicked () {
    const $this = this
    $this.clearMessages()

    const widgets = await $this.miro.board.selection.get()
    if (widgets.length > 0 && widgets[0].type === 'CARD') {
      const decrypted = $this.decryptWidgetContent(widgets[0], document.getElementById('input_password').value)

      if (decrypted) {
        $this.displayCardsContent(decrypted)
      } else {
        $this.displayCardsContent(widgets[0])
      }
    } else {
      $this.hideForm()
    }
  }

  displayCardsContent (cardWidget) {
    document.getElementById('input_title').value = this.stripMiroHtml(cardWidget.title)
    document.getElementById('input_description').value = this.stripMiroHtml(cardWidget.description)
    document.getElementById('input_widget_id').value = cardWidget.id

    document.getElementById('tip').style.opacity = 0
    document.getElementById('cardform').style.opacity = 1
  }

  stripMiroHtml (content) {
    return content
      .replaceAll('<p>', '')
      .replaceAll('</p>', '\n\n')
      .replaceAll('<br />', '\n')
      .replaceAll('<br>', '\n')
      .replaceAll('&lt;', '<')
      .replaceAll('&gt;', '>')
      .replaceAll('&amp;', '&')
      .replaceAll('&#43;', '+')
      .replaceAll('&#61;', '=')
  }

  encodeTextToMiro (content) {
    return content
      .replaceAll('>', '&gt;')
      .replaceAll('<', '&lt;')
      .replaceAll('&', '&amp;')
      .replaceAll('  ', ' &nbsp;')
      .replaceAll('\n', '<br />')
  }

  hideForm () {
    document.getElementById('tip').style.opacity = 1
    document.getElementById('cardform').style.opacity = 0
  }

  decryptWidgetContent (card, password) {
    let description = card.description.replaceAll('&#43;', '+').replaceAll('&#61;', '=')

    if (card.title !== 'TOP SECRET' ||
          !description.startsWith(MiroEncryptionController.ENCRYPTION_PREFIX()) ||
          !description.endsWith(MiroEncryptionController.ENCRYPTION_SUFFIX())) {
      return undefined
    }

    description = description.substring(
      MiroEncryptionController.ENCRYPTION_PREFIX().length,
      description.length - MiroEncryptionController.ENCRYPTION_SUFFIX().length
    )

    try {
      const decrypted = aes256.decrypt(password, window.atob(description))
      const result = JSON.parse(decrypted)
      result.id = card.id

      return result
    } catch (error) {
      this.showAlert('Decryption failed - wrong password?')
    }
  }

  storePassword (password) {
    if (this.miroBoardId) {
      window.localStorage.setItem('password_' + this.miroBoardId, window.btoa(password))
    }
  }

  getPassword () {
    if (this.miroBoardId) {
      const stored = window.localStorage.getItem('password_' + this.miroBoardId)
      if (stored) {
        return window.atob(stored)
      }
    }

    return ''
  }

  initOnCurrentMiroBoard () {
    const $this = this
    this.miro.board.getInfo().then(data => {
      this.miroBoardId = data.id
      const currentPassword = $this.getPassword()
      if (currentPassword) {
        document.getElementById('input_password').value = currentPassword
      }
    })
  }
}

module.exports = MiroEncryptionController
