const iconLock = '<circle cx="12" cy="12" r="9" fill="none" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>'

const tagName = 'Top Secret'

const secretPassword = "isefhiuqwefiuabwfu"

const APP_ID = '3074457361019166452'

class MiroSecrecyController {
  constructor (miro) {
    const $this = this
    this.miro = miro

    $this.miro.onReady(() => {
      $this.addLockButton()
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

    $this.hasEncryptedWidgets().then ( answer => {
        if ( answer )  {
            $this.decryptTaggedWidgets()
        } else {
            $this.encryptTaggedWidgets()
        }
    })
  }


  async encryptTaggedWidgets () {
    console.log ( 'encrypt' )
    const $this = this
    await $this.miro.board.widgets.get({type: 'CARD'}).then(
      data => {
          
        let updateData = data.filter(
            item => (item.tags.map(tag => tag.title).filter(name => name === tagName).length) > 0
        ).map(element => {
            let data = {
                version: '0.1',
                title: window.btoa( element.title),
                description: window.btoa( element.description)
            }

            return {
                id: element.id,
                title: 'TOP SECRET',
                description: 'ENCRYPTED...' + JSON.stringify(data)
            }
        })
        
        $this.miro.board.widgets.update ( updateData )
    })
  }

  async decryptTaggedWidgets () {
    console.log ( 'decrypt' )
    const $this = this
    await $this.miro.board.widgets.get({type: 'CARD'}).then(
      data => {
          
        let updateData = data.filter(
            item => item.description.startsWith ( 'ENCRYPTED...')
        ).map(element => {
            let parsed = element.description
            .substring ( 'ENCRYPTED...'.length)
            .replaceAll ('<br>','')
            .trim() 
            .replaceAll ('&#34;', '"')
            .replaceAll ( '&#43;', '+')
            .replaceAll ( '&#61;', '=')

            console.log ( parsed )

            let data = JSON.parse ( parsed )

            return {
                id: element.id,
                title: window.atob(data.title),
                description: window.atob(data.description)
            }
        })
        
        $this.miro.board.widgets.update ( updateData )
    })
  }

  async hasEncryptedWidgets () {
    return await this.miro.board.widgets.get({type: 'CARD'}).then ( 
        data => {
            return data.filter ( 
                item => item.description.startsWith ( 'ENCRYPTED...')
            ).length > 0
        }
    )
  }




}

module.exports = MiroSecrecyController
