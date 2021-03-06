// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

var path = require('path')

module.exports = function (ctx) {
  return {
    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    boot: [
      'i18n',
      'axios'
    ],

    css: [
      'app.styl'
    ],

    extras: [
      // 'ionicons-v4',
      // 'mdi-v3',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons' // optional, you are not bound to it
    ],

    framework: {
      // iconSet: 'ionicons-v4',
      // lang: 'de', // Quasar language

      // all: true, // --- includes everything; for dev only!

      components: [
        'QLayout',
        'QHeader',
        'QDrawer',
        'QPageContainer',
        'QPage',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QBtnDropdown',
        'QIcon',
        'QList',
        'QItem',
        'QItemSection',
        'QItemLabel',
        'QTabs',
        'QTab',
        'QRouteTab',
        'QTabPanels',
        'QTabPanel',
        'QSeparator',
        'QIcon',
        'QBtnGroup',
        'QBadge',
        'QInput',
        'QSpinner',
        'QSpinnerGears',
        'QAvatar',
        'QInnerLoading',
        'QDialog',
        'QCard',
        'QCardSection',
        'QCardActions',
        'QForm'
      ],

      directives: [
        'Ripple',
        'ClosePopup',
        'Scroll'
      ],

      // Quasar plugins
      plugins: [
        'Notify'
      ]
    },

    supportIE: true,

    build: {
      scopeHoisting: true,
      // vueRouterMode: 'history',
      // vueCompiler: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      extendWebpack (cfg) {
        cfg.resolve.alias = {
          ...cfg.resolve.alias,
          '~': path.resolve(__dirname, './src')
        }
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            formatter: require('eslint').CLIEngine.getFormatter('stylish')
          }
        })
      }
    },

    devServer: {
      // https: true,
      port: 8080,
      open: true // opens browser window automatically
    },

    // animations: 'all', // --- includes all animations
    animations: [],

    ssr: {
      pwa: false
    },

    pwa: {
      // workboxPluginMode: 'InjectManifest',
      // workboxOptions: {}, // only for NON InjectManifest
      manifest: {
        name: 'appGitMarkdownDocs',
        short_name: 'appGitMarkdownDocs',
        description: 'A Quasar Framework app',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },

    cordova: {
      // id: 'org.app_git_markdown_docs.app',
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    electron: {
      bundler: 'builder', // or 'packager'

      extendWebpack (cfg) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration
        "productName": "appGitMarkdownDocs",
        
        "appId": "com.hightemp.app_git_markdown_docs",
        "copyright": "",
        "directories": {
          "output": "releases"
        },
        "mac": {
          "target": [
            "dmg",
            "pkg",
            "zip"
          ],
          "category": "public.app-category.utilities",
          "type": "distribution"
        },
        "dmg": {
          "iconSize": 160,
          "iconTextSize": 12,
          "window": {
            "width": 660,
            "height": 400
          },
          "contents": [
            {
              "x": 180,
              "y": 170,
              "type": "file"
            },
            {
              "x": 480,
              "y": 170,
              "type": "link",
              "path": "/Applications"
            }
          ]
        },
        "pkg": {
        },
        "win": {
          "target": [
            "nsis",
            "portable",
            "zip"
          ],
        },
        "nsis": {
          "warningsAsErrors": false
        },
        "linux": {
          "target": [
            "AppImage",
            "deb",
            "rpm",
            "snap"
          ],
          "category": "Utility"
        },
        "snap": {
          "grade": "stable",
          "summary": ""
        },
        "publish": {
          "provider": "github",
          "owner": "appGitMarkdownDocs",
          "releaseType": "release",
          "publishAutoUpdate": true
        }
      }
    }
  }
}
