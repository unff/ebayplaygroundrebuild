const path = require("path")
const url = require("url")

const { app, BrowserWindow, ipcMain } = require("electron")
// load in the helper functions
const ebayTokens = require('./electron/ebay-tokens.js')

let windows = new Set() // create a set to hold the window objects

// APP INITIALIZATION

app.on("ready", createWindow)

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// initialize the app's main window. It's another mac thing I will probably get wrong.
app.on("activate", (e, hasVisibleWindows) => {
  if (!hasVisibleWindows) { // only fire a new main window if there isn't one already running
    createWindow()
  }
})

// MAIN WINDOW

function createWindow() {
  win = new BrowserWindow({ 
    width: 1200, 
    height: 1000,
    show: false,
    icon: path.join(__dirname, 'assets/icons/64x64.png')
  })
  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/build/index.html`),
      protocol: "file:",
      slashes: true
    })
  )

  win.once('ready-to-show', () => {
    win.show()
    //win.maximize()
    //win.toggleDevTools()
  })

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on("closed", () => {
    windows.delete(win)
    win = null
  })

  windows.add(win)
}

// AUTH WINDOW

const authWindow = (ipcEvent, config) => {
  authWin = new BrowserWindow({
    width: 1000,
    height: 1000,
    show: false
  })
  
  authWin.loadURL(ebayTokens.fullAuthURL(config)) // Load ebay auth URL
  authWin.once('ready-to-show', () => {
    authWin.show()
  })

  authWin.on("closed", () => {
    windows.delete(authWin)
    authWin = null
  })

  authWin.webContents.on('did-get-redirect-request', (e, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, referrer, headers) => {
    // This one catches initial code redirects that happen when you are already logged in via cache.
    ebayTokens.oauthCallback(newURL, authWin, ipcEvent, config)
  })

  authWin.webContents.on('will-navigate', (event, newUrl) => {
    // This one catches fresh logins.
    ebayTokens.oauthCallback(newUrl, authWin, ipcEvent, config)
  })

  authWin.webContents.on('did-navigate', (e, url) => {
    // This one catches intermediate redirects like from the login to the consent form.
    //console.log('did navigate: '+ url)
  })

  windows.add(authWin)
}

// IPC SECTION 

ipcMain.on('do-auth', (ipcEvent, arg) => {
  // Catch 'do-auth' from the renderer and fire up the auth window.  
  // we have to pass this IPC event object around like a hot potato
  authWindow(ipcEvent, arg) // hot potato here
})

ipcMain.on('renew-token', (ipcEvent, arg) => {
  // This is a main window call
  // token, ipcEvent, config
  ebayTokens.renewAccessToken(arg.token, ipcEvent, arg.config)
})

