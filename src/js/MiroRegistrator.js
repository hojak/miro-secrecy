const iconLock = '<path fill-rule="evenodd" clip-rule="evenodd" d="M6 7V9H4C3.44772 9 3 9.44771 3 10V21C3 21.5523 3.44772 22 4 22H20C20.5523 22 21 21.5523 21 21V10C21 9.44771 20.5523 9 20 9H18V7C18 3.68629 15.3137 1 12 1C8.68629 1 6 3.68629 6 7ZM16 7V9H8V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7ZM5 11V20H19V11H5ZM10 15.5C10 16.6046 10.8954 17.5 12 17.5C13.1046 17.5 14 16.6046 14 15.5C14 14.3954 13.1046 13.5 12 13.5C10.8954 13.5 10 14.3954 10 15.5Z" fill="#050038"/>'

class MiroRegistrator {
  constructor (miro) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.addLockButton()
    })
  }

  async checkAuthorization () {
    const $this = this
    const isAuthorized = await $this.miro.isAuthorized()

    if (!isAuthorized) {
      // Ask the user to authorize the app.
      await $this.miro.requestAuthorization()
    }
  }

  async addLockButton () {
    const $this = this

    await $this.checkAuthorization()

    $this.miro.initialize({
      extensionPoints: {
        bottomBar: {
          title: 'Open Encryption Sidebar',
          svgIcon: iconLock,
          positionPriority: 1,
          onClick: () => $this.openSidebar()
        }
      }
    })
  }

  async openSidebar () {
    const $this = this
    $this.miro.board.ui.openLeftSidebar('sidebar.html')
  }
}

module.exports = MiroRegistrator
