const { app, BrowserWindow, net, ipcMain } = require("electron")
const path = require("path")
const url = require("url")
const config = require("./config.json")  // may need to move to Angular.

let windows = new Set()

let win, authWin = null

global.ebayData = {}

function fullAuthURL(config) {
  let scope = encodeURIComponent(
    config.scope
    .reduce((acc, val)=> acc+' '+val)
    //.trim()
  )
  return  config.authorizeUrl
          +"?client_id="+config.clientId
          +"&response_type=code"
          +"&redirect_uri="+config.ruName
          +"&scope="+scope
  }

function oauthCallback(url, window, ipcEvent, config) {
  // regex!  ebay returns a code good for 5 minutes you can use to create a token set.  get the code.
  let raw_code = /code=([^&]*)/.exec(url)
  let code = (raw_code && raw_code.length > 1) ? raw_code[1]: null // assuming a code was returned, set code equal to the first cap group (the bit after 'code=')
  let error = /\?error=(.+)$/.exec(url)
  if (code || error) {
    window.close()
  }
  if (code) {
    // do code related things
    // console.log(`code: ${code}`)
    requestToken(code, ipcEvent, config)
  } else if (error) {
    // do error related things using error[1]
    console.log(`error: ${error}`)
  }
}

function requestToken(code, ipcEvent, config) {
  //console.info('token requested')
  // this thing needs to take the code returned and make a token set out of it.
  // Set tokens to localStorage? no - return them to ng so it can store them.
  let authCode = Buffer.from(config.clientId+":"+config.secret).toString('base64') // btoa doesnt exist in node
  let request = net.request({
    method: 'POST',
    protocol: 'https:',
    hostname: 'api.ebay.com',
    path: 'identity/v1/oauth2/token'
  })
  request.setHeader('Content-Type','application/x-www-form-urlencoded')
  request.setHeader('Authorization', `Basic ${authCode}`)
  request.end(`grant_type=authorization_code&code=${code}&redirect_uri=${config.ruName}`)

  request.on('response', (response) => {
    let body = ''
    response.on('data', (chunk)=> {
      body += chunk
    })
    response.on('end', () => {
      //console.log(body)
      var parsed = JSON.parse(body)
      //console.log(parsed.refresh_token)
      console.log(ipcEvent.sender)
      ipcEvent.sender.send('tokens-received', parsed)
    })

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
    win.maximize()
    win.toggleDevTools()
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

// IPC SECTION 

ipcMain.on('do-auth', (ipcEvent, arg) => {
  // Catch 'do-auth' from the renderer and fire up the auth window.  
  // we have to pass this IPC event object around like a hot potato
  authWindow(ipcEvent, arg) // hot potato here
})

// Auth window
const authWindow = exports.authWindow = (ipcEvent, config) => {
  authWin = new BrowserWindow({
    width: 600,
    height: 1000,
    show: false
  })
  
  //const ses = authWin.webContents.session
  //ses.clearAuthCache(() => {})
  //ses.clearCache(() => {})
  authWin.loadURL(fullAuthURL(config)) // Load ebay auth URL
  authWin.once('ready-to-show', () => {
    authWin.show()
  })

  authWin.on("closed", () => {
    windows.delete(win)
    authWin = null
  })

  authWin.webContents.on('did-get-redirect-request', (e, oldURL, newURL, isMainFrame, httpResponseCode, requestMethod, referrer, headers) => {
    // This one catches initial code redirects that happen when you are already logged in via cache.
    oauthCallback(newURL, authWin, ipcEvent, config)
  })

  authWin.webContents.on('will-navigate', (event, newUrl) => {
    // This one catches fresh logins.
    oauthCallback(newUrl, authWin, ipcEvent, config)
  })

  authWin.webContents.on('did-navigate', (e, url) => {
    // This one catches intermediate redirects like from the login to the consent form.
    //console.log('did navigate: '+ url)
  })

  windows.add(authWin)
}


// let authUrl = (sandbox) => {

// }
