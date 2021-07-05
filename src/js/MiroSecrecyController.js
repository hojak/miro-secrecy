const iconLock = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>'
const iconUnlock = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="1"/>'

const tagName = 'Top Secret'

class MiroSecrecyController {
  constructor (miro) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.addLockButton()
      // $this.addUnlockButton()
    })
  }

  addUnlockButton () {
    console.log('adding unlock button!')
    const $this = this

    $this.miro.initialize({
      extensionPoints: {
        bottomBar: {
          title: 'Decrypt Top Secret Widgets',
          svgIcon: iconUnlock,
          onClick: () => $this.handleUnlockButtonClick()
        }
      }
    })
  }

  addLockButton () {
    console.log('adding lock button')
    const $this = this

    $this.miro.initialize({
      extensionPoints: {
        bottomBar: {
          title: 'Encrypt Top Secret Widgets',
          svgIcon: iconLock,
          onClick: () => $this.handleLockButtonClick()
        }
      }
    })
  }

  async checkAuthorization () {
    const $this = this
    const isAuthorized = await $this.miro.isAuthorized()

    console.log('checking auth!')

    if (!isAuthorized) {
      // Ask the user to authorize the app.
      await $this.miro.requestAuthorization()
    } else {
      console.log('authorized!')
    }
  }

  async handleLockButtonClick () {
    const $this = this
    await $this.checkAuthorization()

    console.log('lock!')

    $this.encryptTaggedWidgets()
  }

  async handleUnlockButtonClick () {
    const $this = this
    await $this.checkAuthorization()

    console.log('unlock!')
  }

  async encryptTaggedWidgets () {
    await this.miro.board.widgets.get().then(
      data => data.filter(
        item => (item.tags.map(tag => tag.title).filter(name => name === tagName).length) > 0
      )
        .forEach(element => {
          console.log('found item:')
          console.log(element)
        })
    )
  }
}

module.exports = MiroSecrecyController
