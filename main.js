const { app, BrowserWindow, net } = require("electron")
const path = require("path")
const url = require("url")
const config = require("./config.json")

let windows = new Set()


function oauthCallback(url, window) {
  // regex!  ebay returns a code good for 5 minutes you can use to create a token set.  get the code.
  let raw_code = /code=([^&]*)/.exec(newUrl)
  let code = (raw_code && raw_code.length > 1) ? raw_code[1]: null // assuming a code was returned, set code equal to the first cap group (the bit after 'code=')
  let error = /\?error=(.+)$/.exec(newUrl)
  if (code || error) {
    window.close()
  }
  if (code) {
    // do code related things
    alert(code)
  } else if (error) {
    // do error related things using error[1]
    alert(error)
  }
}

function requestToken(code) {
  // this thing needs to take the code returned and make a token set out of it.
  // Set tokens to localStorage?
  let request = net.request({
    method: 'POST',
    protocol: 'https',
    hostname: 'ebay.com',
    path: '/'
  })
}

function createWindow() {
  win = new BrowserWindow({ 
    width: 800, 
    height: 600,
    show: false 
  })

  // load the dist folder from Angular
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/index.html`),
      protocol: "file:",
      slashes: true
    })
  )

  win.once('ready-to-show', () => {
    win.show()
  })

  // The following is optional and will open the DevTools:
  // win.webContents.openDevTools()

  win.on("closed", () => {
    windows.delete(win)
    win = null
  })

  windows.add(win)
}

app.on("ready", createWindow)

// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// initialize the app's main window
app.on("activate", () => {
  if (win === null) {
    createWindow()
  }
})

// Auth window
const authWindow = exports.authWindow = () => {
  authWin = new BrowserWindow({
    width: 600,
    height: 1000,
    show: false
  })
  
  authWin.loadURL(tempAuthUrl) // Load ebay auth URL

  authWin.once('ready-to-show', () => {
    authWin.show()
  })

  authWin.on("closed", () => {
    windows.delete(win)
    authWin = null
  })

  authWin.webContents.on('will-navigate', (event, newUrl) => {
    oauthCallback(newUrl, authWindow)
  })

  windows.add(authWin)
}

// let authUrl = (sandbox) => {

// }
let scope = encodeURIComponent(
  config.ebay.scope
  .reduce((acc, val)=> acc+' '+val)
  //.trim()
)
let tempAuthUrl = config.ebay.authorizeUrl
    +"?client_id="+config.ebay.clientId
    +"&response_type=code"
    +"&redirect_uri="+config.ebay.ruName
    +"&scope="+scope

//console.log(tempAuthUrl)