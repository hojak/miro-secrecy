/* global alert */

// const APP_ID = '3074457361019166452'

const aes256 = require('aes256')

class MiroEncryptionController {
  constructor (miro, idStore, idDecrypt) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.hideForm()
      $this.registerClickHandler()
      $this.registerStoreButton(idStore)
      $this.registerDecryptButton(idDecrypt)
    })
  }

  async registerClickHandler () {
    const $this = this
    $this.miro.addListener(this.miro.enums.event.SELECTION_UPDATED, () => $this.widgetClicked())
  }

  registerStoreButton (id) {
    const $this = this
    document.getElementById(id).onclick = function () {
      const password = document.getElementById('input_password').value

      if (password.length >= 4) {
        $this.storeEncryptedContentToCard(password)
      } else {
        alert('Please use a password of at least 4 characters!')
      }
    }
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

    const encrypted = aes256.encrypt(password, JSON.stringify(data))

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
      description: document.getElementById('input_description').value
    }])
  }

  async widgetClicked () {
    const $this = this

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
    document.getElementById('input_title').value = cardWidget.title
    document.getElementById('input_description').value = cardWidget.description
    document.getElementById('input_widget_id').value = cardWidget.id

    document.getElementById('tip').style.opacity = 0
    document.getElementById('cardform').style.opacity = 1
  }

  hideForm () {
    document.getElementById('tip').style.opacity = 1
    document.getElementById('cardform').style.opacity = 0
  }

  decryptWidgetContent (card, password) {
    if (card.title !== 'TOP SECRET' || !card.description.endsWith('=')) {
      return undefined
    }

    try {
      const decrypted = aes256.decrypt(password, card.description)
      const result = JSON.parse(decrypted)
      result.id = card.id

      return result
    } catch (error) {
      alert('Decryption failed - wrong password?')
    }
  }
}

module.exports = MiroEncryptionController
