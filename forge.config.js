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
          signWithParams: `/a /fd SHA256 /t http://timestamp.digicert.com /n "CN=&quot;Tether Operations, SA de CV&quot;, O=&quot;Tether Operations, SA de CV&quot;, L=San Salvador, C=SV, SERIALNUMBER=2025120324, OID.2.5.4.15=Private Organization, OID.1.3.6.1.4.1.311.60.2.1.3=SV" /sha1 "e57d4dcfc4eefd8ea64ef420ad5b8cdce88afff8"`
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
