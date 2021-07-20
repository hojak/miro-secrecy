// const APP_ID = '3074457361019166452'
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
      $this.storeEncryptedContentToCard()
    }
  }

  registerDecryptButton (id) {
    const $this = this
    document.getElementById(id).onclick = function () {
      $this.storePlaintextContentToCard()
    }
  }

  storeEncryptedContentToCard () {
    console.log('encrytion not yet implemented')
  }

  storePlaintextContentToCard () {
    console.log('stoing not yewt implemented')
  }

  async widgetClicked () {
    const $this = this

    const widgets = await $this.miro.board.selection.get()
    if (widgets.length > 0 && widgets[0].type === 'CARD') {
      $this.displayCardsContent(widgets[0])
    } else {
      $this.hideForm()
    }
  }

  displayCardsContent (cardWidget) {
    document.getElementById("input_title").value = cardWidget.title
    document.getElementById("input_description").value = cardWidget.description

    document.getElementById("tip").style.opacity = 0
    document.getElementById("cardform").style.opacity = 1
  
  }

  hideForm () {
    document.getElementById("tip").style.opacity = 1
    document.getElementById("cardform").style.opacity = 0
  }

  async getContentOfEncryptedCard (id, password) {
    const $this = this
    return await $this.miro.board.widgets.get({ type: 'CARD', id: id }).map(element => {
      return {
        title: 'test',
        description: 'test'
      }
    })
  }
}

module.exports = MiroEncryptionController
