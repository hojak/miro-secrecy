// const APP_ID = '3074457361019166452'
class MiroEncryptionController {
  constructor (miro, idStore, idDecrypt) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.registerClickHandler()
      $this.registerStoreButton ( idStore)
      $this.registerDecryptButton (idDecrypt)
    })
  }

  async registerClickHandler () {
    const $this = this
    $this.miro.addListener(this.miro.enums.event.SELECTION_UPDATED, () => $this.widgetClicked())
  }

  registerStoreButton ( id ) {
    const $this = this
    document.getElementById(id).onclick = function() {
      $this.storeEncryptedContentToCard()
    }
  }

  registerDecryptButton ( id ) {
    const $this = this
    document.getElementById(id).onclick = function () {
      $this.storePlaintextContentToCard ()
    }
  }

  storeEncryptedContentToCard () {
    console.log ( "encrytion not yet implemented")
  }

  storePlaintextContentToCard() {
    console.log ( "stoing not yewt implemented")
  }

  async widgetClicked () {
    const $this = this

    const widgets = await $this.miro.board.selection.get()
    if (widgets.length > 0) {
      console.log(widgets[0])
    }
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
