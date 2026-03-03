const pkg = require('./package.json')
const appName = pkg.productName ?? pkg.name

let packagerConfig = {
  icon: 'build/icon',
  protocols: [{ name: appName, schemes: [pkg.name] }]
}

if (process.env.MAC_CODESIGN_IDENTITY) {
  packagerConfig = {
    ...packagerConfig,
    osxSign: {
      identity: process.env.MAC_CODESIGN_IDENTITY
    },
    osxNotarize: {
      keychainProfile: 'notary'
    }
  }
}

module.exports = {
  packagerConfig,

  makers: [
    {
      name: '@electron-forge/maker-dmg',
      platforms: ['darwin'],
      config: {}
    },
    {
      name: '@forkprince/electron-forge-maker-appimage',
      platforms: ['linux']
    },
    {
      name: '@electron-forge/maker-msix',
      platforms: ['win32']
      config: {
        windowsSignOptions: {
          signWithParams: `/a /fd SHA256 /t http://timestamp.digicert.com /n ${process.env.WIN_SUBJECT} /sha1 ${process.env.WIN_THUMBPRINT}`
        }
      }
    }
  ],

  plugins: [
    {
      name: 'electron-forge-plugin-universal-prebuilds',
      config: {}
    },
    {
      name: 'electron-forge-plugin-prune-prebuilds',
      config: {}
    }
  ]
}
